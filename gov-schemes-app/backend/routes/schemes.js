const express = require('express');
const router = express.Router();
const Scheme = require('../models/Scheme');

// Get all schemes
router.get('/', async (req, res) => {
  try {
    const schemes = await Scheme.find({});
    res.json(schemes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single scheme by ID
router.get('/:id', async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ error: 'Scheme not found' });
    res.json(scheme);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /add — insert one or multiple schemes
router.post('/add', async (req, res) => {
  try {
    const data = Array.isArray(req.body) ? req.body : [req.body];
    const inserted = await Scheme.insertMany(data);
    res.json({ inserted: inserted.length, schemes: inserted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE by name pattern (admin cleanup)
router.delete('/cleanup', async (req, res) => {
  try {
    const { pattern } = req.query;
    const result = await Scheme.deleteMany({ name: { $regex: pattern, $options: 'i' } });
    res.json({ deleted: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /:id — update a scheme
router.put('/:id', async (req, res) => {
  try {
    const updated = await Scheme.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Scheme not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Seed schemes (for initial setup)
router.post('/seed', async (req, res) => {
  const initialSchemes = [
    {
      name: "Pradhan Mantri Jan Dhan Yojana (PMJDY)",
      category: "Finance",
      eligibility: "Any Indian citizen aged 10 and above",
      benefit: "Basic savings bank account, RuPay debit card, ₹2 lakh accident insurance",
      link: "https://pmjdy.gov.in"
    },
    {
      name: "Sukanya Samriddhi Yojana",
      category: "Education/Finance",
      eligibility: "Girl child below 10 years of age",
      benefit: "High interest savings account for girl's education and marriage",
      link: "https://www.indiapost.gov.in"
    },
    {
      name: "Pradhan Mantri Mudra Yojana",
      category: "Business",
      eligibility: "Non-corporate, non-farm small/micro enterprises",
      benefit: "Loans up to ₹10 Lakhs",
      link: "https://www.mudra.org.in"
    },
    {
      name: "National Scholarship Portal",
      category: "Education",
      eligibility: "Students from minority/backward communities",
      benefit: "Financial assistance for education",
      link: "https://scholarships.gov.in"
    },
    {
      name: "PM Kisan Samman Nidhi",
      category: "Agriculture",
      eligibility: "Small and marginal farmer families",
      benefit: "₹6,000 per year",
      link: "https://pmkisan.gov.in"
    }
  ];

  try {
    await Scheme.deleteMany({});
    const createdSchemes = await Scheme.insertMany(initialSchemes);
    res.json(createdSchemes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
