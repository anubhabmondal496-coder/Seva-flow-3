import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ExternalLink, CheckCircle, FileText, Loader2, BookmarkIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Documents required per category
const documentsMap = {
  'Education': ['Aadhar Card', 'Mark Sheet / Certificate', 'Income Certificate', 'Bank Passbook', 'Passport Size Photo', 'Caste Certificate (if applicable)'],
  'Agriculture': ['Aadhar Card', 'Land Records / Khatoni', 'Bank Passbook', 'Ration Card', 'Passport Size Photo'],
  'Business': ['Aadhar Card', 'PAN Card', 'Bank Statement (6 months)', 'Business Address Proof', 'Project Report', 'GST Registration (if applicable)'],
  'Health': ['Aadhar Card', 'Ration Card / BPL Card', 'Income Certificate', 'Hospital Referral Letter (if needed)'],
  'Housing': ['Aadhar Card', 'Income Certificate', 'Land Ownership Document', 'Bank Passbook', 'BPL Card'],
  'Finance': ['Aadhar Card', 'PAN Card', 'Address Proof', 'Passport Size Photo'],
  'Social Welfare': ['Aadhar Card', 'Income Certificate', 'Ration Card', 'Age Proof', 'Disability Certificate (if applicable)'],
  'Women & Child Development': ['Aadhar Card', 'MCP Card (Mother & Child Protection)', 'Bank Passbook', 'Birth Certificate of Child'],
  'Skill Development': ['Aadhar Card', 'Educational Certificate', 'Passport Size Photo', 'Bank Passbook'],
};

const stepsMap = {
  'Education': [
    'Visit the official website link below',
    'Click on "New Registration" and create an account using your mobile number',
    'Fill in your personal, academic, and bank details',
    'Upload scanned copies of required documents',
    'Submit the application and note your Application ID',
    'Track status using your Application ID',
  ],
  'Agriculture': [
    'Visit your nearest Common Service Centre (CSC) or visit the official portal',
    'Register using your Aadhar card number and mobile number',
    'Provide land details (Khasra/Khatoni number)',
    'Enter bank account details for DBT (Direct Benefit Transfer)',
    'Submit and receive a Registration Number via SMS',
  ],
  'Business': [
    'Visit the official portal or your nearest bank branch',
    'Fill out the application form with business details',
    'Attach required documents (PAN, Bank Statement, Project Report)',
    'Submit to the bank for loan processing',
    'Loan disbursed after verification and credit check',
  ],
  'Health': [
    'Visit the official portal or nearest government hospital',
    'Check eligibility using your Aadhar / Ration Card',
    'Get registered and receive your beneficiary card/ID',
    'Use the card at any empaneled hospital for cashless treatment',
  ],
  'Housing': [
    'Visit the official PMAY portal or your nearest gram panchayat / urban local body office',
    'Register with Aadhar number and income details',
    'A survey/verification will be done by government officials',
    'On approval, funds are transferred directly to your bank in instalments',
  ],
  'Finance': [
    'Visit any bank branch or post office near you',
    'Carry Aadhar card and one additional ID proof',
    'Fill the account opening / enrollment form',
    'Submit and receive your account details / card within a few days',
  ],
  'Social Welfare': [
    'Contact your local Block Development Office (BDO) or gram panchayat',
    'Fill the application form with your income and caste certificate',
    'Submit documents and get a receipt',
    'After verification, benefits are transferred monthly to your bank account',
  ],
  'Women & Child Development': [
    'Register at your nearest Anganwadi centre or government hospital',
    'Fill the application form with Aadhar and bank details',
    'Submit doctor-verified pregnancy documents',
    'Benefits are transferred in instalments to your bank account',
  ],
  'Skill Development': [
    'Visit the official portal or nearest Training Centre',
    'Register with your Aadhar card and educational details',
    'Enroll in a skill course of your choice',
    'Complete training and get certified',
    'Certificate helps in placement / self-employment',
  ],
};

const SchemeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScheme = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/schemes/${id}`);
        setScheme(res.data);
      } catch {
        setScheme(null);
      } finally {
        setLoading(false);
      }
    };
    fetchScheme();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64">
      <Loader2 size={40} className="animate-spin text-green-600 mb-3" />
      <p className="text-gray-500">Loading scheme details...</p>
    </div>
  );

  if (!scheme) return (
    <div className="text-center py-20">
      <p className="text-gray-500 text-lg">Scheme not found.</p>
      <button onClick={() => navigate(-1)} className="mt-4 text-green-600 hover:underline">Go Back</button>
    </div>
  );

  const docs = documentsMap[scheme.category] || documentsMap['Finance'];
  const steps = stepsMap[scheme.category] || stepsMap['Finance'];

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in duration-300">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-green-700 mb-6 font-medium transition-colors">
        <ArrowLeft size={20} /> Back to Schemes
      </button>

      {/* Header */}
      <div className="bg-gradient-to-br from-green-700 to-emerald-600 rounded-2xl p-6 md:p-8 text-white mb-6 shadow-lg">
        <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-semibold mb-3">{scheme.category}</span>
        <h1 className="text-2xl md:text-3xl font-extrabold leading-tight mb-4">{scheme.name}</h1>
        <div className="flex items-start gap-2">
          <CheckCircle size={20} className="shrink-0 mt-0.5 text-green-200" />
          <p className="text-green-50 font-medium">{scheme.benefit}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Eligibility */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">✓</span>
              Eligibility
            </h2>
            <p className="text-gray-700 leading-relaxed">{scheme.eligibility}</p>
          </div>

          {/* How to Apply Steps */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-sm font-bold">→</span>
              How to Apply — Step by Step
            </h2>
            <ol className="space-y-3">
              {steps.map((step, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  <span className="text-gray-700 pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Required Documents */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FileText size={18} className="text-orange-500" /> Documents Required
            </h2>
            <ul className="space-y-2">
              {docs.map((doc, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0"></span>
                  {doc}
                </li>
              ))}
            </ul>
          </div>

          {/* Apply Now Button */}
          <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-5">
            <p className="text-sm text-gray-500 mb-3 text-center font-medium">🌐 Official Government Portal</p>

            <a
              href={scheme.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-green-600 hover:bg-green-700 active:scale-95 text-white rounded-xl font-bold transition-all shadow-md text-base"
            >
              🚀 Visit Official Portal <ExternalLink size={18} />
            </a>

            <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200 break-all">
              <p className="text-xs text-gray-400 mb-1">Portal Link:</p>
              <a
                href={scheme.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-xs font-medium"
              >
                {scheme.link}
              </a>
            </div>
          </div>

          {/* Helpline */}
          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4 text-center">
            <p className="text-sm font-semibold text-blue-800 mb-1">Need Help Applying?</p>
            <p className="text-xs text-blue-600">Visit your nearest <strong>Common Service Centre (CSC)</strong> or call</p>
            <p className="text-lg font-bold text-blue-700 mt-1">📞 1800-111-555</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeDetail;
