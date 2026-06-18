import Link from 'next/link';
import { ArrowRight, Box, FolderKanban, Sparkles } from 'lucide-react';

export default function Dashboard() {
  return (
    <main className="p-10 max-w-5xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold mb-4 flex items-center gap-3">
          <Sparkles className="text-[#00C8FF]" size={36} />
          Interaction Gallery
        </h1>
        <p className="text-lg text-gray-600">
          개발팀을 위한 모션 스펙 핸드오프 대시보드입니다.<br/>
          원하는 컴포넌트나 프로젝트를 선택하여 인터랙션을 직접 체험해보세요.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Box className="text-gray-500" /> 기본 컴포넌트 (Components)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/interactions/components/bottom-sheet" className="group block bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-black transition-all">
            <div className="w-12 h-12 bg-gray-100 rounded-xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
              <div className="w-6 h-1.5 bg-gray-400 rounded-full" />
            </div>
            <h3 className="text-xl font-bold mb-2">Bottom Sheet</h3>
            <p className="text-sm text-gray-500 mb-4">
              물리 엔진 기반의 탄성 있는 드래그 제스처 바텀 시트 인터랙션
            </p>
            <div className="flex items-center text-sm font-semibold text-[#00C8FF] group-hover:translate-x-1 transition-transform">
              보러가기 <ArrowRight size={16} className="ml-1" />
            </div>
          </Link>
          
          {/* Mock card for future */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 opacity-60">
            <h3 className="text-xl font-bold mb-2 text-gray-400">Modal Popup</h3>
            <p className="text-sm text-gray-400">업데이트 예정입니다.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FolderKanban className="text-gray-500" /> 프로젝트 (Projects)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mock card for future */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 opacity-60">
            <h3 className="text-xl font-bold mb-2 text-gray-400">PDS Hub (동호회 게시판)</h3>
            <p className="text-sm text-gray-400">특화된 페이지 트랜지션 및 컴포넌트 업데이트 예정</p>
          </div>
        </div>
      </section>
    </main>
  );
}
