/** store/authStore.ts — 사용자 인증 전역 상태 관리 (Zustand)
 *
 *  역할:
 *  - 사용자 회원가입 / 로그인 / 로그아웃
 *  - 닉네임 수정, 포인트 적립·사용
 *  - Mock 데이터로 동작 (이후 Firebase 연동 예정)
 */
import { create } from "zustand";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  타입 정의
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/** 포인트 내역 항목 */
export interface PointHistory {
  id: string;
  type: "earn" | "use";
  amount: number;
  description: string;
  date: string;
}

/** 사용자 정보 */
export interface User {
  id: string;
  email: string;
  phone: string;
  nickname: string;
  points: number;
  pointHistory: PointHistory[];
  createdAt: string;
  loginMethod: "email" | "google" | "naver";
}

/** 사용자가 작성한 후기 */
export interface UserReview {
  id: string;
  userId: string;
  serviceType: string;
  rating: number;
  content: string;
  createdAt: string;
}

/** 인증 스토어 상태 + 액션 */
interface AuthState {
  /* ── 상태 ── */
  user: User | null;
  isLoggedIn: boolean;
  registeredUsers: User[];    // Mock: 가입된 유저 목록
  userReviews: UserReview[];  // 사용자 작성 후기 목록

  /* ── 인증 액션 ── */
  register: (data: { email: string; password: string; phone: string; nickname: string }) => boolean;
  login: (email: string, password: string) => boolean;
  socialLogin: (method: "google" | "naver", email: string, nickname: string) => void;
  logout: () => void;

  /* ── 프로필 액션 ── */
  updateNickname: (nickname: string) => void;

  /* ── 포인트 액션 ── */
  addPoints: (amount: number, description: string) => void;
  usePoints: (amount: number, description: string) => boolean;

  /* ── 후기 액션 ── */
  addReview: (review: Omit<UserReview, "id" | "userId" | "createdAt">) => void;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  비밀번호 저장 (Mock — 실제로는 DB + 해싱 필수)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const passwordMap = new Map<string, string>(); // email -> password

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  Zustand 스토어 생성
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoggedIn: false,
  registeredUsers: [],
  userReviews: [],

  /* ── 회원가입 ── */
  register: ({ email, password, phone, nickname }) => {
    const { registeredUsers } = get();

    // 이메일 중복 검사
    if (registeredUsers.some((u) => u.email === email)) {
      return false;
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      phone,
      nickname,
      points: 5000, // 신규 가입 축하 포인트
      pointHistory: [
        {
          id: `pt_${Date.now()}`,
          type: "earn",
          amount: 5000,
          description: "신규 가입 축하 포인트",
          date: new Date().toISOString().split("T")[0],
        },
      ],
      createdAt: new Date().toISOString().split("T")[0],
      loginMethod: "email",
    };

    // Mock 비밀번호 저장
    passwordMap.set(email, password);

    set({
      user: newUser,
      isLoggedIn: true,
      registeredUsers: [...registeredUsers, newUser],
    });

    return true;
  },

  /* ── 로그인 ── */
  login: (email, password) => {
    const { registeredUsers } = get();
    const user = registeredUsers.find((u) => u.email === email);

    if (!user || passwordMap.get(email) !== password) {
      return false;
    }

    set({ user, isLoggedIn: true });
    return true;
  },

  /* ── 소셜 로그인 (Google / Naver) ── */
  socialLogin: (method, email, nickname) => {
    const { registeredUsers } = get();
    let user = registeredUsers.find((u) => u.email === email);

    if (!user) {
      // 소셜 로그인 첫 접속 → 자동 회원가입
      user = {
        id: `user_${Date.now()}`,
        email,
        phone: "",
        nickname,
        points: 5000,
        pointHistory: [
          {
            id: `pt_${Date.now()}`,
            type: "earn",
            amount: 5000,
            description: "신규 가입 축하 포인트",
            date: new Date().toISOString().split("T")[0],
          },
        ],
        createdAt: new Date().toISOString().split("T")[0],
        loginMethod: method,
      };

      set({ registeredUsers: [...registeredUsers, user] });
    }

    set({ user, isLoggedIn: true });
  },

  /* ── 로그아웃 ── */
  logout: () => {
    set({ user: null, isLoggedIn: false });
  },

  /* ── 닉네임 수정 ── */
  updateNickname: (nickname) => {
    const { user, registeredUsers } = get();
    if (!user) return;

    const updatedUser = { ...user, nickname };
    set({
      user: updatedUser,
      registeredUsers: registeredUsers.map((u) =>
        u.id === user.id ? updatedUser : u
      ),
    });
  },

  /* ── 포인트 적립 ── */
  addPoints: (amount, description) => {
    const { user, registeredUsers } = get();
    if (!user) return;

    const entry: PointHistory = {
      id: `pt_${Date.now()}`,
      type: "earn",
      amount,
      description,
      date: new Date().toISOString().split("T")[0],
    };

    const updatedUser = {
      ...user,
      points: user.points + amount,
      pointHistory: [entry, ...user.pointHistory],
    };

    set({
      user: updatedUser,
      registeredUsers: registeredUsers.map((u) =>
        u.id === user.id ? updatedUser : u
      ),
    });
  },

  /* ── 포인트 사용 ── */
  usePoints: (amount, description) => {
    const { user, registeredUsers } = get();
    if (!user || user.points < amount) return false;

    const entry: PointHistory = {
      id: `pt_${Date.now()}`,
      type: "use",
      amount,
      description,
      date: new Date().toISOString().split("T")[0],
    };

    const updatedUser = {
      ...user,
      points: user.points - amount,
      pointHistory: [entry, ...user.pointHistory],
    };

    set({
      user: updatedUser,
      registeredUsers: registeredUsers.map((u) =>
        u.id === user.id ? updatedUser : u
      ),
    });

    return true;
  },

  /* ── 후기 작성 ── */
  addReview: (review) => {
    const { user, userReviews } = get();
    if (!user) return;

    const newReview: UserReview = {
      ...review,
      id: `review_${Date.now()}`,
      userId: user.id,
      createdAt: new Date().toISOString().split("T")[0],
    };

    set({ userReviews: [...userReviews, newReview] });

    // 후기 작성 포인트 적립
    get().addPoints(5000, "후기 작성 포인트 적립");
  },
}));
