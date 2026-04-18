import { useState, useEffect } from 'react';
import axios from 'axios';
import SchemeCard from '../components/SchemeCard';
import { Search, Loader2, SlidersHorizontal, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Schemes = () => {
  const { t } = useLanguage();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/schemes`);
        setSchemes(response.data);
      } catch (error) {
        console.error('Error fetching schemes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchemes();
  }, []);

  const categories = ['All', ...new Set(schemes.map(s => s.category))];

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch =
      scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.benefit.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || scheme.category.includes(categoryFilter);
    return matchesSearch && matchesCat;
  });

  return (
    <div className="animate-in fade-in duration-300">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{t.exploreSchemes}</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{t.browseDetailed}</p>
      </div>

      {/* Search + Filter toggle */}
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-9 pr-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm shadow-sm transition-shadow"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Mobile: toggle filter panel button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`md:hidden flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${showFilters || categoryFilter !== 'All' ? 'bg-green-600 text-white border-green-600' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300'}`}
        >
          <SlidersHorizontal size={16} />
          {categoryFilter !== 'All' ? categoryFilter.split(' ')[0] : 'Filter'}
        </button>
      </div>

      {/* Mobile: Category filter drawer */}
      {showFilters && (
        <div className="md:hidden mb-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm animate-in slide-in-from-top duration-200">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Filter by Category</p>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setCategoryFilter(cat); setShowFilters(false); }}
                className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-all ${
                  categoryFilter === cat
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Desktop: Category pills horizontal scroll */}
      <div className="hidden md:flex overflow-x-auto pb-2 gap-2 mb-6 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`whitespace-nowrap px-4 py-2.5 rounded-xl font-medium text-sm transition-all shrink-0 ${
              categoryFilter === cat
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Active filter badge (mobile) */}
      {categoryFilter !== 'All' && !showFilters && (
        <div className="md:hidden flex items-center gap-2 mb-4">
          <span className="text-xs text-gray-500 dark:text-gray-400">Filtered by:</span>
          <span className="flex items-center gap-1 px-2.5 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
            {categoryFilter}
            <button onClick={() => setCategoryFilter('All')}><X size={12} /></button>
          </span>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-green-600">
          <Loader2 size={36} className="animate-spin mb-3" />
          <p className="text-gray-500 font-medium text-sm">Loading schemes...</p>
        </div>
      ) : filteredSchemes.length > 0 ? (
        <>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 md:hidden">
            {filteredSchemes.length} scheme{filteredSchemes.length !== 1 ? 's' : ''} found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredSchemes.map(scheme => (
              <SchemeCard key={scheme._id} scheme={scheme} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600">
          <p className="text-gray-500 dark:text-gray-400 text-base mb-3">No schemes found matching your search.</p>
          <button
            onClick={() => { setSearchTerm(''); setCategoryFilter('All'); }}
            className="text-green-600 font-semibold text-sm hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Schemes;
