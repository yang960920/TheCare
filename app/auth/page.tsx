/** app/auth/page.tsx — 회원가입 / 로그인 페이지
 *
 *  기능:
 *  - 탭 전환: 로그인 / 회원가입
 *  - 이메일 + 비밀번호 로그인
 *  - 소셜 로그인 (Google / Naver)
 *  - 회원가입: 이메일, 비밀번호, 전화번호(SMS 인증), 닉네임
 *  - 가입 시 5,000P 즉시 적립
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";

export default function AuthPage() {
  const router = useRouter();
  const { register, login, socialLogin } = useAuthStore();

  /* ── 탭 상태 ── */
  const [tab, setTab] = useState<"login" | "register">("login");

  /* ── 로그인 폼 ── */
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  /* ── 회원가입 폼 ── */
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPasswordConfirm, setRegPasswordConfirm] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regNickname, setRegNickname] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState(false);

  /* ── SMS 인증 상태 ── */
  const [smsSent, setSmsSent] = useState(false);
  const [smsCode, setSmsCode] = useState("");
  const [smsVerified, setSmsVerified] = useState(false);
  const [mockCode, setMockCode] = useState("");

  /* ── 로그인 처리 ── */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!loginEmail || !loginPassword) {
      setLoginError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    const success = login(loginEmail, loginPassword);
    if (success) {
      router.push("/");
    } else {
      setLoginError("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  /* ── 소셜 로그인 처리 (Mock) ── */
  const handleSocialLogin = (method: "google" | "naver") => {
    const mockEmails: Record<string, string> = {
      google: "user@gmail.com",
      naver: "user@naver.com",
    };
    const mockNicknames: Record<string, string> = {
      google: "구글사용자",
      naver: "네이버사용자",
    };

    socialLogin(method, mockEmails[method], mockNicknames[method]);
    router.push("/");
  };

  /* ── SMS 인증번호 발송 (Mock) ── */
  const handleSendSms = () => {
    if (!regPhone || regPhone.length < 10) {
      setRegError("전화번호를 정확히 입력해주세요.");
      return;
    }

    // Mock: 랜덤 4자리 인증번호 생성
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setMockCode(code);
    setSmsSent(true);
    setRegError("");

    // 실제 서비스에서는 Firebase Phone Auth 사용
    // 개발용: alert로 인증번호 표시
    alert(`[개발용] 인증번호: ${code}`);
  };

  /* ── SMS 인증번호 확인 ── */
  const handleVerifySms = () => {
    if (smsCode === mockCode) {
      setSmsVerified(true);
      setRegError("");
    } else {
      setRegError("인증번호가 올바르지 않습니다.");
    }
  };

  /* ── 전화번호 입력 포맷팅 ── */
  const handlePhoneChange = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, "");
    if (numbers.length <= 11) {
      // 010-1234-5678 형태로 자동 하이픈
      if (numbers.length <= 3) {
        setRegPhone(numbers);
      } else if (numbers.length <= 7) {
        setRegPhone(`${numbers.slice(0, 3)}-${numbers.slice(3)}`);
      } else {
        setRegPhone(
          `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`
        );
      }
    }
  };

  /* ── 회원가입 처리 ── */
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (!regEmail || !regPassword || !regPasswordConfirm || !regPhone || !regNickname) {
      setRegError("모든 항목을 입력해주세요.");
      return;
    }

    if (regPassword !== regPasswordConfirm) {
      setRegError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (regPassword.length < 6) {
      setRegError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    if (!smsVerified) {
      setRegError("전화번호 인증을 완료해주세요.");
      return;
    }

    const success = register({
      email: regEmail,
      password: regPassword,
      phone: regPhone,
      nickname: regNickname,
    });

    if (success) {
      setRegSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } else {
      setRegError("이미 가입된 이메일입니다.");
    }
  };

  return (
    <>
      {/* ── 히어로 배너 ── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-navy overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-cyan/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-cyan font-semibold text-sm tracking-wider uppercase">
              Account
            </span>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-white mt-3 mb-4">
              {tab === "login" ? "로그인" : "회원가입"}
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-xl">
              더케어의 다양한 서비스와 포인트 혜택을 누려보세요
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 폼 영역 ── */}
      <section className="section-padding bg-cream">
        <div className="max-w-md mx-auto px-4">
          {/* ── 탭 전환 ── */}
          <div className="flex bg-white rounded-xl p-1 mb-8 shadow-sm">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setLoginError("");
                  setRegError("");
                }}
                className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${
                  tab === t
                    ? "bg-navy text-white shadow-md"
                    : "text-navy/50 hover:text-navy"
                }`}
              >
                {t === "login" ? "로그인" : "회원가입"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === "login" ? (
              /* ════════════════════════════
               *  로그인 폼
               * ════════════════════════════ */
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-5">
                  {/* 이메일 */}
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">이메일</label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="example@email.com"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan/30 focus:border-cyan transition-all"
                    />
                  </div>

                  {/* 비밀번호 */}
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">비밀번호</label>
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="비밀번호를 입력하세요"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan/30 focus:border-cyan transition-all"
                    />
                  </div>

                  {/* 오류 메시지 */}
                  {loginError && (
                    <p className="text-red-500 text-sm text-center">{loginError}</p>
                  )}

                  {/* 로그인 버튼 */}
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-cyan to-cyan-dark text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan/25 transition-all duration-300"
                  >
                    로그인
                  </button>

                  {/* 구분선 */}
                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white px-3 text-navy/40">소셜 로그인</span>
                    </div>
                  </div>

                  {/* 소셜 로그인 버튼 */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Google */}
                    <button
                      type="button"
                      onClick={() => handleSocialLogin("google")}
                      className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium text-navy/70"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Google
                    </button>

                    {/* Naver */}
                    <button
                      type="button"
                      onClick={() => handleSocialLogin("naver")}
                      className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-[#03C75A]/5 transition-colors text-sm font-medium text-navy/70"
                    >
                      <div className="w-5 h-5 bg-[#03C75A] rounded-sm flex items-center justify-center">
                        <span className="text-white text-xs font-black">N</span>
                      </div>
                      Naver
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              /* ════════════════════════════
               *  회원가입 폼
               * ════════════════════════════ */
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* 가입 완료 메시지 */}
                {regSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl shadow-sm p-8 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-cyan/10 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-display font-bold text-xl text-navy mb-2">
                      가입이 완료되었습니다! 🎉
                    </h3>
                    <p className="text-navy/60 text-sm mb-4">
                      축하 포인트 <span className="text-cyan font-bold">5,000P</span>가 적립되었습니다.
                    </p>
                    <p className="text-navy/40 text-xs">잠시 후 메인 페이지로 이동합니다...</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleRegister} className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-5">
                    {/* 이메일 */}
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">이메일 *</label>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="example@email.com"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan/30 focus:border-cyan transition-all"
                      />
                    </div>

                    {/* 비밀번호 */}
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">비밀번호 *</label>
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="최소 6자 이상"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan/30 focus:border-cyan transition-all"
                      />
                    </div>

                    {/* 비밀번호 확인 */}
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">비밀번호 확인 *</label>
                      <input
                        type="password"
                        value={regPasswordConfirm}
                        onChange={(e) => setRegPasswordConfirm(e.target.value)}
                        placeholder="비밀번호를 다시 입력하세요"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan/30 focus:border-cyan transition-all"
                      />
                      {regPassword && regPasswordConfirm && regPassword !== regPasswordConfirm && (
                        <p className="text-red-500 text-xs mt-1">비밀번호가 일치하지 않습니다.</p>
                      )}
                    </div>

                    {/* 전화번호 + SMS 인증 */}
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">전화번호 * (SMS 인증)</label>
                      <div className="flex gap-2">
                        <input
                          type="tel"
                          value={regPhone}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          placeholder="010-0000-0000"
                          disabled={smsVerified}
                          className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan/30 focus:border-cyan transition-all disabled:bg-slate-50 disabled:text-navy/40"
                        />
                        <button
                          type="button"
                          onClick={handleSendSms}
                          disabled={smsVerified}
                          className={`px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                            smsVerified
                              ? "bg-green-100 text-green-600 cursor-default"
                              : "bg-navy text-white hover:bg-navy-light"
                          }`}
                        >
                          {smsVerified ? "인증완료" : smsSent ? "재발송" : "인증요청"}
                        </button>
                      </div>

                      {/* 인증번호 입력 */}
                      {smsSent && !smsVerified && (
                        <div className="flex gap-2 mt-2">
                          <input
                            type="text"
                            value={smsCode}
                            onChange={(e) => setSmsCode(e.target.value.replace(/[^0-9]/g, ""))}
                            placeholder="인증번호 4자리"
                            maxLength={4}
                            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan/30 focus:border-cyan transition-all"
                          />
                          <button
                            type="button"
                            onClick={handleVerifySms}
                            className="px-4 py-3 bg-cyan text-white rounded-xl text-sm font-semibold hover:bg-cyan-dark transition-colors"
                          >
                            확인
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 닉네임 */}
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">닉네임 *</label>
                      <input
                        type="text"
                        value={regNickname}
                        onChange={(e) => setRegNickname(e.target.value)}
                        placeholder="사용할 닉네임을 입력하세요"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan/30 focus:border-cyan transition-all"
                      />
                    </div>

                    {/* 가입 혜택 안내 */}
                    <div className="bg-cyan/5 border border-cyan/15 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-sm">
                        <svg className="w-5 h-5 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                        <span className="text-navy/70">
                          회원 가입 시 <span className="text-cyan font-bold">5,000P</span> 즉시 적립!
                        </span>
                      </div>
                    </div>

                    {/* 오류 메시지 */}
                    {regError && (
                      <p className="text-red-500 text-sm text-center">{regError}</p>
                    )}

                    {/* 가입 버튼 */}
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-gradient-to-r from-cyan to-cyan-dark text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan/25 transition-all duration-300"
                    >
                      가입하기
                    </button>

                    {/* 소셜 로그인 안내 */}
                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-3 text-navy/40">간편 가입</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleSocialLogin("google")}
                        className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium text-navy/70"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSocialLogin("naver")}
                        className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-[#03C75A]/5 transition-colors text-sm font-medium text-navy/70"
                      >
                        <div className="w-5 h-5 bg-[#03C75A] rounded-sm flex items-center justify-center">
                          <span className="text-white text-xs font-black">N</span>
                        </div>
                        Naver
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
