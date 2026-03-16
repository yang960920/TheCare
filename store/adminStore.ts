/** store/adminStore.ts — 어드민 CMS 전역 상태 관리 (Zustand)
 *
 *  역할:
 *  - 모든 어드민 mock 데이터를 중앙에서 관리
 *  - 각 엔티티별 CRUD 액션 (추가/수정/삭제/토글) 제공
 *  - 실제 DB 없이 클라이언트 상태로 동작
 *
 *  포함 엔티티:
 *  - 히어로 섹션 / 서비스 / 후기(+관리자 답변) / 아카데미 과정
 *  - 포인트 이벤트 / 견적 문의(+연락 이력) / 회사 정보 / 팝업
 */
import { create } from "zustand";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  타입 정의
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/** 히어로 섹션 데이터 */
export interface HeroData {
  headline: string;
  subCopy: string;
  cta1Text: string;
  cta1Link: string;
  cta2Text: string;
  cta2Link: string;
  bgImageUrl: string;
}

/** 서비스 항목 */
export interface ServiceItem {
  id: string;
  name: string;
  summary: string;
  description: string;
  imageUrl: string;
  visible: boolean;
  order: number;
}

/** 고객 후기 (관리자 답변 포함) */
export interface ReviewItem {
  id: string;
  customerName: string;
  serviceType: string;
  rating: number;
  content: string;
  imageUrl: string;
  createdAt: string;
  visible: boolean;
  adminReply: string;        // 관리자 답변 내용
  adminReplyDate: string;    // 관리자 답변 작성일
}

/** 아카데미 수강 과정 */
export interface AcademyCourse {
  id: string;
  title: string;
  duration: string;
  price: string;
  capacity: number;
  description: string;
  imageUrl: string;
  visible: boolean;
}

/** 포인트 이벤트 배너 */
export interface PointEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  bgColor: string;
  visible: boolean;
}

/** 견적 문의 (연락 이력 포함) */
export interface QuoteInquiry {
  id: string;
  customerName: string;
  phone: string;
  serviceType: string;
  area: string;
  memo: string;
  status: "미확인" | "확인" | "완료";
  createdAt: string;
  contactDate: string;       // 연락 드린 날짜
  contactMemo: string;       // 연락 관련 메모
}

/** 회사 정보 */
export interface CompanyInfo {
  name: string;
  ceo: string;
  businessNumber: string;
  address: string;
  phone: string;
  email: string;
  stats: { label: string; value: string }[];
}

/** 팝업 공지 */
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

/** 포인트 적립 정책 텍스트 */
export interface PointPolicy {
  text: string;
}

/** 토스트 알림 */
export interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  스토어 상태 & 액션 타입
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
interface AdminState {
  /* 데이터 */
  hero: HeroData;
  services: ServiceItem[];
  reviews: ReviewItem[];
  courses: AcademyCourse[];
  events: PointEvent[];
  quotes: QuoteInquiry[];
  company: CompanyInfo;
  popups: PopupItem[];
  pointPolicy: PointPolicy;
  toasts: Toast[];

  /* 히어로 액션 */
  updateHero: (data: HeroData) => void;

  /* 서비스 액션 */
  updateService: (id: string, data: Partial<ServiceItem>) => void;
  toggleServiceVisibility: (id: string) => void;

  /* 후기 액션 */
  addReview: (review: Omit<ReviewItem, "id">) => void;
  updateReview: (id: string, data: Partial<ReviewItem>) => void;
  deleteReview: (id: string) => void;
  toggleReviewVisibility: (id: string) => void;
  setAdminReply: (id: string, reply: string) => void;

  /* 아카데미 액션 */
  addCourse: (course: Omit<AcademyCourse, "id">) => void;
  updateCourse: (id: string, data: Partial<AcademyCourse>) => void;
  deleteCourse: (id: string) => void;
  toggleCourseVisibility: (id: string) => void;

  /* 이벤트 액션 */
  addEvent: (event: Omit<PointEvent, "id">) => void;
  updateEvent: (id: string, data: Partial<PointEvent>) => void;
  deleteEvent: (id: string) => void;
  toggleEventVisibility: (id: string) => void;

  /* 견적 문의 액션 */
  updateQuoteStatus: (id: string, status: QuoteInquiry["status"]) => void;
  updateQuoteContact: (id: string, contactDate: string, contactMemo: string) => void;

  /* 회사 정보 액션 */
  updateCompany: (data: Partial<CompanyInfo>) => void;

