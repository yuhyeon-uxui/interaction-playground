'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HANDS = ['✊', '✌️', '✋'];

export default function BoboRSP() {
  const [status, setStatus] = useState<'rolling' | 'stopped' | 'result' | 'reward'>('rolling');
  const [boboHandIdx, setBoboHandIdx] = useState(0);
  const [userHand, setUserHand] = useState('✋');
  const [winCount, setWinCount] = useState(0);
  
  const [forceResult, setForceResult] = useState<'random' | 'win' | 'lose' | 'tie'>('random');
  const [lastOutcome, setLastOutcome] = useState<'win' | 'lose' | 'tie' | null>(null);
  
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
    
    setStatus('stopped');
    
    const bHand = HANDS[boboHandIdx];
    let outcome = forceResult;
    if (outcome === 'random') {
      const r = Math.random();
      if (r < 0.33) outcome = 'win';
      else if (r < 0.66) outcome = 'lose';
      else outcome = 'tie';
    }

    let uHand = bHand;
    if (outcome === 'win') {
      if (bHand === '✊') uHand = '✋';
      if (bHand === '✌️') uHand = '✊';
      if (bHand === '✋') uHand = '✌️';
    } else if (outcome === 'lose') {
      if (bHand === '✊') uHand = '✌️';
      if (bHand === '✌️') uHand = '✋';
      if (bHand === '✋') uHand = '✊';
    }
    
    setUserHand(uHand);
    setLastOutcome(outcome as 'win' | 'lose' | 'tie');

    // Tension delay before showing result
    setTimeout(() => {
      setStatus('result');
      
      if (outcome === 'win') {
        if (winCount + 1 >= 3) {
          setTimeout(() => setStatus('reward'), 1500);
        } else {
          setTimeout(() => {
            setWinCount(prev => prev + 1);
            setStatus('rolling');
          }, 2000);
        }
      } else if (outcome === 'lose') {
        // Lose: Drop down and reset score
        setTimeout(() => {
          setWinCount(0);
          setStatus('rolling');
        }, 2000);
      } else if (outcome === 'tie') {
        // Tie: Clash and restart quickly
        setTimeout(() => {
          setStatus('rolling');
        }, 1200);
      }
    }, 800);
  };

  const resetGame = () => {
    setWinCount(0);
    setStatus('rolling');
  };

  return (
    <main className="min-h-screen p-10 flex gap-10 justify-center items-start">
      <section className="flex-none flex justify-center items-center">
        <div className="relative w-[375px] h-[812px] bg-black rounded-[40px] p-3 shadow-2xl overflow-hidden">
          <div 
            className="w-full h-full bg-[#FAED5B] rounded-[32px] overflow-hidden relative cursor-pointer"
            onClick={handleScreenTap}
          >
            <div className="absolute top-12 w-full text-center z-10">
              <h2 className="text-xl font-extrabold text-black mb-1">
                {status === 'reward' ? '3판 모두 이겨서 MOMO가 나왔어요!' : 'BOBO를 이기고 혜택 받기!'}
              </h2>
              <p className="text-sm font-bold text-[#E53935] bg-white inline-block px-3 py-1 rounded-full shadow-sm">
                현재 {winCount}연승 중!
              </p>
            </div>

            <div className="absolute top-0 left-0 w-full h-[400px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={status === 'rolling' ? boboHandIdx : 'stopped'}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: status === 'stopped' ? tensionScale : 1,
                    rotate: status === 'result' && lastOutcome === 'tie' ? [0, -10, 10, -10, 0] : 0 
                  }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ 
                    type: status === 'stopped' ? 'spring' : 'tween',
                    bounce: 0.6,
                    duration: status === 'stopped' ? 0.3 : (lastOutcome === 'tie' ? 0.4 : 0.1)
                  }}
                  className="text-[120px] drop-shadow-xl"
                >
                  {HANDS[boboHandIdx]}
                </motion.div>
              </AnimatePresence>
            </div>

            {status === 'rolling' && (
              <div className="absolute bottom-[200px] w-full text-center">
                <p className="text-lg font-bold text-gray-800">이길 것 같을 때 터치하세요!</p>
              </div>
            )}

            {status === 'result' && (
              <>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-[400px] w-full text-center z-20"
                >
                  {lastOutcome === 'win' && <p className="text-2xl font-black text-[#E53935]">앗싸! 이겼다!</p>}
                  {lastOutcome === 'lose' && <p className="text-2xl font-black text-gray-500">아쉽게 졌어요...</p>}
                  {lastOutcome === 'tie' && <p className="text-2xl font-black text-blue-600">앗! 비겼다! 찌릿!</p>}
                </motion.div>
                
                {lastOutcome === 'win' && (
                  <motion.div
                    initial={{ y: 300, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="absolute bottom-10 left-0 w-full flex justify-center text-[150px] drop-shadow-2xl"
                  >
                    {userHand}
                  </motion.div>
                )}

                {lastOutcome === 'lose' && (
                  <motion.div
                    initial={{ y: 300, opacity: 0 }}
                    animate={{ y: 50, opacity: 1, filter: "grayscale(100%)" }}
                    transition={{ type: 'tween', ease: "easeOut", duration: 0.5 }}
                    className="absolute bottom-10 left-0 w-full flex justify-center text-[150px] drop-shadow-md"
                  >
                    <motion.div
                      animate={{ y: [0, 200], opacity: [1, 0] }}
                      transition={{ delay: 1, duration: 0.8, ease: "easeIn" }}
                    >
                      {userHand}
                    </motion.div>
                  </motion.div>
                )}

                {lastOutcome === 'tie' && (
                  <motion.div
                    initial={{ y: 300, opacity: 0 }}
                    animate={{ y: 0, opacity: 1, rotate: [0, 10, -10, 10, 0] }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    className="absolute bottom-[100px] left-0 w-full flex justify-center text-[150px] drop-shadow-2xl"
                  >
                    {userHand}
                  </motion.div>
                )}
              </>
            )}

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

      <aside className="flex-1 max-w-[600px] bg-white rounded-[24px] p-8 shadow-sm border border-gray-100">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">BOBO R.S.P Game</h2>
          <p className="text-gray-500">가위바위보 미니게임 모션 스펙</p>
        </div>

        <div className="space-y-8">
          {/* Result Simulator */}
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-sm mb-3 text-gray-700">결과 시뮬레이터 (테스트용)</h3>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setForceResult('random')}
                className={`py-2 text-sm font-bold rounded-lg border ${forceResult === 'random' ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-300'}`}
              >
                🎲 완전 랜덤
              </button>
              <button 
                onClick={() => setForceResult('win')}
                className={`py-2 text-sm font-bold rounded-lg border ${forceResult === 'win' ? 'bg-[#E53935] text-white border-[#E53935]' : 'bg-white text-[#E53935] border-red-200'}`}
              >
                🎉 무조건 승리
              </button>
              <button 
                onClick={() => setForceResult('lose')}
                className={`py-2 text-sm font-bold rounded-lg border ${forceResult === 'lose' ? 'bg-gray-600 text-white border-gray-600' : 'bg-white text-gray-500 border-gray-300'}`}
              >
                😭 무조건 패배
              </button>
              <button 
                onClick={() => setForceResult('tie')}
                className={`py-2 text-sm font-bold rounded-lg border ${forceResult === 'tie' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-200'}`}
              >
                ⚔️ 무조건 무승부
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">원하는 결과를 선택하고 좌측 화면을 탭해보세요.</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">모션 파라미터</h3>
            <div className="space-y-6">
              <div>
                <label className="flex justify-between mb-2 text-sm font-medium">
                  <span>롤링 속도 (ms)</span>
                  <span className="font-mono bg-gray-100 px-2 rounded">{intervalMs}ms</span>
                </label>
                <input type="range" min="100" max="1000" step="50" value={intervalMs} onChange={e => setIntervalMs(Number(e.target.value))} className="w-full accent-black" />
              </div>
              <div>
                <label className="flex justify-between mb-2 text-sm font-medium">
                  <span>정지 텐션 크기 (Scale)</span>
                  <span className="font-mono bg-gray-100 px-2 rounded">{tensionScale}x</span>
                </label>
                <input type="range" min="1" max="2" step="0.1" value={tensionScale} onChange={e => setTensionScale(Number(e.target.value))} className="w-full accent-black" />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}
