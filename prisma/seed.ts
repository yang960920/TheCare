/** prisma/seed.ts — 초기 데이터 시딩 스크립트
 *
 *  실행: npx prisma db seed
 *  역할: 현재 adminStore.ts의 mock 데이터를 DB에 삽입
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 시딩 시작...");

  // ── 히어로 섹션 ──
  await prisma.heroSection.upsert({
    where: { id: "hero_main" },
    update: {},
    create: {
      id: "hero_main",
      headline: "깨끗한 공간, 건강한 생활의 시작",
      subCopy: "줄눈 시공부터 입주 청소, 나노 코팅까지.\n더케어가 완벽한 클리닝을 약속합니다.",
      cta1Text: "무료 견적 받기",
      cta1Link: "/quote",
      cta2Text: "서비스 둘러보기",
      cta2Link: "/about",
      bgImageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&q=80",
    },
  });

  // ── 서비스 항목 ──
  const services = [
    { name: "줄눈 시공", summary: "타일 줄눈 전문 시공", description: "욕실, 주방, 베란다 타일 줄눈을 전문 장비로 깔끔하게 시공합니다.", order: 1 },
    { name: "입주 청소", summary: "신축·이사 전후 전문 클리닝", description: "신축·이사 전후 전문 입주 청소 서비스입니다.", order: 2 },
    { name: "탄성 코트", summary: "바닥 보호 및 미끄럼 방지", description: "바닥재 보호와 미끄럼 방지를 위한 탄성 코트 시공입니다.", order: 3 },
    { name: "나노 코팅", summary: "오염 방지 나노 코팅", description: "주방 상판, 욕실 유리 등에 나노 코팅을 적용합니다.", order: 4 },
    { name: "새집증후군 제거", summary: "유해물질 측정 및 제거", description: "포름알데히드, VOC 등 유해물질 제거 시공입니다.", order: 5 },
  ];

  for (const svc of services) {
    const existing = await prisma.service.findFirst({ where: { name: svc.name } });
    if (!existing) {
      await prisma.service.create({ data: svc });
    }
  }

  // ── 고객 후기 ──
  const reviews = [
    { customerName: "김서영", serviceType: "입주 청소", rating: 5, content: "이사 전 입주 청소를 맡겼는데, 정말 새 집처럼 깨끗해졌어요.", adminReply: "감사합니다! 다음에도 만족스러운 서비스를 제공하겠습니다.", adminReplyDate: "2025-03-02" },
    { customerName: "박준혁", serviceType: "줄눈 시공", rating: 5, content: "화장실 줄눈이 새것처럼 변했습니다. 가격도 합리적이었어요." },
    { customerName: "이미경", serviceType: "나노 코팅", rating: 4, content: "주방 상판에 나노 코팅을 했는데 물때가 안 끼고 관리가 편해졌어요.", adminReply: "좋은 후기 감사드립니다. 나노 코팅은 평균 3년간 효과가 유지됩니다!", adminReplyDate: "2025-03-11" },
    { customerName: "정민수", serviceType: "새집증후군", rating: 5, content: "시공 후 유해물질 수치가 확 줄어서 안심이 되었어요." },
    { customerName: "최은지", serviceType: "입주 청소", rating: 5, content: "20평대 아파트 반나절 만에 깔끔하게 마무리해 주셨어요." },
    { customerName: "한상우", serviceType: "탄성 코트", rating: 4, content: "베란다 바닥 탄성 코트 시공했습니다. 미끄럽지 않고 깔끔해요." },
  ];

  const reviewCount = await prisma.review.count();
  if (reviewCount === 0) {
    for (const r of reviews) {
      await prisma.review.create({ data: r });
    }
  }

  // ── 아카데미 과정 ──
  const courses = [
    { title: "기초 과정", duration: "4주 (주 2회)", price: "120만원", capacity: 15, description: "청소 업계 입문자를 위한 기초 과정" },
    { title: "전문가 과정", duration: "8주 (주 3회)", price: "280만원", capacity: 15, description: "현장 투입 가능한 전문 시공 기술 심화 학습" },
    { title: "마스터 과정", duration: "12주 (주 3회)", price: "450만원", capacity: 10, description: "독립 사업자·관리자 목표 최상위 과정" },
  ];

  const courseCount = await prisma.academyCourse.count();
  if (courseCount === 0) {
    for (const c of courses) {
      await prisma.academyCourse.create({ data: c });
    }
  }

  // ── 포인트 이벤트 ──
  const events = [
    { title: "신규 가입 5,000P 지급", description: "회원 가입 시 5,000 포인트 즉시 적립", startDate: "2025-03-01", endDate: "2025-06-30", bgColor: "#00D4FF" },
    { title: "봄맞이 2배 적립 이벤트", description: "3~4월 서비스 이용 시 포인트 2배 적립", startDate: "2025-03-01", endDate: "2025-04-30", bgColor: "#0A2540" },
  ];

  const eventCount = await prisma.pointEvent.count();
  if (eventCount === 0) {
    for (const e of events) {
      await prisma.pointEvent.create({ data: e });
    }
  }

  // ── 견적 문의 (샘플) ──
  const quotes = [
    { customerName: "홍길동", phone: "010-1234-5678", serviceType: "줄눈 시공", area: "32평", memo: "욕실 2곳 시공 원합니다", status: "미확인" },
    { customerName: "김영희", phone: "010-9876-5432", serviceType: "입주 청소", area: "25평", memo: "이사 전 청소 부탁드립니다", status: "확인", contactDate: "2025-03-14", contactMemo: "3/18 오전 시공 예약 확정" },
  ];

  const quoteCount = await prisma.quoteInquiry.count();
  if (quoteCount === 0) {
    for (const q of quotes) {
      await prisma.quoteInquiry.create({ data: q });
    }
  }

  // ── 회사 정보 ──
  await prisma.companyInfo.upsert({
    where: { id: "company_main" },
    update: {},
    create: {
      id: "company_main",
      name: "더케어",
      ceo: "문성민",
      businessNumber: "282-55-00733",
      address: "경기도 양주시 화합로1710번길 76, 4층 공장435호(옥정동, 슈프림더브릭스타워)",
      phone: "031-0000-0000",
      email: "iumwebstudio@gmail.com",
    },
  });

  // ── 회사 통계 ──
  const statCount = await prisma.companyStat.count();
  if (statCount === 0) {
    await prisma.companyStat.createMany({
      data: [
        { label: "누적 시공 건수", value: "15,000+", order: 1 },
        { label: "고객 만족도", value: "98%", order: 2 },
        { label: "업계 경력", value: "3년+", order: 3 },
      ],
    });
  }

  // ── 팝업 공지 ──
  const popupCount = await prisma.popup.count();
  if (popupCount === 0) {
    await prisma.popup.create({
      data: {
        title: "봄맞이 할인 이벤트",
        content: "3월 한 달간 전 서비스 10% 할인!",
        linkUrl: "/quote",
        startDate: "2025-03-01",
        endDate: "2025-03-31",
        position: "center",
      },
    });
  }

  // ── 포인트 정책 ──
  await prisma.pointPolicy.upsert({
    where: { id: "policy_main" },
    update: {},
    create: {
      id: "policy_main",
      text: "서비스 이용 시 결제 금액의 3~5%가 자동으로 포인트로 적립됩니다.\n1포인트 = 1원으로 다음 서비스 이용 시 할인 적용 가능합니다.\n포인트 유효기간: 적립일로부터 1년",
    },
  });

  console.log("✅ 시딩 완료!");
}

main()
  .catch((e) => {
    console.error("❌ 시딩 실패:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
