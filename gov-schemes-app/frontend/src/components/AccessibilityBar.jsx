import { useState, useEffect } from 'react';
import { Eye, Contrast, ZoomIn, ZoomOut, Accessibility, X } from 'lucide-react';

const AccessibilityBar = () => {
  const [open, setOpen] = useState(false);
  const [colorblind, setColorblind] = useState(() => localStorage.getItem('a11y_colorblind') === '1');
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('a11y_hc') === '1');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('a11y_font') || 'normal');

  useEffect(() => {
    document.body.classList.toggle('colorblind-safe', colorblind);
    localStorage.setItem('a11y_colorblind', colorblind ? '1' : '0');
  }, [colorblind]);

  useEffect(() => {
    document.body.classList.toggle('high-contrast', highContrast);
    localStorage.setItem('a11y_hc', highContrast ? '1' : '0');
  }, [highContrast]);

  useEffect(() => {
    document.body.classList.remove('text-large', 'text-xlarge');
    if (fontSize !== 'normal') document.body.classList.add(fontSize);
    localStorage.setItem('a11y_font', fontSize);
  }, [fontSize]);

  // Apply saved prefs on mount
  useEffect(() => {
    if (colorblind) document.body.classList.add('colorblind-safe');
    if (highContrast) document.body.classList.add('high-contrast');
    if (fontSize !== 'normal') document.body.classList.add(fontSize);
  }, []);

  return (
    <>
      {/* Skip to content for screen readers */}
      <a href="#main-content" className="skip-link" aria-label="Skip to main content">
        Skip to main content
      </a>

      {/* Floating Accessibility Button */}
      <div className="fixed right-3 bottom-20 md:right-4 md:bottom-8 z-50 flex flex-col items-end gap-2">
        {open && (
          <div
            className="bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-700 rounded-2xl shadow-2xl p-4 w-[min(256px,calc(100vw-24px))] animate-in slide-in-from-bottom-4 duration-200"
            role="dialog" aria-label="Accessibility options"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                <Accessibility size={16} className="text-blue-600" /> 
                Accessibility
              </h3>
              <button onClick={() => setOpen(false)} aria-label="Close accessibility panel">
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Colorblind mode */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Colorblind Safe 🟦</p>
                  <p className="text-xs text-gray-500">Replaces green with blue</p>
                </div>
                <button
                  onClick={() => setColorblind(!colorblind)}
                  aria-pressed={colorblind}
                  aria-label="Toggle colorblind safe mode"
                  className={`relative w-11 h-6 rounded-full transition-colors ${colorblind ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${colorblind ? 'translate-x-5' : ''}`} />
                </button>
              </div>

              {/* High Contrast */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">High Contrast ◑</p>
                  <p className="text-xs text-gray-500">Black background, white text</p>
                </div>
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  aria-pressed={highContrast}
                  aria-label="Toggle high contrast mode"
                  className={`relative w-11 h-6 rounded-full transition-colors ${highContrast ? 'bg-gray-900' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${highContrast ? 'translate-x-5' : ''}`} />
                </button>
              </div>

              {/* Font Size */}
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">Text Size</p>
                <div className="flex gap-2">
                  {[
                    { key: 'normal', label: 'A', title: 'Normal text size' },
                    { key: 'text-large', label: 'A+', title: 'Large text' },
                    { key: 'text-xlarge', label: 'A++', title: 'Extra large text' },
                  ].map(({ key, label, title }) => (
                    <button
                      key={key}
                      onClick={() => setFontSize(key)}
                      title={title}
                      aria-pressed={fontSize === key}
                      aria-label={title}
                      className={`flex-1 py-1.5 rounded-lg text-sm font-bold border transition-all ${
                        fontSize === key
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* WCAG Note */}
              <p className="text-[10px] text-gray-400 pt-1 border-t border-gray-100">
                ♿️ WCAG 2.1 AA compliant accessibility features
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => setOpen(!open)}
          aria-label="Open accessibility options"
          aria-expanded={open}
          className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105"
        >
          <Accessibility size={22} />
        </button>
      </div>
    </>
  );
};

export default AccessibilityBar;
