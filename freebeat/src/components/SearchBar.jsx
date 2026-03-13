import { Search, X } from 'lucide-react';
import { useState } from 'react';

export default function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  const clear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xl">
      <div className="relative flex items-center">
        <Search size={18} className="absolute left-4 text-gray-500 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search artists, songs, genres..."
          className="w-full pl-11 pr-10 py-3 rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all"
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(168,85,247,0.5)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
        />
        {query && (
          <button type="button" onClick={clear}
            className="absolute right-3 text-gray-500 hover:text-white transition-colors">
            <X size={16} />
          </button>
        )}
      </div>
    </form>
  );
}
