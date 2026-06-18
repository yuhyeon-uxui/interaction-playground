'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, UserPlus, BarChart2, Ban, UserMinus, X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  stiffness: number;
  damping: number;
  mass: number;
}

export default function BottomSheet({ isOpen, onClose, stiffness, damping, mass }: BottomSheetProps) {
  // Spring config based on user input
  const transitionConfig = {
    type: 'spring',
    stiffness,
    damping,
    mass,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Dim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 z-40"
          />

          {/* Bottom Sheet Container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={transitionConfig}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, info) => {
              // Close if dragged down more than 100px or fast enough
              if (info.offset.y > 100 || info.velocity.y > 500) {
                onClose();
              }
            }}
            className="absolute bottom-0 left-0 right-0 z-50 flex flex-col bg-white rounded-t-3xl shadow-2xl"
          >
            {/* Drag Handle Area */}
            <div className="flex justify-center p-3 cursor-grab active:cursor-grabbing touch-none">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Content Area */}
            <div className="px-5 pb-8">
              {/* Header */}
              <header className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex-shrink-0 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="#ccc" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="bg-[#00C8FF] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded self-start tracking-wide">
                      BBB7
                    </span>
                    <span className="text-[15px] font-semibold max-w-[180px] truncate">
                      일이삼사오육칠팔구십일이삼사오육...
                    </span>
                  </div>
                </div>
                <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-800 transition-colors">
                  <X size={24} strokeWidth={2} />
                </button>
              </header>

              {/* Action Group 1 */}
              <div className="bg-[#F7F7F7] rounded-2xl mb-3 overflow-hidden">
                <button className="w-full flex justify-between items-center p-4 text-[15px] font-medium text-gray-900 active:bg-black/5 transition-colors">
                  <span>채팅</span>
                  <MessageCircle size={20} className="text-gray-600" />
                </button>
                <div className="h-[1px] bg-gray-200 mx-4" />
                <button className="w-full flex justify-between items-center p-4 text-[15px] font-medium text-gray-900 active:bg-black/5 transition-colors">
                  <span>톡 친구 추가</span>
                  <UserPlus size={20} className="text-gray-600" />
                </button>
                <div className="h-[1px] bg-gray-200 mx-4" />
                <button className="w-full flex justify-between items-center p-4 text-[15px] font-medium text-gray-900 active:bg-black/5 transition-colors">
                  <span>전적 비교하기</span>
                  <BarChart2 size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Action Group 2 (Danger) */}
              <div className="bg-[#FFF5F5] rounded-2xl mb-3 overflow-hidden">
                <button className="w-full flex justify-between items-center p-4 text-[15px] font-medium text-[#FF4444] active:bg-black/5 transition-colors">
                  <span>차단</span>
                  <Ban size={20} />
                </button>
                <div className="h-[1px] bg-[#FFE0E0] mx-4" />
                <button className="w-full flex justify-between items-center p-4 text-[15px] font-medium text-[#FF4444] active:bg-black/5 transition-colors">
                  <span>강퇴</span>
                  <UserMinus size={20} />
                </button>
              </div>

              {/* Confirm Button */}
              <button 
                onClick={onClose}
                className="w-full bg-[#111] text-white py-4 rounded-2xl text-[16px] font-semibold mt-3 active:scale-[0.98] transition-transform"
              >
                확인
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
