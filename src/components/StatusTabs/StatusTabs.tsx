export interface TabItem {
  id: string
  label: string
  count: number
}

interface StatusTabsProps {
  tabs: TabItem[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export default function StatusTabs({ tabs, activeTab, onTabChange }: StatusTabsProps) {
  return (
    <div className="flex gap-2 bg-slate-200/50 p-1.5 rounded-2xl w-full sm:w-fit overflow-x-auto hide-scrollbar border border-slate-200/60">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-5 py-2 text-sm font-bold rounded-xl transition-all whitespace-nowrap outline-none flex items-center gap-2 ${
            activeTab === tab.id ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          {tab.label}
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] ${
              activeTab === tab.id ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200/70 text-slate-500'
            }`}
          >
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  )
}
