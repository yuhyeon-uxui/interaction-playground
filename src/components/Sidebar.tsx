'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Box, FolderKanban } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col p-6 shadow-sm z-50">
      <div className="mb-10">
        <h1 className="text-xl font-bold tracking-tight">Handoff Playground</h1>
        <p className="text-sm text-gray-500 mt-1">Design System & Interactions</p>
      </div>

      <nav className="flex-1 space-y-8">
        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Home size={14} /> Main
          </h2>
          <ul className="space-y-2">
            <li>
              <Link href="/" className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === '/' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                대시보드
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Box size={14} /> Components
          </h2>
          <ul className="space-y-2">
            <li>
              <Link href="/interactions/components/bottom-sheet" className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/interactions/components/bottom-sheet') ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                Bottom Sheet (바텀 시트)
              </Link>
            </li>
            {/* Future components go here */}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <FolderKanban size={14} /> Projects
          </h2>
          <ul className="space-y-2">
            <li>
              <Link href="/interactions/projects/bobo-rsp" className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/interactions/projects/bobo-rsp') ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                BOBO 가위바위보 (미니게임)
              </Link>
            </li>
            <li>
              <span className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-400 cursor-not-allowed">
                PDS Hub (준비 중)
              </span>
            </li>
            {/* Future projects go here */}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
