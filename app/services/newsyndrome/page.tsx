/** app/services/newsyndrome/page.tsx — 새집증후군 서비스 페이지 */
"use client";

import { motion } from "framer-motion";
import CaseGallery from "@/components/ui/CaseGallery";

export default function NewSyndromePage() {
  return (
    <>
      {/* ═══ 히어로 ═══ */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-navy overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-gold font-semibold text-sm tracking-wider uppercase">New House Syndrome</span>
            <h1 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl text-white mt-3 mb-4">새집증후군 제거</h1>
            <p className="text-white/60 text-base md:text-lg max-w-xl">유해물질 측정 및 제거로 가족의 건강을 지킵니다</p>
          </motion.div>
        </div>
      </section>

      {/* ═══ 새집증후군 케어 ═══ */}
      <section id="info" className="section-padding bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto">
            <span className="text-gold font-semibold text-sm tracking-wider uppercase">About Service</span>
            <h2 className="font-display font-bold text-2xl md:text-4xl text-navy mt-3 mb-6">새집증후군 케어</h2>
            <div className="space-y-4 text-navy/60 text-base leading-relaxed">
              <p>새로 지은 건물이나 리모델링한 공간에는 <strong className="text-navy">포름알데히드, VOC(휘발성 유기화합물)</strong> 등 유해 물질이 잔존합니다. 이는 두통, 어지러움, 호흡기 질환의 원인이 됩니다.</p>
              <p>특히 <strong className="text-navy">어린아이, 임산부, 반려동물</strong>이 있는 가정에서는 새집증후군 제거 시공이 필수입니다. 더케어는 전문 장비와 친환경 약품으로 유해 물질을 안전하게 제거합니다.</p>
            </div>

            {/* 추천 대상 */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: "👶", label: "영유아 가정" },
                { icon: "🤰", label: "임산부 가정" },
                { icon: "🐾", label: "반려동물 가정" },
              ].map((item) => (
                <div key={item.label} className="bg-cream rounded-xl p-4 text-center gold-border">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <span className="text-sm font-semibold text-navy">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* ═══ 시공방식 ═══ */}
      <section id="method" className="section-padding bg-cream scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <span className="text-gold font-semibold text-sm tracking-wider uppercase">Process</span>
            <h2 className="font-display font-bold text-2xl md:text-4xl text-navy mt-3 mb-4">시공 방식</h2>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {[
              { step: "01", title: "오염도 체크", desc: "전문 측정 장비로 실내 유해 물질(포름알데히드, VOC 등) 농도를 정밀 측정합니다." },
              { step: "02", title: "친환경 약품 분사", desc: "인체에 무해한 친환경 약품을 벽면, 바닥, 가구 표면에 고르게 분사합니다." },
              { step: "03", title: "고온 열처리", desc: "고온 스팀 처리로 유해 물질의 분해와 제거를 촉진합니다." },
              { step: "04", title: "공기 순환 마감", desc: "강력한 환기 시스템으로 잔여 유해 물질을 완전히 배출하고 쾌적한 실내 환경을 완성합니다." },
            ].map((item, i) => (
              <motion.div key={item.step} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="flex items-start gap-6 mb-8 last:mb-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">{item.step}</span>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-display font-bold text-lg text-navy mb-2">{item.title}</h3>
                  <p className="text-navy/60 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 시공사례 ═══ */}
      <section id="cases" className="section-padding bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <span className="text-gold font-semibold text-sm tracking-wider uppercase">Before &amp; After</span>
            <h2 className="font-display font-bold text-2xl md:text-4xl text-navy mt-3 mb-4">새집증후군 시공사례</h2>
          </motion.div>
          <CaseGallery serviceType="newsyndrome" />
        </div>
      </section>
    </>
  );
}
