'use client';

import { useState } from 'react';
import BottomSheet from '@/components/BottomSheet';

export default function PlaygroundPage() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Spring Physics state
  const [stiffness, setStiffness] = useState(260);
  const [damping, setDamping] = useState(20);
  const [mass, setMass] = useState(1);

  return (
    <main className="min-h-screen bg-[#f0f2f5] text-gray-900 p-10 flex gap-10 justify-center items-start font-sans">
      
      {/* Left: Mobile Simulator */}
      <section className="flex-none flex justify-center items-center">
        <div className="relative w-[375px] h-[812px] bg-black rounded-[40px] p-3 shadow-[0_20px_40px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="w-full h-full bg-[#f8f9fa] rounded-[32px] overflow-hidden relative flex flex-col">
            
            <div className="p-10 text-center flex-1 flex flex-col justify-center">
              <h1 className="text-2xl font-bold mb-2">프로필 테스트</h1>
              <p className="text-sm text-gray-500 mb-8">
                우측 패널에서 모션 값을 조절하고<br/>버튼을 눌러보세요.
              </p>
              
              <button
                onClick={() => setIsOpen(true)}
                className="w-full bg-black text-white py-3.5 rounded-xl font-semibold active:scale-[0.98] transition-transform"
              >
                바텀 시트 열기
              </button>
            </div>

            {/* Bottom Sheet Component */}
            <BottomSheet 
              isOpen={isOpen} 
              onClose={() => setIsOpen(false)} 
              stiffness={stiffness}
              damping={damping}
              mass={mass}
            />
          </div>
        </div>
      </section>

      {/* Right: Control Panel */}
      <aside className="flex-1 max-w-[600px] bg-white rounded-[24px] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Interaction Specs</h2>
          <p className="text-gray-500">React + Framer Motion (Spring Physics)</p>
        </div>

        <div className="space-y-8">
          {/* Controls */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Spring Physics 설정</h3>
              <div className="flex gap-2">
                <button onClick={() => {setStiffness(400); setDamping(40); setMass(1)}} className="text-xs px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200">단단하게 (Stiff)</button>
                <button onClick={() => {setStiffness(260); setDamping(20); setMass(1)}} className="text-xs px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200">기본 (Bouncy)</button>
                <button onClick={() => {setStiffness(120); setDamping(14); setMass(1)}} className="text-xs px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200">부드럽게 (Soft)</button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex justify-between mb-2 text-sm font-medium">
                  <span>Stiffness (탄성)</span>
                  <span className="font-mono bg-gray-100 px-2 rounded">{stiffness}</span>
                </label>
                <input type="range" min="50" max="500" value={stiffness} onChange={e => setStiffness(Number(e.target.value))} className="w-full accent-black" />
              </div>

              <div>
                <label className="flex justify-between mb-2 text-sm font-medium">
                  <span>Damping (마찰력)</span>
                  <span className="font-mono bg-gray-100 px-2 rounded">{damping}</span>
                </label>
                <input type="range" min="5" max="50" value={damping} onChange={e => setDamping(Number(e.target.value))} className="w-full accent-black" />
              </div>

              <div>
                <label className="flex justify-between mb-2 text-sm font-medium">
                  <span>Mass (무게감)</span>
                  <span className="font-mono bg-gray-100 px-2 rounded">{mass}</span>
                </label>
                <input type="range" min="0.1" max="5" step="0.1" value={mass} onChange={e => setMass(Number(e.target.value))} className="w-full accent-black" />
              </div>
            </div>
          </div>

          {/* Code Snippets */}
          <div>
            <h3 className="font-semibold text-lg mb-4">개발자 전달용 코드</h3>
            
            <div className="space-y-4">
              <div className="bg-[#1e1e1e] p-5 rounded-xl">
                <div className="text-[#888] text-xs font-semibold tracking-wider mb-3">REACT / FRAMER MOTION</div>
                <pre className="text-[#d4d4d4] font-mono text-sm leading-relaxed overflow-x-auto">
{`const transition = {
  type: "spring",
  stiffness: ${stiffness},
  damping: ${damping},
  mass: ${mass}
};

<motion.div transition={transition} ... />`}
                </pre>
              </div>

              <div className="bg-[#01579B] p-5 rounded-xl">
                <div className="text-[#81D4FA] text-xs font-semibold tracking-wider mb-3">FLUTTER (Spring Simulation)</div>
                <pre className="text-white font-mono text-sm leading-relaxed overflow-x-auto">
{`SpringDescription(
  mass: ${mass},
  stiffness: ${stiffness},
  damping: ${damping},
)`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}
