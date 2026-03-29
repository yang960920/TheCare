/** app/services/grout/page.tsx — 줄눈시공 서비스 페이지 */
"use client";

import { motion } from "framer-motion";
import CaseGallery from "@/components/ui/CaseGallery";

export default function GroutPage() {
  return (
    <>
      {/* ═══ 히어로 ═══ */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-navy overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-gold font-semibold text-sm tracking-wider uppercase">Grout Construction</span>
            <h1 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl text-white mt-3 mb-4">줄눈 시공</h1>
            <p className="text-white/60 text-base md:text-lg max-w-xl">프리미엄 에폭시 줄눈제로 곰팡이 없는 깨끗한 공간</p>
          </motion.div>
        </div>
      </section>

      {/* ═══ 줄눈시공 안내 ═══ */}
      <section id="info" className="section-padding bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto">
            <span className="text-gold font-semibold text-sm tracking-wider uppercase">About Service</span>
            <h2 className="font-display font-bold text-2xl md:text-4xl text-navy mt-3 mb-6">줄눈시공의 필요성</h2>
            <div className="space-y-4 text-navy/60 text-base leading-relaxed">
              <p>시간이 지나면 기존 <strong className="text-navy">백시멘트 줄눈</strong>은 곰팡이, 오염, 변색이 발생합니다. 특히 욕실, 주방 등 습기가 많은 공간에서는 위생 문제로 직결됩니다.</p>
              <p>더케어는 <strong className="text-navy">케라폭시, 빅라이언</strong> 등 고급 에폭시 줄눈제를 사용하여 곰팡이 방지, 방수, 항균 효과를 제공합니다. 시공 후 반영구적으로 깨끗한 줄눈을 유지할 수 있습니다.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* ═══ 프리미엄 에폭시 빅라이언 ═══ */}
      <section id="premium" className="section-padding bg-cream scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <span className="text-gold font-semibold text-sm tracking-wider uppercase">Premium Epoxy</span>
            <h2 className="font-display font-bold text-2xl md:text-4xl text-navy mt-3 mb-4">프리미엄 에폭시 &ldquo;빅라이언&rdquo;</h2>
            <p className="text-navy/60 text-base max-w-2xl mx-auto">5세대 수소화 에폭시 기술의 정점</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "황변 방지", desc: "수소화 기술로 시간이 지나도 변색 없는 깨끗한 줄눈 유지", icon: "🛡️" },
              { title: "24시간 경화", desc: "빠른 경화 시간으로 시공 당일부터 사용 가능한 편리함", icon: "⏱️" },
              { title: "CE/ISO 인증", desc: "유럽 CE 및 ISO 국제 인증을 획득한 검증된 제품", icon: "✅" },
              { title: "항균·방수", desc: "곰팡이, 세균 번식 차단 및 완벽한 방수 성능 보장", icon: "💧" },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="bg-white rounded-2xl p-6 text-center gold-border">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-display font-bold text-lg text-navy mb-2">{item.title}</h3>
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
            <h2 className="font-display font-bold text-2xl md:text-4xl text-navy mt-3 mb-4">줄눈시공 시공사례</h2>
            <p className="text-navy/60 text-sm">현관 · 화장실 · 샤워부스 · 베란다 · 세탁실</p>
          </motion.div>
          <CaseGallery serviceType="grout" />
        </div>
      </section>
    </>
  );
}
