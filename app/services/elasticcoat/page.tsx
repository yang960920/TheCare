/** app/services/elasticcoat/page.tsx — 탄성코트 서비스 페이지 */
"use client";

import { motion } from "framer-motion";
import CaseGallery from "@/components/ui/CaseGallery";

export default function ElasticCoatPage() {
  return (
    <>
      {/* ═══ 히어로 ═══ */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-navy overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-gold font-semibold text-sm tracking-wider uppercase">Elastic Coating</span>
            <h1 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl text-white mt-3 mb-4">탄성 코트</h1>
            <p className="text-white/60 text-base md:text-lg max-w-xl">결로·곰팡이 방지를 위한 전문 탄성 코트 시공</p>
          </motion.div>
        </div>
      </section>

      {/* ═══ 탄성코트 안내 ═══ */}
      <section id="info" className="section-padding bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto">
            <span className="text-gold font-semibold text-sm tracking-wider uppercase">About Service</span>
            <h2 className="font-display font-bold text-2xl md:text-4xl text-navy mt-3 mb-6">탄성코트의 필요성</h2>
            <div className="space-y-4 text-navy/60 text-base leading-relaxed">
              <p>베란다, 다용도실 등 외벽면에 인접한 공간은 <strong className="text-navy">결로 현상</strong>으로 인해 곰팡이가 발생하기 쉽습니다. 이는 건강과 미관 모두에 악영향을 미칩니다.</p>
              <p>더케어의 탄성 코트 시공은 <strong className="text-navy">하도(프라이머) 작업</strong>부터 <strong className="text-navy">꼼꼼한 마감</strong>까지 체계적인 과정을 거쳐 결로와 곰팡이를 근본적으로 차단합니다.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* ═══ 제품 및 시공범위 ═══ */}
      <section id="products" className="section-padding bg-cream scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <span className="text-gold font-semibold text-sm tracking-wider uppercase">Products &amp; Scope</span>
            <h2 className="font-display font-bold text-2xl md:text-4xl text-navy mt-3 mb-4">제품 및 시공범위</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* 바이오세라믹 */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-white rounded-2xl p-8 gold-border">
              <div className="inline-flex items-center gap-2 bg-gold/10 rounded-full px-3 py-1 mb-4">
                <span className="text-gold text-xs font-bold">가성비 추천</span>
              </div>
              <h3 className="font-display font-bold text-xl text-navy mb-3">바이오세라믹</h3>
              <ul className="space-y-2 text-navy/60 text-sm">
                <li className="flex items-start gap-2"><span className="text-gold mt-0.5">✓</span> 뛰어난 통기성으로 자연스러운 습기 조절</li>
                <li className="flex items-start gap-2"><span className="text-gold mt-0.5">✓</span> 합리적인 가격의 결로 방지 솔루션</li>
                <li className="flex items-start gap-2"><span className="text-gold mt-0.5">✓</span> 베란다, 다용도실 등 일반 내벽면에 최적</li>
              </ul>
            </motion.div>
            {/* 에어로겔 */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-white rounded-2xl p-8 gold-border relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gold/5 rounded-bl-full" />
              <div className="inline-flex items-center gap-2 bg-gold/10 rounded-full px-3 py-1 mb-4">
                <span className="text-gold text-xs font-bold">단열 특화</span>
              </div>
              <h3 className="font-display font-bold text-xl text-navy mb-3">에어로겔</h3>
              <ul className="space-y-2 text-navy/60 text-sm">
                <li className="flex items-start gap-2"><span className="text-gold mt-0.5">✓</span> 최고급 단열 성능으로 에너지 효율 극대화</li>
                <li className="flex items-start gap-2"><span className="text-gold mt-0.5">✓</span> 외벽면 및 결로 심한 구간에 최적화</li>
                <li className="flex items-start gap-2"><span className="text-gold mt-0.5">✓</span> 프리미엄 제품으로 장기 내구성 보장</li>
              </ul>
            </motion.div>
          </div>

          {/* 시공범위 */}
          <div className="text-center">
            <h3 className="font-display font-bold text-lg text-navy mb-4">시공 가능 범위</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {["베란다", "다용도실", "드레스룸", "붙박이장 뒤편", "외벽면 인접 방"].map((area) => (
                <span key={area} className="bg-white gold-border rounded-full px-4 py-2 text-sm text-navy/70">{area}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 시공사례 ═══ */}
      <section id="cases" className="section-padding bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <span className="text-gold font-semibold text-sm tracking-wider uppercase">Before &amp; After</span>
            <h2 className="font-display font-bold text-2xl md:text-4xl text-navy mt-3 mb-4">탄성코트 시공사례</h2>
          </motion.div>
          <CaseGallery serviceType="elasticcoat" />
        </div>
      </section>
    </>
  );
}
