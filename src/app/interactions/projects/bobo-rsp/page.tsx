'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HANDS = ['✊', '✌️', '✋'];

export default function BoboRSP() {
  const [status, setStatus] = useState<'rolling' | 'stopped' | 'result' | 'reward'>('rolling');
  const [boboHandIdx, setBoboHandIdx] = useState(0);
  const [userHand, setUserHand] = useState('✋');
  const [winCount, setWinCount] = useState(0);
  
  // Controls
  const [intervalMs, setIntervalMs] = useState(500);
  const [tensionScale, setTensionScale] = useState(1.3);

  // Rolling effect
  useEffect(() => {
    if (status !== 'rolling') return;
    const timer = setInterval(() => {
      setBoboHandIdx((prev) => (prev + 1) % HANDS.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [status, intervalMs]);

  const handleScreenTap = () => {
    if (status !== 'rolling') return;
    
    // Stop the rolling
    setStatus('stopped');
    
    // Simulate user winning
    const bHand = HANDS[boboHandIdx];
    let uHand = '✋';
    if (bHand === '✊') uHand = '✋';
    if (bHand === '✌️') uHand = '✊';
    if (bHand === '✋') uHand = '✌️';
    setUserHand(uHand);

    // After 1 second of tension, show result
    setTimeout(() => {
      setStatus('result');
      
      // If 3 wins, show reward after another delay
      if (winCount + 1 >= 3) {
        setTimeout(() => {
          setStatus('reward');
        }, 1500);
      } else {
        // Reset after 2 seconds for next round
        setTimeout(() => {
          setWinCount(prev => prev + 1);
          setStatus('rolling');
        }, 2000);
      }
    }, 1000);
  };

  const resetGame = () => {
    setWinCount(0);
    setStatus('rolling');
  };

  return (
    <main className="min-h-screen p-10 flex gap-10 justify-center items-start">
      {/* Mobile Simulator */}
      <section className="flex-none flex justify-center items-center">
        <div className="relative w-[375px] h-[812px] bg-black rounded-[40px] p-3 shadow-2xl overflow-hidden">
          <div 
            className="w-full h-full bg-[#FAED5B] rounded-[32px] overflow-hidden relative cursor-pointer"
            onClick={handleScreenTap}
          >
            {/* Header / Title */}
            <div className="absolute top-12 w-full text-center z-10">
              <h2 className="text-xl font-extrabold text-black mb-1">
                {status === 'reward' ? '3판 모두 이겨서 MOMO가 나왔어요!' : 'BOBO를 이기고 혜택 받기!'}
              </h2>
              <p className="text-sm font-bold text-[#E53935] bg-white inline-block px-3 py-1 rounded-full shadow-sm">
                현재 {winCount}연승 중!
              </p>
            </div>

            {/* BOBO Hand Area */}
            <div className="absolute top-0 left-0 w-full h-[400px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={status === 'rolling' ? boboHandIdx : 'stopped'}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: status === 'stopped' ? tensionScale : 1 
                  }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ 
                    type: status === 'stopped' ? 'spring' : 'tween',
                    bounce: 0.6,
                    duration: status === 'stopped' ? 0.3 : 0.1
                  }}
                  className="text-[120px] drop-shadow-xl"
                >
                  {HANDS[boboHandIdx]}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Instruction Text */}
            {status === 'rolling' && (
              <div className="absolute bottom-[200px] w-full text-center">
                <p className="text-lg font-bold">타이밍에 맞춰 화면을 탭하세요!</p>
              </div>
            )}

            {/* Result Text & User Hand */}
            {status === 'result' && (
              <>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-[400px] w-full text-center z-20"
                >
                  <p className="text-2xl font-black text-black">앗싸! 이겼다!</p>
                </motion.div>
                
                <motion.div
                  initial={{ y: 300, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className="absolute bottom-10 left-0 w-full flex justify-center text-[150px] drop-shadow-2xl"
                >
                  {userHand}
                </motion.div>
              </>
            )}

            {/* Reward Card */}
            <AnimatePresence>
              {status === 'reward' && (
                <motion.div
                  initial={{ y: 500, scale: 0.5, rotateY: 180 }}
                  animate={{ y: 0, scale: 1, rotateY: 0 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 15, duration: 1 }}
                  className="absolute inset-0 bg-[#FAED5B] z-30 flex flex-col items-center justify-center pt-20"
                >
                  <div className="w-[240px] h-[340px] bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center relative overflow-hidden border-4 border-[#E53935]">
                    <div className="absolute top-0 w-full h-full bg-gradient-to-tr from-white to-gray-50 opacity-50" />
                    <span className="text-[100px] z-10 drop-shadow-lg">🐭</span>
                    <h3 className="text-2xl font-black text-[#E53935] mt-4 z-10">MOMO 획득!</h3>
                  </div>
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); resetGame(); }}
                    className="mt-12 bg-[#E53935] text-white font-bold py-4 px-10 rounded-full shadow-lg active:scale-95 transition-transform"
                  >
                    다시 도전하기
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </section>

      {/* Control Panel */}
      <aside className="flex-1 max-w-[600px] bg-white rounded-[24px] p-8 shadow-sm border border-gray-100">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">BOBO R.S.P Game</h2>
          <p className="text-gray-500">가위바위보 미니게임 모션 스펙</p>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">모션 파라미터</h3>
            
            <div className="space-y-6">
              <div>
                <label className="flex justify-between mb-2 text-sm font-medium">
                  <span>롤링 속도 (ms)</span>
                  <span className="font-mono bg-gray-100 px-2 rounded">{intervalMs}ms</span>
                </label>
                <input type="range" min="100" max="1000" step="50" value={intervalMs} onChange={e => setIntervalMs(Number(e.target.value))} className="w-full accent-black" />
                <p className="text-xs text-gray-400 mt-1">패가 바뀌는 간격. (기본: 500ms = 0.5초)</p>
              </div>

              <div>
                <label className="flex justify-between mb-2 text-sm font-medium">
                  <span>정지 텐션 크기 (Scale)</span>
                  <span className="font-mono bg-gray-100 px-2 rounded">{tensionScale}x</span>
                </label>
                <input type="range" min="1" max="2" step="0.1" value={tensionScale} onChange={e => setTensionScale(Number(e.target.value))} className="w-full accent-black" />
                <p className="text-xs text-gray-400 mt-1">화면 터치 시 멈출 때 패가 커지는 정도.</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">개발자 전달 코드 (Framer Motion)</h3>
            <div className="bg-[#1e1e1e] p-5 rounded-xl">
              <pre className="text-[#d4d4d4] font-mono text-sm leading-relaxed overflow-x-auto">
{`// 1. 정지 시 타격감 (Spring Scale)
<motion.div
  animate={{ scale: ${tensionScale} }}
  transition={{ type: "spring", bounce: 0.6 }}
>
  {boboHand}
</motion.div>

// 2. 결과 내 손 등장 (Slide Up)
<motion.div
  initial={{ y: 300, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ type: "spring", stiffness: 200 }}
>
  {userHand}
</motion.div>`}
              </pre>
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}
