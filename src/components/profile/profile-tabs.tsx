type ProfileTab = {
  id: string;
  label: string;
  isActive?: boolean;
  href?: string;
};

type ProfileTabsProps = {
  tabs: ProfileTab[];
};

export function ProfileTabs({ tabs }: ProfileTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 rounded-[20px] border border-[#E7E3DA] bg-white p-2 shadow-[0_1px_2px_rgba(17,15,23,0.06)]">
      {tabs.map((tab) => {
        const baseClassName =
          'rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#6F3CC3] focus:ring-offset-2';
        const activeClassName = 'bg-[#6F3CC3] text-white shadow-sm';
        const inactiveClassName = 'bg-[#F7F6F3] text-[#6B6774] hover:text-[#17151F]';

        if (tab.href) {
          return (
            <a
              key={tab.id}
              href={tab.href}
              aria-current={tab.isActive ? 'page' : undefined}
              className={`${baseClassName} ${tab.isActive ? activeClassName : inactiveClassName}`}
            >
              {tab.label}
            </a>
          );
        }

        return (
          <button key={tab.id} type="button" aria-pressed={tab.isActive ?? false} className={`${baseClassName} ${tab.isActive ? activeClassName : inactiveClassName}`}>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
