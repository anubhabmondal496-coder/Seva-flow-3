import { ExternalLink, BookmarkIcon, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

const SchemeCard = ({ scheme, onBookmark, isBookmarked, compact = false }) => {
  const { t } = useLanguage();
  const [bookmarked, setBookmarked] = useState(isBookmarked || false);

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    if (onBookmark) onBookmark(scheme);
  };

  // ── Compact mode: used inside the AI chat schemes panel ──
  if (compact) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-200">
        <div className="p-3">
          {/* Top row: badge + bookmark */}
          <div className="flex justify-between items-start mb-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
              {scheme.category}
            </span>
            <button
              onClick={handleBookmark}
              className={`p-1.5 rounded-full transition-colors ${bookmarked ? 'bg-yellow-50 text-yellow-500' : 'bg-gray-50 dark:bg-gray-700 text-gray-400 hover:text-gray-600'}`}
              title="Save for later"
            >
              <BookmarkIcon size={14} fill={bookmarked ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Scheme name */}
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-snug mb-1.5">
            {scheme.name}
          </h3>

          {/* Benefit */}
          <p className="text-green-700 dark:text-green-400 text-xs flex items-start gap-1 mb-2">
            <CheckCircle size={12} className="shrink-0 mt-0.5 text-green-500" />
            {scheme.benefit}
          </p>

          {/* Portal link */}
          {scheme.link && (
            <a
              href={scheme.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mb-3 truncate"
            >
              <ExternalLink size={11} className="shrink-0" />
              {scheme.link.replace(/^https?:\/\//, '')}
            </a>
          )}
        </div>

        {/* Action buttons */}
        <div className="px-3 pb-3 flex gap-2">
          <Link
            to={`/schemes/${scheme._id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-xs"
          >
            View Details
          </Link>
          <a
            href={scheme.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 py-1.5 px-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-xs"
            title="Visit official portal"
          >
            Apply <ExternalLink size={12} />
          </a>
        </div>
      </div>
    );
  }

  // ── Full mode: used on the Schemes browse page ──
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full transform hover:-translate-y-1">
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            {scheme.category}
          </span>
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-full transition-colors ${bookmarked ? 'bg-yellow-50 text-yellow-500' : 'bg-gray-50 text-gray-400 hover:text-gray-600'}`}
            title="Save for later"
          >
            <BookmarkIcon size={20} fill={bookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{scheme.name}</h3>

        <div className="space-y-3 mt-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{t.benefit || 'Benefit'}</p>
            <p className="text-green-700 font-medium flex items-start gap-1 mt-1">
              <CheckCircle size={16} className="shrink-0 mt-0.5 text-green-500" />
              {scheme.benefit}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{t.eligibility || 'Eligibility'}</p>
            <p className="text-gray-700 text-sm mt-1">{scheme.eligibility}</p>
          </div>

          {/* Portal link preview */}
          {scheme.link && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Official Portal</p>
              <a
                href={scheme.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1 break-all"
              >
                <ExternalLink size={12} className="shrink-0" />
                {scheme.link.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
        <Link
          to={`/schemes/${scheme._id}`}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors text-sm"
        >
          View Details & Apply <ExternalLink size={16} />
        </Link>
      </div>
    </div>
  );
};

export default SchemeCard;
