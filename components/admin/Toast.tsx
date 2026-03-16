/** Toast.tsx — 토스트 알림 컴포넌트
 *
 *  용도:
 *  - 저장/삭제 등 액션 후 성공/실패 피드백 표시
 *  - 3초 후 자동 사라짐 (스토어에서 관리)
 *  - 화면 우측 하단 고정 위치
 */
"use client";

import { useAdminStore } from "@/store/adminStore";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, X } from "lucide-react";

export default function ToastContainer() {
  const { toasts, removeToast } = useAdminStore();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border min-w-[280px] ${
              toast.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {/* 아이콘 */}
            {toast.type === "success" ? (
              <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />
            ) : (
              <XCircle size={18} className="text-red-500 flex-shrink-0" />
            )}
            {/* 메시지 */}
            <span className="text-sm font-medium flex-1">{toast.message}</span>
            {/* 닫기 버튼 */}
            <button
              onClick={() => removeToast(toast.id)}
              className="p-0.5 rounded hover:bg-black/5 transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
