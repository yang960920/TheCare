/** app/services/nanocoat/page.tsx — 나노코팅 서비스 페이지 */
"use client";

import { motion } from "framer-motion";
import CaseGallery from "@/components/ui/CaseGallery";

export default function NanoCoatPage() {
  return (
    <>
      {/* ═══ 히어로 ═══ */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-navy overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-gold font-semibold text-sm tracking-wider uppercase">Nano Coating</span>
            <h1 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl text-white mt-3 mb-4">나노 코팅</h1>
            <p className="text-white/60 text-base md:text-lg max-w-xl">프리미엄 발수·항균 나노 코팅으로 청소 시간을 단축</p>
          </motion.div>
        </div>
      </section>

      {/* ═══ 나노코팅 안내 ═══ */}
      <section id="info" className="section-padding bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto">
            <span className="text-gold font-semibold text-sm tracking-wider uppercase">About Service</span>
            <h2 className="font-display font-bold text-2xl md:text-4xl text-navy mt-3 mb-6">나노코팅 안내</h2>
            <div className="space-y-4 text-navy/60 text-base leading-relaxed">
              <p>욕실 유리, 거울, 주방 상판 등에 나노 코팅을 적용하면 <strong className="text-navy">물때와 오염이 부착되지 않아</strong> 청소 시간을 획기적으로 줄일 수 있습니다.</p>
              <p>나노 입자가 표면에 <strong className="text-navy">발수 코팅층</strong>을 형성하여 물방울이 자연스럽게 흘러내리고, 세균 번식도 억제합니다. 일상 관리가 훨씬 편해지는 프리미엄 케어 서비스입니다.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* ═══ 시공범위 ═══ */}
      <section id="scope" className="section-padding bg-cream scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <span className="text-gold font-semibold text-sm tracking-wider uppercase">Application Areas</span>
            <h2 className="font-display font-bold text-2xl md:text-4xl text-navy mt-3 mb-4">시공범위</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { area: "욕실 유리 · 거울", desc: "물때 부착 방지, 깨끗한 투명도 유지", icon: "🪞" },
              { area: "세면대 · 수전", desc: "물때·스케일 방지, 반짝이는 광택 유지", icon: "🚿" },
              { area: "주방 상판", desc: "기름때·음식물 오염 방지, 위생적 주방 환경", icon: "🍳" },
              { area: "거실 타일", desc: "발수 효과로 오염 방지, 손쉬운 관리", icon: "🏠" },
            ].map((item, i) => (
              <motion.div key={item.area} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="bg-white rounded-2xl p-6 text-center gold-border">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-display font-bold text-base text-navy mb-2">{item.area}</h3>
                <p className="text-navy/60 text-sm leading-relaxed">{item.desc}</p>
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
            <h2 className="font-display font-bold text-2xl md:text-4xl text-navy mt-3 mb-4">나노코팅 시공사례</h2>
          </motion.div>
          <CaseGallery serviceType="nanocoat" />
        </div>
      </section>
    </>
  );
}
