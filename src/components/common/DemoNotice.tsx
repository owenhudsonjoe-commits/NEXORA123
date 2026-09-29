import React from 'react';

// Clean null placeholders to remove all demo banners/notices as requested by user
export const DemoHeaderBanner: React.FC = () => {
  return null;
};

export const DemoFooterBadge: React.FC<{ onOpenAuth?: () => void }> = () => {
  return (
    <footer
      id="app-footer-bar"
      className="mt-12 border-t border-zinc-200 bg-white px-6 py-5 text-xs text-zinc-600"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-black" />
          <span className="font-semibold text-black">
            NEXORA Digital Banking Portal • SBP Raast Integrated 🇵🇰
          </span>
          <span className="hidden sm:inline text-zinc-300">|</span>
          <span className="hidden sm:inline text-zinc-600 text-[11px]">
            Account Holder: Ayesha Khan
          </span>
        </div>

        <div className="flex items-center gap-3 text-zinc-500 text-xs">
          <span>End-to-End 256-Bit Encrypted</span>
        </div>
      </div>
    </footer>
  );
};
