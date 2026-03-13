import { TrendingUp, Search, ListMusic, Radio, Music2, Zap } from 'lucide-react';

const navItems = [
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'playlists', label: 'Playlists', icon: ListMusic },
  { id: 'radio', label: 'Radio', icon: Radio },
];

export default function Sidebar({ currentView, onNavigate }) {
  return (
    <div className="flex flex-col h-full w-56 flex-shrink-0"
      style={{ background: '#0a0a14', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}>
          <Music2 size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white leading-tight">FreeBeat</h1>
          <p className="text-xs text-gray-500 leading-tight">Powered by Audius</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-2 mb-2">Menu</p>
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-all ${
              currentView === id
                ? 'text-white bg-purple-600/20 border border-purple-600/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon size={18} className={currentView === id ? 'text-purple-400' : ''} />
            {label}
          </button>
        ))}
      </nav>

      {/* Free badge */}
      <div className="mx-3 mb-4 p-3 rounded-xl"
        style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(236,72,153,0.15))', border: '1px solid rgba(168,85,247,0.2)' }}>
        <div className="flex items-center gap-2 mb-1.5">
          <Zap size={14} className="text-yellow-400" />
          <span className="text-xs font-bold text-white">100% Free</span>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
          Stream music freely via Audius — no subscriptions, no ads.
        </p>
      </div>
    </div>
  );
}
