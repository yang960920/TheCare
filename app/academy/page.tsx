/** app/academy/page.tsx — 아카데미 페이지 (THE CARE v2)
 *
 *  섹션 (Navbar 드롭다운과 일치):
 *  1. #courses — 강의내용 (과정 소개 + 카드)
 *  2. #apply  — 수강신청 (신청 폼)
 *  3. #contact — 문의하기 (전화/이메일 안내)
 */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import AcademyCard from "@/components/ui/AcademyCard";
import { useAdminStore } from "@/store/adminStore";

/* ── 코스 타입 ── */
interface CourseData {
  id: string;
  title: string;
  duration: string;
  description: string;
  price: string;
  capacity: number;
  imageUrl: string;
  visible: boolean;
  features?: string[];
  featured?: boolean;
}

/* ── 더미 코스 (로딩 전 폴백) ── */
const FALLBACK_COURSES: CourseData[] = [
  {
    id: "fallback-1",
    title: "기초 과정",
    duration: "10회 (1회 3시간)",
    price: "",
    capacity: 15,
    imageUrl: "",
    visible: true,
    description: "폴리우레아 아민 이론교육 및 실습교육 (현장체험시공포함)",
    features: [
      "폴리우레아 아민 이론 교육",
      "장비 사용법 및 안전 교육",
      "실습 시공 훈련",
      "현장 체험 시공 포함",
    ],
    featured: false,
  },
  {
    id: "fallback-2",
    title: "전문가 과정",
    duration: "15회 (1회 3시간)",
    price: "",
    capacity: 15,
    imageUrl: "",
    visible: true,
    description: "폴리우레아 아민 + 에폭시 이론교육 및 실습교육 (현장체험시공포함)",
    features: [
      "폴리우레아 아민 심화 교육",
      "에폭시 시공 이론 및 실습",
      "고급 시공 기술 훈련",
      "현장 체험 시공 포함",
    ],
    featured: true,
  },
  {
    id: "fallback-3",
    title: "주말 과정",
    duration: "8회 (1회 4시간)",
    price: "",
    capacity: 15,
    imageUrl: "",
    visible: true,
    description: "폴리우레아 아민 이론교육 및 실습교육 (현장체험시공포함)",
    features: [
      "폴리우레아 아민 이론 교육",
      "주말 집중 실습 훈련",
      "장비 사용법 및 안전 교육",
      "현장 체험 시공 포함",
    ],
    featured: false,
  },
];

