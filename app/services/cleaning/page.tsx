/** app/services/cleaning/page.tsx — 입주청소 서비스 페이지
 *
 *  섹션: 안내 / 시공범위 및 특화서비스 / 시공사례
 */
"use client";

import { motion } from "framer-motion";
import CaseGallery from "@/components/ui/CaseGallery";

export default function CleaningPage() {
  return (
    <>
      {/* ═══ 히어로 ═══ */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-navy overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-gold font-semibold text-sm tracking-wider uppercase">Move-in Cleaning</span>
            <h1 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl text-white mt-3 mb-4">입주 청소</h1>
            <p className="text-white/60 text-base md:text-lg max-w-xl">
              신축·이사 전후 전문 입주 청소 서비스로 새 집처럼 깨끗하게
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ 입주청소 안내 ═══ */}
      <section id="info" className="section-padding bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto">
            <span className="text-gold font-semibold text-sm tracking-wider uppercase">About Service</span>
            <h2 className="font-display font-bold text-2xl md:text-4xl text-navy mt-3 mb-6">입주청소의 필요성</h2>
            <div className="space-y-4 text-navy/60 text-base leading-relaxed">
              <p>신축 아파트나 이사 후 입주 전, 눈에 보이지 않는 <strong className="text-navy">공사 먼지와 미세 분진</strong>이 곳곳에 남아 있습니다. 이러한 잔여 먼지는 호흡기 건강에 악영향을 미칠 수 있어 전문 입주 청소가 필수입니다.</p>
              <p>더케어의 입주 청소는 바닥, 벽면, 창틀, 유리, 욕실, 주방 등 <strong className="text-navy">모든 공간을 구석구석 세밀하게 클리닝</strong>하여 입주 첫 날부터 깨끗한 환경을 제공합니다.</p>
              <p>전문 장비와 친환경 세제를 사용하여 안전하고 깨끗한 공간을 만들어 드립니다.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* ═══ 시공범위 및 특화서비스 ═══ */}
      <section id="scope" className="section-padding bg-cream scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <span className="text-gold font-semibold text-sm tracking-wider uppercase">Service Scope</span>
            <h2 className="font-display font-bold text-2xl md:text-4xl text-navy mt-3 mb-4">시공범위 및 특화서비스</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "창틀 · 유리", desc: "창틀 레일 및 유리면 먼지·오염 완벽 제거" },
              { title: "주방", desc: "싱크대, 상판, 레인지후드 내·외부 크리닝" },
              { title: "욕실", desc: "타일, 변기, 세면대, 거울 물때·스케일 제거" },
              { title: "미코 바닥세척기", desc: "전문 바닥세척 장비로 대리석·타일 바닥 광택 복원", icon: "⭐" },
              { title: "하자체크", desc: "입주 전 벽면 균열, 도배 불량, 설비 하자 체크 서비스", icon: "⭐" },
              { title: "피톤치드 시공", desc: "천연 피톤치드 분사로 쾌적한 실내 공기 조성", icon: "⭐" },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="bg-white rounded-2xl p-6 gold-border">
                <div className="flex items-center gap-2 mb-3">
                  {item.icon && <span className="text-gold text-sm">{item.icon}</span>}
                  <h3 className="font-display font-bold text-lg text-navy">{item.title}</h3>
                  {item.icon && <span className="text-xs text-gold bg-gold/10 px-2 py-0.5 rounded-full">특화</span>}
                </div>
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
            <h2 className="font-display font-bold text-2xl md:text-4xl text-navy mt-3 mb-4">입주청소 시공사례</h2>
          </motion.div>
          <CaseGallery serviceType="cleaning" />
        </div>
      </section>
    </>
  );
}
