import { Link, useLocation } from 'react-router-dom';
import { Home, MessageSquare, List, User, Sun, Moon, X, Menu, Globe } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

const LANGS = ['English', 'Hindi', 'Bengali', 'Tamil'];

const Navbar = () => {
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const drawerRef = useRef(null);

  /* ── Dark mode sync ── */
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  /* ── Close drawer on route change ── */
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  /* ── Close drawer/lang on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      setLangOpen(false);
    };
    if (menuOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  /* ── Prevent body scroll when drawer open ── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navItems = [
    { path: '/',        label: t.home,       icon: <Home size={20} /> },
    { path: '/chat',    label: t.aiGuide,    icon: <MessageSquare size={20} /> },
    { path: '/schemes', label: t.allSchemes, icon: <List size={20} /> },
    { path: '/profile', label: t.profile,    icon: <User size={20} /> },
  ];

  return (
    <>
      {/* ══════════════════════════════════════════════
          TOP NAVBAR  (visible on all breakpoints)
      ══════════════════════════════════════════════ */}
      <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-14 md:h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/logo.png"
              alt="Seva Flow"
              className="h-9 w-9 md:h-11 md:w-11 object-contain rounded-full shadow-sm"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-sm md:text-base text-green-800 dark:text-green-400 tracking-tight">
                Seva Flow
              </span>
              <span className="text-[9px] md:text-[10px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">
                Govt. Schemes Guide
              </span>
            </div>
          </Link>

          {/* ── Desktop links (md+) ── */}
          <div className="hidden md:flex items-center gap-5 lg:gap-7">
            {navItems.map(({ path, label, icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-1.5 text-sm lg:text-base font-medium border-b-2 py-5 transition-colors ${
                  location.pathname === path
                    ? 'text-green-700 dark:text-green-400 border-green-600 dark:border-green-400'
                    : 'text-gray-600 dark:text-gray-300 border-transparent hover:text-green-600 dark:hover:text-green-400'
                }`}
              >
                {icon} {label}
              </Link>
            ))}

            {/* Desktop language dropdown */}
            <div className="relative" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setLangOpen(o => !o)}
                className="flex items-center gap-1.5 border border-gray-300 dark:border-gray-600 px-3 py-1.5 rounded-full text-sm font-medium dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <Globe size={14} />
                {language}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 py-1 w-32 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50">
                  {LANGS.map(lang => (
                    <button
                      key={lang}
                      onClick={() => { setLanguage(lang); setLangOpen(false); }}
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                        language === lang
                          ? 'font-bold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark mode */}
            <button
              onClick={() => setDark(d => !d)}
              aria-label="Toggle dark mode"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              {dark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-gray-500" />}
            </button>
          </div>

          {/* ── Mobile right side: dark toggle + hamburger ── */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setDark(d => !d)}
              aria-label="Toggle dark mode"
              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              {dark ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} className="text-gray-500" />}
            </button>

            {/* Hamburger button */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-400 transition hover:bg-green-100 dark:hover:bg-green-900/50"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════
          MOBILE SLIDE-DOWN DRAWER
      ══════════════════════════════════════════════ */}

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
        onClick={() => setMenuOpen(false)}
      />

      {/* Drawer panel — slides in from right */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl z-50 md:hidden flex flex-col transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Navigation menu"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-green-700">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Seva Flow" className="h-9 w-9 object-contain rounded-full bg-white/20 p-0.5" />
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-white text-sm">Seva Flow</span>
              <span className="text-[9px] text-green-200 uppercase tracking-wide">Govt. Schemes Guide</span>
            </div>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-3 mb-2">
            Navigation
          </p>
          <ul className="space-y-1">
            {navItems.map(({ path, label, icon }) => {
              const isActive = location.pathname === path;
              return (
                <li key={path}>
                  <Link
                    to={path}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                      isActive
                        ? 'bg-green-600 text-white shadow-md shadow-green-200 dark:shadow-green-900'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-400'
                    }`}
                  >
                    <span className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                      isActive ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      {icon}
                    </span>
                    {label}
                    {isActive && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-white opacity-80" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-gray-800 my-4 mx-3" />

          {/* Language selector */}
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-3 mb-2">
            Language
          </p>
          <div className="grid grid-cols-2 gap-2 px-3">
            {LANGS.map((lang) => (
              <button
                key={lang}
                onClick={() => { setLanguage(lang); setMenuOpen(false); }}
                className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  language === lang
                    ? 'bg-green-600 text-white border-green-600 shadow-sm'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-green-400 hover:text-green-700'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-gray-800 my-4 mx-3" />

          {/* Dark mode toggle */}
          <div className="px-3">
            <button
              onClick={() => setDark(d => !d)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {dark ? '☀️  Light Mode' : '🌙  Dark Mode'}
              </span>
              {/* Toggle pill */}
              <div className={`relative w-11 h-6 rounded-full transition-colors ${dark ? 'bg-green-600' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${dark ? 'translate-x-5' : ''}`} />
              </div>
            </button>
          </div>
        </nav>

        {/* Drawer footer */}
        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            🇮🇳 Seva Flow — Government Schemes Made Simple
          </p>
        </div>
      </div>
    </>
  );
};

export default Navbar;