  /* 팝업 액션 */
  addPopup: (popup: Omit<PopupItem, "id">) => void;
  updatePopup: (id: string, data: Partial<PopupItem>) => void;
  deletePopup: (id: string) => void;
  togglePopupVisibility: (id: string) => void;

  /* 포인트 정책 액션 */
  updatePointPolicy: (text: string) => void;

  /* 토스트 액션 */
  addToast: (message: string, type?: "success" | "error") => void;
  removeToast: (id: string) => void;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  초기 Mock 데이터
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const INITIAL_HERO: HeroData = {
  headline: "깨끗한 공간, 건강한 생활의 시작",
  subCopy: "줄눈 시공부터 입주 청소, 나노 코팅까지.\n클린마스터가 완벽한 클리닝을 약속합니다.",
  cta1Text: "무료 견적 받기",
  cta1Link: "/quote",
  cta2Text: "서비스 둘러보기",
  cta2Link: "/about",
  bgImageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&q=80",
};

const INITIAL_SERVICES: ServiceItem[] = [
  { id: "s1", name: "줄눈 시공", summary: "타일 줄눈 전문 시공", description: "욕실, 주방, 베란다 타일 줄눈을 전문 장비로 깔끔하게 시공합니다.", imageUrl: "", visible: true, order: 1 },
  { id: "s2", name: "입주 청소", summary: "신축·이사 전후 전문 클리닝", description: "신축·이사 전후 전문 입주 청소 서비스입니다.", imageUrl: "", visible: true, order: 2 },
  { id: "s3", name: "탄성 코트", summary: "바닥 보호 및 미끄럼 방지", description: "바닥재 보호와 미끄럼 방지를 위한 탄성 코트 시공입니다.", imageUrl: "", visible: true, order: 3 },
  { id: "s4", name: "나노 코팅", summary: "오염 방지 나노 코팅", description: "주방 상판, 욕실 유리 등에 나노 코팅을 적용합니다.", imageUrl: "", visible: true, order: 4 },
  { id: "s5", name: "새집증후군 제거", summary: "유해물질 측정 및 제거", description: "포름알데히드, VOC 등 유해물질 제거 시공입니다.", imageUrl: "", visible: true, order: 5 },
];

const INITIAL_REVIEWS: ReviewItem[] = [
  { id: "r1", customerName: "김서영", serviceType: "입주 청소", rating: 5, content: "이사 전 입주 청소를 맡겼는데, 정말 새 집처럼 깨끗해졌어요.", imageUrl: "", createdAt: "2025-03-01", visible: true, adminReply: "감사합니다! 다음에도 만족스러운 서비스를 제공하겠습니다.", adminReplyDate: "2025-03-02" },
  { id: "r2", customerName: "박준혁", serviceType: "줄눈 시공", rating: 5, content: "화장실 줄눈이 새것처럼 변했습니다. 가격도 합리적이었어요.", imageUrl: "", createdAt: "2025-03-05", visible: true, adminReply: "", adminReplyDate: "" },
  { id: "r3", customerName: "이미경", serviceType: "나노 코팅", rating: 4, content: "주방 상판에 나노 코팅을 했는데 물때가 안 끼고 관리가 편해졌어요.", imageUrl: "", createdAt: "2025-03-10", visible: true, adminReply: "좋은 후기 감사드립니다. 나노 코팅은 평균 3년간 효과가 유지됩니다!", adminReplyDate: "2025-03-11" },
  { id: "r4", customerName: "정민수", serviceType: "새집증후군", rating: 5, content: "시공 후 유해물질 수치가 확 줄어서 안심이 되었어요.", imageUrl: "", createdAt: "2025-02-20", visible: true, adminReply: "", adminReplyDate: "" },
  { id: "r5", customerName: "최은지", serviceType: "입주 청소", rating: 5, content: "20평대 아파트 반나절 만에 깔끔하게 마무리해 주셨어요.", imageUrl: "", createdAt: "2025-02-15", visible: true, adminReply: "", adminReplyDate: "" },
  { id: "r6", customerName: "한상우", serviceType: "탄성 코트", rating: 4, content: "베란다 바닥 탄성 코트 시공했습니다. 미끄럽지 않고 깔끔해요.", imageUrl: "", createdAt: "2025-02-10", visible: true, adminReply: "", adminReplyDate: "" },
];

const INITIAL_COURSES: AcademyCourse[] = [
  { id: "c1", title: "기초 과정", duration: "4주 (주 2회)", price: "120만원", capacity: 15, description: "청소 업계 입문자를 위한 기초 과정", imageUrl: "", visible: true },
  { id: "c2", title: "전문가 과정", duration: "8주 (주 3회)", price: "280만원", capacity: 15, description: "현장 투입 가능한 전문 시공 기술 심화 학습", imageUrl: "", visible: true },
  { id: "c3", title: "마스터 과정", duration: "12주 (주 3회)", price: "450만원", capacity: 10, description: "독립 사업자·관리자 목표 최상위 과정", imageUrl: "", visible: true },
];

const INITIAL_EVENTS: PointEvent[] = [
  { id: "e1", title: "신규 가입 5,000P 지급", description: "회원 가입 시 5,000 포인트 즉시 적립", startDate: "2025-03-01", endDate: "2025-06-30", bgColor: "#00D4FF", visible: true },
  { id: "e2", title: "봄맞이 2배 적립 이벤트", description: "3~4월 서비스 이용 시 포인트 2배 적립", startDate: "2025-03-01", endDate: "2025-04-30", bgColor: "#0A2540", visible: true },
];

const INITIAL_QUOTES: QuoteInquiry[] = [
  { id: "q1", customerName: "홍길동", phone: "010-1234-5678", serviceType: "줄눈 시공", area: "32평", memo: "욕실 2곳 시공 원합니다", status: "미확인", createdAt: "2025-03-15", contactDate: "", contactMemo: "" },
  { id: "q2", customerName: "김영희", phone: "010-9876-5432", serviceType: "입주 청소", area: "25평", memo: "이사 전 청소 부탁드립니다", status: "확인", createdAt: "2025-03-14", contactDate: "2025-03-14", contactMemo: "3/18 오전 시공 예약 확정" },
  { id: "q3", customerName: "이철수", phone: "010-5555-1234", serviceType: "나노 코팅", area: "40평", memo: "주방 + 욕실 유리", status: "완료", createdAt: "2025-03-12", contactDate: "2025-03-12", contactMemo: "시공 완료, 만족하심" },
  { id: "q4", customerName: "박지민", phone: "010-3333-7777", serviceType: "새집증후군", area: "28평", memo: "신축 아파트 입주 전 시공", status: "미확인", createdAt: "2025-03-15", contactDate: "", contactMemo: "" },
  { id: "q5", customerName: "정수빈", phone: "010-4444-8888", serviceType: "탄성 코트", area: "35평", memo: "베란다 + 복도", status: "확인", createdAt: "2025-03-13", contactDate: "2025-03-13", contactMemo: "견적 안내 완료, 검토 중" },
];

const INITIAL_COMPANY: CompanyInfo = {
  name: "클린마스터",
  ceo: "홍길동",
  businessNumber: "123-45-67890",
  address: "서울시 강남구 테헤란로 123 클린마스터 빌딩 5층",
  phone: "02-1234-5678",
  email: "info@cleanmaster.co.kr",
  stats: [
    { label: "누적 시공 건수", value: "15,000+" },
    { label: "고객 만족도", value: "98%" },
    { label: "업계 경력", value: "12년" },
  ],
};

const INITIAL_POPUPS: PopupItem[] = [
  { id: "p1", title: "봄맞이 할인 이벤트", content: "3월 한 달간 전 서비스 10% 할인!", imageUrl: "", linkUrl: "/quote", startDate: "2025-03-01", endDate: "2025-03-31", position: "center", visible: true, hideToday: true },
];

const INITIAL_POLICY: PointPolicy = {
  text: "서비스 이용 시 결제 금액의 3~5%가 자동으로 포인트로 적립됩니다.\n1포인트 = 1원으로 다음 서비스 이용 시 할인 적용 가능합니다.\n포인트 유효기간: 적립일로부터 1년",
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  Zustand 스토어 생성
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
let toastCounter = 0;

export const useAdminStore = create<AdminState>((set) => ({
  /* ── 초기 데이터 ── */
  hero: INITIAL_HERO,
  services: INITIAL_SERVICES,
  reviews: INITIAL_REVIEWS,
  courses: INITIAL_COURSES,
  events: INITIAL_EVENTS,
  quotes: INITIAL_QUOTES,
  company: INITIAL_COMPANY,
  popups: INITIAL_POPUPS,
  pointPolicy: INITIAL_POLICY,
  toasts: [],

  /* ── 히어로 업데이트 ── */
  updateHero: (data) => set({ hero: data }),

  /* ── 서비스 CRUD ── */
  updateService: (id, data) =>
    set((s) => ({
      services: s.services.map((svc) => (svc.id === id ? { ...svc, ...data } : svc)),
    })),
  toggleServiceVisibility: (id) =>
    set((s) => ({
      services: s.services.map((svc) =>
        svc.id === id ? { ...svc, visible: !svc.visible } : svc
      ),
    })),

  /* ── 후기 CRUD + 관리자 답변 ── */
  addReview: (review) =>
    set((s) => ({
      reviews: [...s.reviews, { ...review, id: `r${Date.now()}` }],
    })),
  updateReview: (id, data) =>
    set((s) => ({
      reviews: s.reviews.map((r) => (r.id === id ? { ...r, ...data } : r)),
    })),
  deleteReview: (id) =>
    set((s) => ({ reviews: s.reviews.filter((r) => r.id !== id) })),
  toggleReviewVisibility: (id) =>
    set((s) => ({
      reviews: s.reviews.map((r) =>
        r.id === id ? { ...r, visible: !r.visible } : r
      ),
    })),
  /** 관리자 답변 작성/수정 */
  setAdminReply: (id, reply) =>
    set((s) => ({
      reviews: s.reviews.map((r) =>
        r.id === id
          ? { ...r, adminReply: reply, adminReplyDate: new Date().toISOString().split("T")[0] }
          : r
      ),
    })),

  /* ── 아카데미 CRUD ── */
  addCourse: (course) =>
    set((s) => ({
      courses: [...s.courses, { ...course, id: `c${Date.now()}` }],
    })),
  updateCourse: (id, data) =>
    set((s) => ({
      courses: s.courses.map((c) => (c.id === id ? { ...c, ...data } : c)),
    })),
  deleteCourse: (id) =>
    set((s) => ({ courses: s.courses.filter((c) => c.id !== id) })),
  toggleCourseVisibility: (id) =>
    set((s) => ({
      courses: s.courses.map((c) =>
        c.id === id ? { ...c, visible: !c.visible } : c
      ),
    })),

  /* ── 이벤트 CRUD ── */
  addEvent: (event) =>
    set((s) => ({ events: [...s.events, { ...event, id: `e${Date.now()}` }] })),
  updateEvent: (id, data) =>
    set((s) => ({
      events: s.events.map((e) => (e.id === id ? { ...e, ...data } : e)),
    })),
  deleteEvent: (id) =>
    set((s) => ({ events: s.events.filter((e) => e.id !== id) })),
  toggleEventVisibility: (id) =>
    set((s) => ({
      events: s.events.map((e) =>
        e.id === id ? { ...e, visible: !e.visible } : e
      ),
    })),

  /* ── 견적 문의 상태 + 연락 이력 ── */
  updateQuoteStatus: (id, status) =>
    set((s) => ({
      quotes: s.quotes.map((q) => (q.id === id ? { ...q, status } : q)),
    })),
  /** 연락 드린 날짜 및 메모 업데이트 */
  updateQuoteContact: (id, contactDate, contactMemo) =>
    set((s) => ({
      quotes: s.quotes.map((q) =>
        q.id === id ? { ...q, contactDate, contactMemo } : q
      ),
    })),

  /* ── 회사 정보 ── */
  updateCompany: (data) =>
    set((s) => ({ company: { ...s.company, ...data } })),

  /* ── 팝업 CRUD ── */
  addPopup: (popup) =>
    set((s) => ({ popups: [...s.popups, { ...popup, id: `p${Date.now()}` }] })),
  updatePopup: (id, data) =>
    set((s) => ({
      popups: s.popups.map((p) => (p.id === id ? { ...p, ...data } : p)),
    })),
  deletePopup: (id) =>
    set((s) => ({ popups: s.popups.filter((p) => p.id !== id) })),
  togglePopupVisibility: (id) =>
    set((s) => ({
      popups: s.popups.map((p) =>
        p.id === id ? { ...p, visible: !p.visible } : p
      ),
    })),

  /* ── 포인트 정책 ── */
  updatePointPolicy: (text) => set({ pointPolicy: { text } }),

  /* ── 토스트 알림 ── */
  addToast: (message, type = "success") => {
    const id = `toast-${++toastCounter}`;
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    // 3초 후 자동 제거
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
