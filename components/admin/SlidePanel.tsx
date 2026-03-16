/** SlidePanel.tsx — 우측 슬라이드 오버 패널
 *
 *  용도:
 *  - 서비스/아카데미 등록·수정 폼을 우측에서 슬라이드 인
 *  - 오버레이 배경 클릭으로 닫기
 *  - Framer Motion 애니메이션
 */
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface SlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function SlidePanel({ isOpen, onClose, title, children }: SlidePanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 어두운 오버레이 배경 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />
          {/* 슬라이드 패널 */}
          <motion.div
            initial={{ x: "100%" }}   // 오른쪽에서 등장
            animate={{ x: 0 }}
            exit={{ x: "100%" }}       // 오른쪽으로 퇴장
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* 패널 헤더 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            {/* 패널 콘텐츠 (스크롤 가능) */}
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
