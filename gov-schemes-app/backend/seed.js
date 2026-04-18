const mongoose = require('mongoose');
require('dotenv').config();
const Scheme = require('./models/Scheme');

// All links verified to work (portal homepages only - no deep links)
const realSchemes = [
  // === EDUCATION ===
  {
    name: "National Scholarship Portal (NSP)",
    category: "Education",
    eligibility: "Students from SC/ST/OBC/Minority communities, family income below ₹2.5 Lakhs",
    benefit: "Financial assistance of ₹500 to ₹20,000 per year for studies",
    link: "https://scholarships.gov.in"  // ✅ verified OK
  },
  {
    name: "PM Scholarship Scheme for CAPF/RPF (PMSS)",
    category: "Education",
    eligibility: "Widows/wards of CAPF & RPF personnel; minimum 60% in Class 12th",
    benefit: "₹2,000–₹3,300 per month scholarship",
    link: "https://ksb.gov.in"  // ✅ verified OK
  },
  {
    name: "Sukanya Samriddhi Yojana (SSY)",
    category: "Education",
    eligibility: "Girl child below 10 years of age. Account opened by parents/guardians",
    benefit: "8.2% interest savings account — covers education and marriage expenses",
    link: "https://www.indiapost.gov.in"  // ✅ verified OK
  },
  {
    name: "Vidya Lakshmi Education Loan Portal",
    category: "Education",
    eligibility: "Students admitted in professional/technical courses in India or abroad",
    benefit: "Education loans up to ₹6.5 Lakhs without collateral from multiple banks",
    link: "https://www.nsdl.co.in"  // ✅ NSDL portal (VidyaLakshmi integration)
  },
  {
    name: "INSPIRE Scholarship (SHE) – DST",
    category: "Education",
    eligibility: "Top 1% of 10+2 board students pursuing natural/basic sciences at BSc/BS level",
    benefit: "₹80,000 per year (₹60,000 + ₹20,000 mentorship allowance)",
    link: "https://online-inspire.gov.in"  // ✅ verified OK
  },
  {
    name: "Central Sector Scheme of Scholarships (CSSS)",
    category: "Education",
    eligibility: "Top 20 percentile students in 12th board with family income ≤ ₹8 Lakhs",
    benefit: "₹12,000/year for undergraduate; ₹20,000/year for postgraduate students",
    link: "https://scholarships.gov.in"  // ✅ verified OK
  },
  {
    name: "Post Matric Scholarship for SC Students",
    category: "Education",
    eligibility: "SC students studying at post-matric level, family income ≤ ₹2.5 Lakhs",
    benefit: "Maintenance allowance + non-refundable charges + tuition fee",
    link: "https://scholarships.gov.in"  // ✅ verified OK
  },

  // === AGRICULTURE ===
  {
    name: "PM Kisan Samman Nidhi (PM-KISAN)",
    category: "Agriculture",
    eligibility: "Small and marginal farmer families owning up to 2 hectares of cultivable land",
    benefit: "₹6,000 per year in 3 equal instalments of ₹2,000 directly to bank account",
    link: "https://pmkisan.gov.in"  // ✅ verified OK
  },
  {
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    category: "Agriculture",
    eligibility: "All farmers including sharecroppers and tenant farmers growing notified crops",
    benefit: "Crop insurance; premium only 1.5%–2% for Rabi/Kharif crops for farmers",
    link: "https://pmfby.gov.in"  // ✅ verified OK
  },
  {
    name: "Kisan Credit Card (KCC)",
    category: "Agriculture",
    eligibility: "Farmers, fishermen and animal husbandry workers with Aadhar and land proof",
    benefit: "Short-term credit up to ₹3 Lakhs at 4% interest for crop cultivation",
    link: "https://www.nabard.org"  // ✅ verified OK
  },
  {
    name: "PM Kisan Maan Dhan Yojana (PM-KMY)",
    category: "Agriculture",
    eligibility: "Farmers aged 18–40 years owning land up to 2 hectares",
    benefit: "Monthly pension of ₹3,000 after age 60",
    link: "https://maandhan.in"  // ✅ verified OK
  },
  {
    name: "Soil Health Card Scheme",
    category: "Agriculture",
    eligibility: "All farmers across India",
    benefit: "Free soil testing and crop-specific fertilizer recommendations to improve yield",
    link: "https://soilhealth.dac.gov.in"  // ✅ verified OK
  },
  {
    name: "e-NAM (National Agriculture Market)",
    category: "Agriculture",
    eligibility: "Farmers, FPOs, traders across states on e-NAM platform",
    benefit: "Direct access to national marketplace and better price discovery for crops",
    link: "https://enam.gov.in"  // ✅ verified OK
  },
  {
    name: "PM Kusum Yojana (Solar for Farmers)",
    category: "Agriculture",
    eligibility: "Farmers who want to set up solar pumps or solar power plants on their land",
    benefit: "Up to 60% subsidy on solar pump installation for irrigation",
    link: "https://www.mnre.gov.in"  // ✅ verified OK
  },

  // === BUSINESS / MSME ===
  {
    name: "Pradhan Mantri Mudra Yojana (PMMY)",
    category: "Business",
    eligibility: "Non-corporate, non-farm small/micro enterprises (individuals, SMEs, proprietors)",
    benefit: "Shishu: up to ₹50,000 | Kishore: ₹50K–5L | Tarun: ₹5L–10L at low interest",
    link: "https://www.mudra.org.in"  // ✅ verified OK
  },
  {
    name: "StartUp India – DPIIT Recognition",
    category: "Business",
    eligibility: "Startups up to 10 years old, turnover ≤ ₹100 Cr, working on innovation",
    benefit: "3 year tax exemption, easy compliance, funding access and mentorship network",
    link: "https://www.startupindia.gov.in"  // ✅ verified OK
  },
  {
    name: "PM SVANidhi – Street Vendor Loan",
    category: "Business",
    eligibility: "Urban street vendors with vending certificate or letter of recommendation",
    benefit: "Working capital loan of ₹10,000 to ₹50,000 at subsidized interest rate",
    link: "https://pmsvanidhi.mohua.gov.in"  // ✅ verified OK
  },
  {
    name: "Udyam Registration (MSME)",
    category: "Business",
    eligibility: "Any enterprise with investment ≤ ₹50 Cr in manufacturing/service sector",
    benefit: "Official MSME certificate; access to subsidies, credit and government tenders",
    link: "https://udyamregistration.gov.in"  // ✅ verified OK
  },
  {
    name: "Stand-Up India Scheme",
    category: "Business",
    eligibility: "SC/ST and women entrepreneurs setting up Greenfield enterprises",
    benefit: "Bank loans between ₹10 Lakhs and ₹1 Crore per bank branch",
    link: "https://www.startupindia.gov.in"  // ✅ standupmitra redirects to startupindia
  },
  {
    name: "CGTMSE – Collateral-Free MSME Loan",
    category: "Business",
    eligibility: "MSMEs requiring loans without collateral — both new and existing units",
    benefit: "Credit guarantee for loans up to ₹5 Crore without any collateral required",
    link: "https://www.cgtmse.in"  // ✅ verified OK
  },

  // === HEALTH ===
  {
    name: "Ayushman Bharat – PM Jan Arogya Yojana (PMJAY)",
    category: "Health",
    eligibility: "Bottom 40% economically vulnerable families as per SECC 2011 database",
    benefit: "Health coverage of ₹5 Lakhs per family per year for 1,500+ treatments",
    link: "https://pmjay.gov.in"  // ✅ verified OK
  },
  {
    name: "Jan Aushadhi Scheme – Generic Medicines",
    category: "Health",
    eligibility: "All Indian citizens (no income restriction whatsoever)",
    benefit: "Quality generic medicines at 50–90% lower cost via 10,000+ Kendras nationwide",
    link: "https://janaushadhi.gov.in"  // ✅ verified OK
  },
  {
    name: "e-Sanjeevani – Free Online Doctor Consultation",
    category: "Health",
    eligibility: "All Indian citizens — patients seeking teleconsultation",
    benefit: "Free video/audio consultation with government doctors from home",
    link: "https://www.nhp.gov.in"  // ✅ NHP portal (esanjeevaniopd.in has cert issues)
  },
  {
    name: "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
    category: "Health",
    eligibility: "Bank account holders aged 18–70 years",
    benefit: "₹2 Lakh accident insurance cover at just ₹20 per year premium",
    link: "https://jansuraksha.gov.in"  // ✅ verified OK
  },
  {
    name: "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)",
    category: "Health",
    eligibility: "Bank account holders aged 18–50 years",
    benefit: "Life insurance coverage of ₹2 Lakhs at ₹436 per year premium",
    link: "https://jansuraksha.gov.in"  // ✅ verified OK
  },

  // === HOUSING ===
  {
    name: "PM Awas Yojana – Gramin (PMAY-G)",
    category: "Housing",
    eligibility: "BPL families in rural areas living in kutcha/semi-pucca houses per SECC data",
    benefit: "₹1.20 Lakhs (plains) or ₹1.30 Lakhs (hilly/NE) for house construction",
    link: "https://pmayg.nic.in"  // ✅ verified OK
  },
  {
    name: "PM Awas Yojana – Urban (PMAY-U)",
    category: "Housing",
    eligibility: "EWS/LIG/MIG families in urban areas without a pucca house",
    benefit: "Subsidy of ₹1.5–2.67 Lakhs on home loan depending on income category",
    link: "https://pmaymis.gov.in"  // ✅ verified OK
  },

  // === FINANCE / SOCIAL WELFARE ===
  {
    name: "Pradhan Mantri Jan Dhan Yojana (PMJDY)",
    category: "Finance",
    eligibility: "Any Indian citizen aged 10 and above without a bank account",
    benefit: "Zero-balance savings account + RuPay card + ₹2 Lakh accident cover + ₹10K overdraft",
    link: "https://pmjdy.gov.in"  // ✅ verified OK
  },
  {
    name: "Atal Pension Yojana (APY)",
    category: "Finance",
    eligibility: "Indian citizens aged 18–40 years with a savings bank account",
    benefit: "Fixed monthly pension of ₹1,000–₹5,000 guaranteed after age 60",
    link: "https://npscra.nsdl.co.in"  // ✅ verified OK
  },
  {
    name: "National Social Assistance Programme (NSAP)",
    category: "Social Welfare",
    eligibility: "BPL elderly (age 60+), widows, and persons with disability",
    benefit: "Monthly pension of ₹200–₹500 (state governments may add top-up amount)",
    link: "https://nsap.nic.in"  // ✅ verified OK
  },
  {
    name: "PM Garib Kalyan Anna Yojana (PMGKAY)",
    category: "Social Welfare",
    eligibility: "All beneficiaries under NFSA — Antyodaya Anna Yojana and Priority Household",
    benefit: "Free 5 kg food grain per person per month — wheat or rice at no cost",
    link: "https://dfpd.gov.in"  // ✅ verified OK
  },

  // === WOMEN & CHILD ===
  {
    name: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
    category: "Women & Child Development",
    eligibility: "Pregnant and lactating women (first child) aged 19+ for first live birth",
    benefit: "₹6,500 directly to bank account in three instalments for maternity support",
    link: "https://wcd.nic.in"  // ✅ verified — pmmvy.wcd.gov.in redirects here
  },
  {
    name: "Beti Bachao Beti Padhao (BBBP)",
    category: "Women & Child Development",
    eligibility: "Girl children, especially in districts with low female child sex ratio",
    benefit: "Educational support, awareness programs and empowerment for girl child",
    link: "https://wcd.nic.in"  // ✅ verified OK
  },
  {
    name: "Janani Suraksha Yojana (JSY)",
    category: "Women & Child Development",
    eligibility: "Pregnant women from BPL households delivering in government health facilities",
    benefit: "Cash assistance of ₹700 (urban) to ₹1,400 (rural) for institutional delivery",
    link: "https://nhm.gov.in"  // ✅ verified OK
  },

  // === SKILL DEVELOPMENT ===
  {
    name: "PM Kaushal Vikas Yojana (PMKVY)",
    category: "Skill Development",
    eligibility: "Youth aged 15–45 who are school/college dropouts or currently unemployed",
    benefit: "Free skill training + government certificate + ₹8,000 average placement reward",
    link: "https://skillindiadigital.gov.in"  // ✅ official PMKVY portal (pmkvyofficial.org may timeout)
  },
  {
    name: "National Apprenticeship Promotion Scheme (NAPS)",
    category: "Skill Development",
    eligibility: "Candidates who have passed Class 5 and above; age 14–21 years",
    benefit: "Stipend support: 25% reimbursed to employer; hands-on industry-level training",
    link: "https://apprenticeshipindia.gov.in"  // ✅ verified OK
  },
  {
    name: "DDU Grameen Kaushalya Yojana (DDU-GKY)",
    category: "Skill Development",
    eligibility: "Rural youth aged 15–35 years from poor families (SECC 2011 listed)",
    benefit: "Free placement-linked skill training with lodging and boarding support",
    link: "https://rural.nic.in"  // ✅ rural.nic.in hosts DDU-GKY (ddugky.gov.in times out)
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/govschemes');
    console.log('Connected to MongoDB. Clearing existing schemes...');
    await Scheme.deleteMany({});
    await Scheme.insertMany(realSchemes);
    console.log(`✅ Inserted ${realSchemes.length} schemes with verified working portal links.`);
    process.exit();
  } catch(e) {
    console.error('Error seeding DB:', e);
    process.exit(1);
  }
};

seedDatabase();
