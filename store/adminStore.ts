/** store/adminStore.ts — 어드민 CMS 전역 상태 관리 (Zustand + API 연동)
 *
 *  역할:
 *  - 모든 어드민 데이터를 API를 통해 NeonDB에서 로드/저장
 *  - 각 엔티티별 CRUD 액션 (API 호출 → 로컬 상태 업데이트)
 *  - loadAll()로 초기 데이터 로드
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
  adminReply: string;
  adminReplyDate: string;
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
  contactDate: string;
  contactMemo: string;
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

/** 아카데미 수강 신청 */
export interface AcademyInquiry {
  id: string;
  customerName: string;
  phone: string;
  courseTitle: string;
  memo: string;
  status: "미확인" | "확인" | "완료";
  createdAt: string;
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
  academyInquiries: AcademyInquiry[];
  company: CompanyInfo;
  popups: PopupItem[];
  pointPolicy: PointPolicy;
  toasts: Toast[];
  isLoaded: boolean;

  /* 데이터 로드 (API → 로컬 상태) */
  loadAll: () => Promise<void>;

  /* 히어로 액션 */
  updateHero: (data: HeroData) => Promise<void>;

  /* 서비스 액션 */
  updateService: (id: string, data: Partial<ServiceItem>) => Promise<void>;
  toggleServiceVisibility: (id: string) => Promise<void>;

  /* 후기 액션 */
  addReview: (review: Omit<ReviewItem, "id">) => Promise<void>;
  updateReview: (id: string, data: Partial<ReviewItem>) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  toggleReviewVisibility: (id: string) => Promise<void>;
  setAdminReply: (id: string, reply: string) => Promise<void>;

