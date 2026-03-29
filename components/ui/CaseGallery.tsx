/** CaseGallery.tsx — 시공사례 Before/After 갤러리 공통 컴포넌트
 *
 *  Props:
 *  - serviceType: 서비스 타입 ("cleaning" | "grout" | etc.)
 *  - 자동으로 /api/cases?serviceType=xxx 에서 데이터 로드
 */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface CaseStudy {
  id: string;
  title: string;
  description: string;
  location: string;
  beforeImageUrl: string;
  afterImageUrl: string;
}

interface CaseGalleryProps {
  serviceType: string;
}

export default function CaseGallery({ serviceType }: CaseGalleryProps) {
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/cases?serviceType=${serviceType}`)
      .then((r) => r.json())
      .then((data: CaseStudy[]) => setCases(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [serviceType]);

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center gap-2 text-navy/40">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          시공사례를 불러오는 중...
        </div>
      </div>
    );
  }

  if (cases.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gold/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-navy/40 text-sm">아직 등록된 시공사례가 없습니다.</p>
        <p className="text-navy/30 text-xs mt-1">관리자 페이지에서 시공사례를 추가해 주세요.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      {cases.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white rounded-2xl overflow-hidden gold-border hover-lift"
        >
          {/* Before / After 이미지 */}
          <div className="grid grid-cols-2 gap-0.5 bg-slate-light/30">
            {/* Before */}
            <div className="relative aspect-[4/3]">
              {item.beforeImageUrl ? (
                <Image
                  src={item.beforeImageUrl}
                  alt={`${item.title} - Before`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-cream flex items-center justify-center">
                  <span className="text-navy/20 text-xs">이미지 없음</span>
                </div>
              )}
              <div className="absolute top-2 left-2 bg-navy/70 text-white text-xs font-bold px-2 py-1 rounded">
                BEFORE
              </div>
            </div>
            {/* After */}
            <div className="relative aspect-[4/3]">
              {item.afterImageUrl ? (
                <Image
                  src={item.afterImageUrl}
                  alt={`${item.title} - After`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-cream flex items-center justify-center">
                  <span className="text-navy/20 text-xs">이미지 없음</span>
                </div>
              )}
              <div className="absolute top-2 left-2 bg-gold text-white text-xs font-bold px-2 py-1 rounded">
                AFTER
              </div>
            </div>
          </div>

          {/* 텍스트 */}
          <div className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-display font-bold text-base text-navy">{item.title}</h4>
              {item.location && (
                <span className="text-xs text-gold bg-gold/10 px-2 py-0.5 rounded-full">
                  {item.location}
                </span>
              )}
            </div>
            {item.description && (
              <p className="text-navy/50 text-sm leading-relaxed">{item.description}</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
