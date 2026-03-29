"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export interface PopupItem {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  linkUrl: string;
  startDate: string;
  endDate: string;
  position: string;
  visible: boolean;
  hideToday: boolean;
}

export default function PopupManager() {
  const [popups, setPopups] = useState<PopupItem[]>([]);
  const [closedPopups, setClosedPopups] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/popups")
      .then((res) => res.json())
      .then((data: PopupItem[]) => {
        const now = new Date();
        const activePopups = data.filter((p) => {
          if (!p.visible) return false;
          if (p.startDate && new Date(p.startDate) > now) return false;
          if (p.endDate && new Date(p.endDate) < now) return false;

          // 오늘 하루 안보기 체크
          if (p.hideToday) {
            const hiddenUntil = localStorage.getItem(`hide_popup_${p.id}`);
            if (hiddenUntil && new Date(hiddenUntil) > now) return false;
          }

          return true;
        });
        setPopups(activePopups);
      })
      .catch((e) => console.error("Popup load failed", e));
  }, []);

  const handleClose = (id: string, hideToday: boolean) => {
    setClosedPopups((prev) => new Set(prev).add(id));
    if (hideToday) {
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0);
      localStorage.setItem(`hide_popup_${id}`, tomorrow.toISOString());
    }
  };

  if (popups.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none p-4 md:p-8 flex flex-col md:flex-row flex-wrap items-start md:items-end justify-start gap-4">
      <AnimatePresence>
        {popups.map((popup) => {
          if (closedPopups.has(popup.id)) return null;

          const alignClasses =
            popup.position === "left"
              ? "self-start md:self-end"
              : popup.position === "center"
              ? "self-center mx-auto"
              : "self-end ml-auto";

          return (
            <motion.div
              key={popup.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`pointer-events-auto bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border border-slate-100 overflow-hidden w-full max-w-[340px] flex flex-col ${alignClasses}`}
            >
              {popup.imageUrl && (
                <div className="relative w-full aspect-[4/3] bg-slate-50">
                  <Image src={popup.imageUrl} alt={popup.title} fill className="object-cover" />
                </div>
              )}
              
              <div className="p-5 flex-1">
                <h3 className="font-bold text-lg text-navy mb-2 line-clamp-1">{popup.title}</h3>
                <p className="text-slate-600 text-sm whitespace-pre-wrap line-clamp-3 mb-4">
                  {popup.content}
                </p>
                {popup.linkUrl && (
                  <Link
                    href={popup.linkUrl}
                    className="inline-flex w-full justify-center items-center py-2.5 bg-gold/10 text-gold font-semibold rounded-xl text-sm transition-colors hover:bg-gold hover:text-white"
                  >
                    자세히 보기
                  </Link>
                )}
              </div>

              {/* 하단 컨트롤 바 */}
              <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-t border-slate-100">
                {popup.hideToday ? (
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 text-gold focus:ring-gold/20"
                      onChange={(e) => {
                        if (e.target.checked) handleClose(popup.id, true);
                      }}
                    />
                    <span className="text-xs text-slate-500 group-hover:text-slate-700 transition-colors">
                      오늘 하루 보지 않기
                    </span>
                  </label>
                ) : (
                  <div />
                )}
                <button
                  onClick={() => handleClose(popup.id, false)}
                  className="text-xs font-semibold text-slate-500 hover:text-navy transition-colors px-2 py-1"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