  /* 아카데미 액션 */
  addCourse: (course: Omit<AcademyCourse, "id">) => Promise<void>;
  updateCourse: (id: string, data: Partial<AcademyCourse>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  toggleCourseVisibility: (id: string) => Promise<void>;

  /* 이벤트 액션 */
  addEvent: (event: Omit<PointEvent, "id">) => Promise<void>;
  updateEvent: (id: string, data: Partial<PointEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  toggleEventVisibility: (id: string) => Promise<void>;

  /* 견적 문의 액션 */
  addQuote: (quote: Omit<QuoteInquiry, "id">) => Promise<void>;
  updateQuoteStatus: (id: string, status: QuoteInquiry["status"]) => Promise<void>;
  updateQuoteContact: (id: string, contactDate: string, contactMemo: string) => Promise<void>;

  /* 아카데미 수강 신청 액션 */
  addAcademyInquiry: (inquiry: Omit<AcademyInquiry, "id">) => Promise<void>;
  updateAcademyInquiryStatus: (id: string, status: AcademyInquiry["status"]) => Promise<void>;

  /* 회사 정보 액션 */
  updateCompany: (data: Partial<CompanyInfo>) => Promise<void>;

  /* 팝업 액션 */
  addPopup: (popup: Omit<PopupItem, "id">) => Promise<void>;
  updatePopup: (id: string, data: Partial<PopupItem>) => Promise<void>;
  deletePopup: (id: string) => Promise<void>;
  togglePopupVisibility: (id: string) => Promise<void>;

  /* 포인트 정책 액션 */
  updatePointPolicy: (text: string) => Promise<void>;

  /* 토스트 액션 */
  addToast: (message: string, type?: "success" | "error") => void;
  removeToast: (id: string) => void;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  API 유틸리티
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  기본 초기값 (로딩 전 빈 상태)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const EMPTY_HERO: HeroData = {
  headline: "", subCopy: "", cta1Text: "", cta1Link: "",
  cta2Text: "", cta2Link: "", bgImageUrl: "",
};

const EMPTY_COMPANY: CompanyInfo = {
  name: "", ceo: "", businessNumber: "", address: "",
  phone: "", email: "", stats: [],
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  Zustand 스토어 생성
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
let toastCounter = 0;

export const useAdminStore = create<AdminState>((set, get) => ({
  /* ── 초기 데이터 (빈 상태) ── */
  hero: EMPTY_HERO,
  services: [],
  reviews: [],
  courses: [],
  events: [],
  quotes: [],
  academyInquiries: [],
  company: EMPTY_COMPANY,
  popups: [],
  pointPolicy: { text: "" },
  toasts: [],
  isLoaded: false,

  /* ══════════════════════════════════════════════
   *  전체 데이터 로드 (API → 로컬 상태)
   * ══════════════════════════════════════════════ */
  loadAll: async () => {
    if (get().isLoaded) return;
    try {
      const [hero, services, reviews, courses, events, quotes, academyInquiries, company, popups, policy] =
        await Promise.all([
          api<HeroData>("/api/hero"),
          api<ServiceItem[]>("/api/services"),
          api<ReviewItem[]>("/api/reviews"),
          api<AcademyCourse[]>("/api/academy/courses"),
          api<PointEvent[]>("/api/events"),
          api<QuoteInquiry[]>("/api/quotes"),
          api<AcademyInquiry[]>("/api/academy/inquiries"),
          api<CompanyInfo>("/api/company"),
          api<PopupItem[]>("/api/popups"),
          api<PointPolicy>("/api/policy"),
        ]);
      set({
        hero, services, reviews, courses, events, quotes,
        academyInquiries, company, popups,
        pointPolicy: policy ?? { text: "" },
        isLoaded: true,
      });
    } catch (e) {
      console.error("데이터 로드 실패:", e);
    }
  },

  /* ── 히어로 업데이트 ── */
  updateHero: async (data) => {
    const hero = await api<HeroData>("/api/hero", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    set({ hero });
  },

  /* ── 서비스 CRUD ── */
  updateService: async (id, data) => {
    const updated = await api<ServiceItem>(`/api/services/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    set((s) => ({
      services: s.services.map((svc) => (svc.id === id ? updated : svc)),
    }));
  },
  toggleServiceVisibility: async (id) => {
    const svc = get().services.find((s) => s.id === id);
    if (!svc) return;
    await get().updateService(id, { visible: !svc.visible });
  },

  /* ── 후기 CRUD + 관리자 답변 ── */
  addReview: async (review) => {
    const created = await api<ReviewItem>("/api/reviews", {
      method: "POST",
      body: JSON.stringify(review),
    });
    set((s) => ({ reviews: [created, ...s.reviews] }));
  },
  updateReview: async (id, data) => {
    const updated = await api<ReviewItem>(`/api/reviews/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    set((s) => ({
      reviews: s.reviews.map((r) => (r.id === id ? updated : r)),
    }));
  },
  deleteReview: async (id) => {
    await api(`/api/reviews/${id}`, { method: "DELETE" });
    set((s) => ({ reviews: s.reviews.filter((r) => r.id !== id) }));
  },
  toggleReviewVisibility: async (id) => {
    const r = get().reviews.find((r) => r.id === id);
    if (!r) return;
    await get().updateReview(id, { visible: !r.visible });
  },
  setAdminReply: async (id, reply) => {
    await get().updateReview(id, {
      adminReply: reply,
      adminReplyDate: new Date().toISOString().split("T")[0],
    });
  },

  /* ── 아카데미 CRUD ── */
  addCourse: async (course) => {
    const created = await api<AcademyCourse>("/api/academy/courses", {
      method: "POST",
      body: JSON.stringify(course),
    });
    set((s) => ({ courses: [...s.courses, created] }));
  },
  updateCourse: async (id, data) => {
    const updated = await api<AcademyCourse>(`/api/academy/courses/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    set((s) => ({
      courses: s.courses.map((c) => (c.id === id ? updated : c)),
    }));
  },
  deleteCourse: async (id) => {
    await api(`/api/academy/courses/${id}`, { method: "DELETE" });
    set((s) => ({ courses: s.courses.filter((c) => c.id !== id) }));
  },
  toggleCourseVisibility: async (id) => {
    const c = get().courses.find((c) => c.id === id);
    if (!c) return;
    await get().updateCourse(id, { visible: !c.visible });
  },

  /* ── 이벤트 CRUD ── */
  addEvent: async (event) => {
    const created = await api<PointEvent>("/api/events", {
      method: "POST",
      body: JSON.stringify(event),
    });
    set((s) => ({ events: [created, ...s.events] }));
  },
  updateEvent: async (id, data) => {
    const updated = await api<PointEvent>(`/api/events/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    set((s) => ({
      events: s.events.map((e) => (e.id === id ? updated : e)),
    }));
  },
  deleteEvent: async (id) => {
    await api(`/api/events/${id}`, { method: "DELETE" });
    set((s) => ({ events: s.events.filter((e) => e.id !== id) }));
  },
  toggleEventVisibility: async (id) => {
    const e = get().events.find((e) => e.id === id);
    if (!e) return;
    await get().updateEvent(id, { visible: !e.visible });
  },

  /* ── 견적 문의 상태 + 연락 이력 ── */
  addQuote: async (quote) => {
    const created = await api<QuoteInquiry>("/api/quotes", {
      method: "POST",
      body: JSON.stringify(quote),
    });
    set((s) => ({ quotes: [created, ...s.quotes] }));
  },
  updateQuoteStatus: async (id, status) => {
    const updated = await api<QuoteInquiry>(`/api/quotes/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    set((s) => ({
      quotes: s.quotes.map((q) => (q.id === id ? updated : q)),
    }));
  },
  updateQuoteContact: async (id, contactDate, contactMemo) => {
    const updated = await api<QuoteInquiry>(`/api/quotes/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ contactDate, contactMemo }),
    });
    set((s) => ({
      quotes: s.quotes.map((q) => (q.id === id ? updated : q)),
    }));
  },

  /* ── 아카데미 수강 신청 ── */
  addAcademyInquiry: async (inquiry) => {
    const created = await api<AcademyInquiry>("/api/academy/inquiries", {
      method: "POST",
      body: JSON.stringify(inquiry),
    });
    set((s) => ({ academyInquiries: [created, ...s.academyInquiries] }));
  },
  updateAcademyInquiryStatus: async (id, status) => {
    const updated = await api<AcademyInquiry>(`/api/academy/inquiries/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    set((s) => ({
      academyInquiries: s.academyInquiries.map((a) => (a.id === id ? updated : a)),
    }));
  },

  /* ── 회사 정보 ── */
  updateCompany: async (data) => {
    const updated = await api<CompanyInfo>("/api/company", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    set({ company: updated });
  },

  /* ── 팝업 CRUD ── */
  addPopup: async (popup) => {
    const created = await api<PopupItem>("/api/popups", {
      method: "POST",
      body: JSON.stringify(popup),
    });
    set((s) => ({ popups: [created, ...s.popups] }));
  },
  updatePopup: async (id, data) => {
    const updated = await api<PopupItem>(`/api/popups/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    set((s) => ({
      popups: s.popups.map((p) => (p.id === id ? updated : p)),
    }));
  },
  deletePopup: async (id) => {
    await api(`/api/popups/${id}`, { method: "DELETE" });
    set((s) => ({ popups: s.popups.filter((p) => p.id !== id) }));
  },
  togglePopupVisibility: async (id) => {
    const p = get().popups.find((p) => p.id === id);
    if (!p) return;
    await get().updatePopup(id, { visible: !p.visible });
  },

  /* ── 포인트 정책 ── */
  updatePointPolicy: async (text) => {
    const updated = await api<PointPolicy>("/api/policy", {
      method: "PATCH",
      body: JSON.stringify({ text }),
    });
    set({ pointPolicy: updated });
  },

  /* ── 토스트 알림 (로컬 전용) ── */
  addToast: (message, type = "success") => {
    const id = `toast-${++toastCounter}`;
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
