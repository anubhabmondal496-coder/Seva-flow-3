import { Link } from 'react-router-dom';
import {
  Bot, ShieldCheck, ArrowRight, MessageSquare,
  Globe, Mic, BookOpen, Accessibility, Award, Users, Search
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

/* ─── Feature cards ─────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: <MessageSquare size={24} />,
    color: 'from-blue-500 to-blue-700',
    bg: 'bg-blue-50', ring: 'ring-blue-200',
    title: 'AI Chat Guide',
    desc: 'Conversational AI that finds the right government scheme for you in seconds.',
    link: '/chat', label: 'Start Chat',
  },
  {
    icon: <Globe size={24} />,
    color: 'from-emerald-500 to-green-700',
    bg: 'bg-emerald-50', ring: 'ring-emerald-200',
    title: 'Multilingual',
    desc: 'Full support for English, Hindi, Bengali & Tamil — AI replies in your language.',
    link: '/chat', label: 'Try Now',
  },
  {
    icon: <Mic size={24} />,
    color: 'from-violet-500 to-purple-700',
    bg: 'bg-violet-50', ring: 'ring-violet-200',
    title: 'Voice Input',
    desc: 'Speak your query using your microphone — no typing needed.',
    link: '/chat', label: 'Speak Now',
  },
  {
    icon: <Search size={24} />,
    color: 'from-orange-400 to-orange-600',
    bg: 'bg-orange-50', ring: 'ring-orange-200',
    title: 'Scheme Browser',
    desc: 'Browse 100+ verified government schemes filtered by category, keyword or benefit.',
    link: '/schemes', label: 'Browse All',
  },
  {
    icon: <Accessibility size={24} />,
    color: 'from-sky-500 to-cyan-700',
    bg: 'bg-sky-50', ring: 'ring-sky-200',
    title: 'PWD & Disability',
    desc: 'Dedicated schemes for blind, deaf, physically & mentally disabled persons with UDID support.',
    link: '/schemes', label: 'PWD Schemes',
  },
  {
    icon: <BookOpen size={24} />,
    color: 'from-pink-500 to-rose-600',
    bg: 'bg-pink-50', ring: 'ring-pink-200',
    title: 'Step-by-Step Help',
    desc: 'Detailed application instructions, document checklists and official portal links.',
    link: '/chat', label: 'Get Help',
  },
  {
    icon: <ShieldCheck size={24} />,
    color: 'from-teal-500 to-teal-700',
    bg: 'bg-teal-50', ring: 'ring-teal-200',
    title: 'Verified Portals',
    desc: 'All scheme links go directly to official government portals — no middlemen.',
    link: '/schemes', label: 'View Schemes',
  },
  {
    icon: <Award size={24} />,
    color: 'from-yellow-400 to-amber-600',
    bg: 'bg-yellow-50', ring: 'ring-yellow-200',
    title: 'Scholarships',
    desc: 'NSP, SVMCM, Sahanubhuti & 10+ state/central scholarships for students.',
    link: '/schemes', label: 'Scholarships',
  },
  {
    icon: <Users size={24} />,
    color: 'from-indigo-500 to-indigo-700',
    bg: 'bg-indigo-50', ring: 'ring-indigo-200',
    title: 'For Rural India',
    desc: 'Designed for farmers, rural families, women & students in remote areas.',
    link: '/chat', label: 'Find Schemes',
  },
];

const Home = () => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center">

      {/* ── Hero ── */}
      <section className="text-center py-10 md:py-20 px-4 sm:px-6 w-full max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-green-100 text-green-800 font-semibold text-xs sm:text-sm mb-5 shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
          </span>
          AI-Powered · Free · Multilingual
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight leading-tight mb-5 whitespace-pre-line">
          {t.heroTitle}
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed px-2">
          {t.heroSubtitle}
        </p>

        {/* CTA Buttons — stack on mobile, side-by-side on sm+ */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0">
          <Link to="/chat"
            className="group inline-flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white text-base sm:text-lg font-semibold py-3.5 sm:py-4 px-6 sm:px-8 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <Bot size={22} className="group-hover:animate-bounce" aria-hidden />
            {t.findSchemesBtn}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" aria-hidden />
          </Link>
          <Link to="/schemes"
            className="inline-flex items-center justify-center gap-3 bg-white border-2 border-green-600 text-green-700 text-base sm:text-lg font-semibold py-3.5 sm:py-4 px-6 sm:px-8 rounded-full shadow hover:bg-green-50 transition-all hover:-translate-y-1">
            <BookOpen size={20} aria-hidden />
            Browse Schemes
          </Link>
        </div>

        {/* Stats — 2x2 on mobile, 4-in-a-row on sm+ */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-4 sm:gap-8 mt-10 text-center">
          {[
            { number: '100+', label: 'Government Schemes' },
            { number: '4',    label: 'Languages Supported' },
            { number: '21',   label: 'Disability Types' },
            { number: '100%', label: 'Free to Use' },
          ].map(({ number, label }) => (
            <div key={label} className="flex flex-col items-center py-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-green-700">{number}</span>
              <span className="text-xs sm:text-sm text-gray-500 mt-1">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="w-full flex items-center gap-3 px-4 sm:px-8 max-w-5xl mb-6">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
        <span className="text-xs sm:text-sm font-bold text-amber-700 uppercase tracking-widest whitespace-nowrap">✦ Platform Features ✦</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
      </div>

      {/* ── Feature Cards ── */}
      <section className="w-full max-w-6xl px-4 pb-6" aria-label="Platform features">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {FEATURES.map(({ icon, color, bg, ring, title, desc, link, label }) => (
            <Link
              key={title} to={link}
              className={`group ${bg} ring-1 ${ring} rounded-2xl p-5 sm:p-6 flex flex-col gap-3 hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
              aria-label={`${title} — ${desc}`}
            >
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                {icon}
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-gray-800">{title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed flex-1">{desc}</p>
              <span className={`inline-flex items-center gap-1 text-sm font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                {label}
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