export default function AcademyPage() {
  /* ── DB에서 코스 가져오기 ── */
  const [courses, setCourses] = useState<CourseData[]>([]);
  useEffect(() => {
    fetch("/api/academy/courses")
      .then((r) => r.json())
      .then((data: CourseData[]) => setCourses(data.filter((c) => c.visible)))
      .catch(() => {});
  }, []);
  const displayCourses = courses.length > 0 ? courses : FALLBACK_COURSES;

  /* ── 수강 신청 폼 상태 ── */
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [memo, setMemo] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { addAcademyInquiry, addToast } = useAdminStore();

  const openApplyModal = (course?: CourseData) => {
    setSelectedCourse(course || null);
    setShowModal(true);
    setSubmitted(false);
    setName("");
    setPhone("");
    setMemo("");
  };

  const handleSubmit = () => {
    if (!name.trim()) { addToast("이름을 입력해주세요.", "error"); return; }
    if (!phone.trim()) { addToast("연락처를 입력해주세요.", "error"); return; }
    addAcademyInquiry({
      customerName: name,
      phone,
      courseTitle: selectedCourse?.title || "일반 상담",
      memo,
      status: "미확인",
      createdAt: new Date().toISOString().split("T")[0],
    });
    setSubmitted(true);
    addToast("수강 신청이 완료되었습니다!");
  };

  return (
    <>
      {/* ═══ 히어로 ═══ */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-navy overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-gold font-semibold text-sm tracking-wider uppercase">Academy</span>
            <h1 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl text-white mt-3 mb-4">더케어 아카데미</h1>
            <p className="text-white/60 text-base md:text-lg max-w-xl">체계적인 교육으로 청소 전문가의 길을 열어드립니다</p>
          </motion.div>
        </div>
      </section>

      {/* ═══ #courses — 강의내용 ═══ */}
      <section id="courses" className="section-padding bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                  alt="더케어 아카데미 교육 현장"
                  width={800}
                  height={500}
                  className="w-full h-72 md:h-96 object-cover"
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <span className="text-gold font-semibold text-sm tracking-wider uppercase">About Academy</span>
              <h2 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl text-navy mt-3 mb-6">실무 중심의<br />전문 교육 프로그램</h2>
              <div className="space-y-4 text-navy/60 text-base leading-relaxed">
                <p>더케어 아카데미는 실전 현장 노하우를 바탕으로 설계된 전문 교육 프로그램입니다. 이론 교육과 실습을 병행하여 수료 직후 바로 현장에 투입 가능한 인재를 양성합니다.</p>
                <p>기초 과정부터 마스터 과정까지 단계별 커리큘럼을 제공하며, 수료 후 취업 연계 및 창업 지원 프로그램도 운영하고 있습니다.</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                {[
                  { number: "500+", label: "수료생 배출" },
                  { number: "92%", label: "취업/창업률" },
                  { number: "15명", label: "소수 정원제" },
                  { number: "1:1", label: "멘토링 지원" },
                ].map((item) => (
                  <div key={item.label} className="bg-cream rounded-xl p-4">
                    <div className="font-display font-bold text-xl text-gold">{item.number}</div>
                    <div className="text-navy/60 text-sm mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* 과정 카드 */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <span className="text-gold font-semibold text-sm tracking-wider uppercase">Courses</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-navy mt-3 mb-4">수강 과정 안내</h2>
            <p className="text-navy/60 text-base max-w-2xl mx-auto">나에게 맞는 과정을 선택하고 전문가로 성장하세요</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {displayCourses.map((course, index) => (
              <AcademyCard
                key={course.id || course.title}
                title={course.title}
                duration={course.duration}
                description={course.description}
                featured={index === 1}
                index={index}
                onApply={() => openApplyModal(course)}
              />
            ))}
          </div>
        </div>
      </section>


      {/* ═══ #contact — 문의하기 ═══ */}
      <section id="contact" className="py-16 md:py-20 bg-navy scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <span className="text-gold font-semibold text-sm tracking-wider uppercase">Contact Us</span>
            <h2 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl text-white mt-3 mb-4">문의하기</h2>
            <p className="text-white/60 text-base md:text-lg mb-8 max-w-xl mx-auto">궁금한 점이 있으시면 언제든지 연락주세요. 친절하게 상담해 드리겠습니다.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => openApplyModal()} className="px-8 py-4 bg-gradient-to-r from-gold to-gold-light text-white font-bold rounded-xl hover:shadow-xl hover:shadow-gold/30 transition-all duration-300">
                수강 상담 신청
              </button>
              <a href="tel:031-0000-0000" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                031-0000-0000
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ 수강 신청 팝업 모달 ═══ */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 bg-black/50 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                {!submitted ? (
                  <>
                    <div className="bg-gradient-to-br from-navy to-navy-light p-6 md:p-8 rounded-t-2xl">
                      <div className="flex justify-end mb-2">
                        <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                          <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <h3 className="font-display font-bold text-xl text-white mb-1">수강 신청</h3>
                      {selectedCourse ? (
                        <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                          <span className="font-bold text-white text-base">{selectedCourse.title}</span>
                          <div className="flex items-center gap-1.5 text-white/60 text-sm mt-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {selectedCourse.duration}
                          </div>
                        </div>
                      ) : (
                        <p className="text-white/60 text-sm mt-2">관심 있는 과정에 대해 상담해 드립니다</p>
                      )}
                    </div>
                    <div className="p-6 md:p-8 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-navy mb-1.5">이름 <span className="text-red-400">*</span></label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="홍길동" className="w-full px-4 py-3.5 rounded-xl border border-slate-light focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all text-sm text-navy placeholder:text-slate" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy mb-1.5">연락처 <span className="text-red-400">*</span></label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-1234-5678" className="w-full px-4 py-3.5 rounded-xl border border-slate-light focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all text-sm text-navy placeholder:text-slate" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy mb-1.5">추가 문의사항 <span className="text-navy/40">(선택)</span></label>
                        <textarea rows={3} value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="궁금하신 점을 자유롭게 적어주세요" className="w-full px-4 py-3 rounded-xl border border-slate-light focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all text-sm text-navy placeholder:text-slate resize-none" />
                      </div>
                      <button type="button" onClick={handleSubmit} className="w-full py-4 bg-gradient-to-r from-gold to-gold-light text-white font-bold rounded-xl hover:shadow-lg hover:shadow-gold/25 transition-all duration-300 text-base">
                        수강 신청하기
                      </button>
                      <p className="text-center text-navy/40 text-xs">신청 후 담당자가 상담 연락을 드립니다</p>
                    </div>
                  </>
                ) : (
                  <div className="p-8 md:p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-5">
                      <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-display font-bold text-xl text-navy mb-3">수강 신청이 완료되었습니다!</h3>
                    <p className="text-navy/50 text-sm mb-6 leading-relaxed">
                      {selectedCourse ? `${selectedCourse.title}에 대해 ` : ""}담당자가 빠른 시일 내에 연락드리겠습니다.<br />감사합니다.
                    </p>
                    <button onClick={() => setShowModal(false)} className="px-8 py-3 bg-gradient-to-r from-gold to-gold-light text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-gold/25 transition-all">
                      확인
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
