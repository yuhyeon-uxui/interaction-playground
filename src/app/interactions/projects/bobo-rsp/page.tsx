'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HANDS = ['✊', '✌️', '✋'];

const getHandName = (hand: string) => {
  if (hand === '✊') return '바위';
  if (hand === '✌️') return '가위';
  return '보';
};

export default function BoboRSP() {
  const [status, setStatus] = useState<'rolling' | 'stopped' | 'boboResult' | 'result' | 'reward'>('rolling');
  const [boboHandIdx, setBoboHandIdx] = useState(0);
  const [userHand, setUserHand] = useState('✋');
  const [winCount, setWinCount] = useState(0);
  
  const [forceResult, setForceResult] = useState<'random' | 'win' | 'lose' | 'tie'>('random');
  const [lastOutcome, setLastOutcome] = useState<'win' | 'lose' | 'tie' | null>(null);
  
  // Controls
  const [intervalMs, setIntervalMs] = useState(500);
  const [tensionScale, setTensionScale] = useState(1.3);
  const [intermediateDelayMs, setIntermediateDelayMs] = useState(1500);

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
      if (winCount === 0) {
        outcome = 'win';
      } else if (winCount === 1) {
        if (r < 0.8) outcome = 'win';
        else if (r < 0.9) outcome = 'tie';
        else outcome = 'lose';
      } else {
        if (r < 0.5) outcome = 'win';
        else if (r < 0.85) outcome = 'tie';
        else outcome = 'lose';
      }
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

    setTimeout(() => {
      setStatus('boboResult');
      
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
          setTimeout(() => {
            setWinCount(0);
            setStatus('rolling');
          }, 2500);
        } else if (outcome === 'tie') {
          setTimeout(() => {
            setStatus('rolling');
          }, 1500);
        }
      }, intermediateDelayMs);
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
            {/* Sunburst Background for Win */}
            <AnimatePresence>
              {status === 'result' && lastOutcome === 'win' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="w-[200%] h-[200%]"
                    style={{
                      background: 'repeating-conic-gradient(from 0deg, rgba(255,255,255,0.4) 0deg 15deg, transparent 15deg 30deg)'
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute top-12 w-full text-center z-10">
              <h2 className="text-xl font-extrabold text-black mb-1">
                {status === 'reward' ? '3판 모두 이겨서 MOMO가 나왔어요!' : 'BOBO를 이기고 혜택 받기!'}
              </h2>
              <p className="text-sm font-bold text-[#E53935] bg-white inline-block px-3 py-1 rounded-full shadow-sm">
                현재 {winCount}연승 중!
              </p>
            </div>

            <div className="absolute top-0 left-0 w-full h-[400px] flex items-center justify-center z-10">
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
              <div className="absolute bottom-[200px] w-full text-center z-10">
                <p className="text-lg font-bold text-gray-800">이길 것 같을 때 터치하세요!</p>
              </div>
            )}

            {status === 'boboResult' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-[350px] w-full text-center z-20 flex flex-col items-center gap-2"
              >
                <p className="text-xl font-bold text-black">BOBO는</p>
                <div className="bg-[#E53935] text-white px-4 py-1.5 rounded-lg text-xl font-black shadow-md">
                  {getHandName(HANDS[boboHandIdx])}
                </div>
                <p className="text-xl font-bold text-black">를 냈어요!</p>
              </motion.div>
            )}

            {status === 'result' && (
              <>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-[350px] w-full text-center z-20 flex flex-col items-center"
                >
                  <p className="text-gray-500 font-bold text-lg mb-1">{winCount + 1}판째</p>
                  
                  {lastOutcome === 'win' && (
                    <>
                      <p className="text-3xl font-black text-black">앗싸!</p>
                      <p className="text-2xl font-black text-black mt-1">BOBO를 이겼어요!</p>
                    </>
                  )}
                  {lastOutcome === 'lose' && (
                    <>
                      <p className="text-2xl font-black text-black">아쉽게 BOBO에게 졌어요</p>
                      <p className="text-xl font-bold text-gray-700 mt-1">괜찮아요!</p>
                    </>
                  )}
                  {lastOutcome === 'tie' && (
                    <>
                      <p className="text-3xl font-black text-black">무승부 한 판 더!</p>
                      <div className="bg-[#E53935] text-white px-5 py-1.5 rounded-full mt-3 font-bold shadow-md">
                        현재 {winCount}연승 중!
                      </div>
                    </>
                  )}
                </motion.div>
                
                {lastOutcome === 'win' && (
                  <motion.div
                    initial={{ y: 300, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="absolute bottom-10 left-0 w-full flex justify-center text-[150px] drop-shadow-2xl z-20"
                  >
                    {userHand}
                  </motion.div>
                )}

                {lastOutcome === 'lose' && (
                  <motion.div
                    initial={{ y: 300, opacity: 0 }}
                    animate={{ y: 50, opacity: 1, filter: "grayscale(100%)" }}
                    transition={{ type: 'tween', ease: "easeOut", duration: 0.5 }}
                    className="absolute bottom-10 left-0 w-full flex justify-center text-[150px] drop-shadow-md z-20"
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
                    className="absolute bottom-[100px] left-0 w-full flex justify-center text-[150px] drop-shadow-2xl z-20"
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
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-sm mb-3 text-gray-700">결과 시뮬레이터 (테스트용)</h3>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setForceResult('random')}
                className={`py-2 text-sm font-bold rounded-lg border ${forceResult === 'random' ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-300'}`}
              >
                🎲 완전 랜덤 (서비스 로직)
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
            <div className="mt-2">
              <button 
                onClick={() => setStatus('reward')}
                className="w-full py-2 text-sm font-bold rounded-lg border bg-[#FAED5B] text-black border-[#FAED5B] shadow-sm hover:brightness-95 transition-all"
              >
                🎁 최종 보상(MOMO) 카드 바로보기
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">랜덤일 경우 1라(100%), 2라(80%), 3라(50%) 확률로 연승 적용</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">모션 파라미터</h3>
            <div className="space-y-6">
              <div>
                <label className="flex justify-between mb-2 text-sm font-medium">
                  <span>중간 연출 쪼는 맛 (ms)</span>
                  <span className="font-mono bg-gray-100 px-2 rounded">{intermediateDelayMs}ms</span>
                </label>
                <input type="range" min="500" max="3000" step="100" value={intermediateDelayMs} onChange={e => setIntermediateDelayMs(Number(e.target.value))} className="w-full accent-black" />
                <p className="text-xs text-gray-400 mt-1">결과 전 "BOBO는 바위를 냈어요!"가 머무는 딜레이 시간.</p>
              </div>
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

          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              💻 개발자 전달용 스펙 코드
            </h3>
            <div className="space-y-4">
              <div className="bg-[#1e1e1e] p-5 rounded-xl border border-gray-800">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[#888] text-xs font-bold tracking-wider">REACT / FRAMER MOTION</span>
                </div>
                <pre className="text-[#d4d4d4] font-mono text-[13px] leading-relaxed overflow-x-auto">
{`// 1. 중간 연출 화면 플로우 타이밍
setTimeout(() => {
  showBoboHand("BOBO는 바위를 냈어요!"); // 중간 화면
  
  setTimeout(() => {
    showUserHandAndResult(); // 최종 패와 결과 공개
  }, ${intermediateDelayMs}); // 쪼는 맛 딜레이
}, 800); // 탭 후 타격감 텐션 딜레이

// 2. 탭 할때 텐션 타격감 (Spring Scale)
<motion.div
  animate={{ scale: ${tensionScale} }}
  transition={{ type: "spring", bounce: 0.6 }}
>
  {boboHand}
</motion.div>

// 3. 승리 시 회전하는 배경 (Sunburst)
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
  style={{ background: 'repeating-conic-gradient(...)' }}
/>`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}
