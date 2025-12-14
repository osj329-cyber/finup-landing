// script.js

// ===== 다크모드 토글 =====
const THEME_KEY = "finup-theme";

function applyTheme(theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);

  const toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.textContent = theme === "dark" ? "☀️" : "🌙";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // 저장된 테마 불러오기
  const saved = localStorage.getItem(THEME_KEY);
  const initial = saved === "dark" || saved === "light" ? saved : "dark";
  applyTheme(initial);

  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }

  // ===== 현재 연도 표시 =====
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ===== 부드러운 스크롤 (헤더 높이 보정) =====
  window.scrollToSection = function (id) {
    const target = document.getElementById(id);
    if (!target) return;
    const header = document.getElementById("site-header");
    const headerHeight = header ? header.offsetHeight : 0;
    const rect = target.getBoundingClientRect();
    const offset = rect.top + window.scrollY - headerHeight - 8;
    window.scrollTo({ top: offset, behavior: "smooth" });
  };

  // ===== 모바일 메뉴 토글 =====
  const toggleBtn = document.getElementById("nav-toggle");
  const mobileMenu = document.getElementById("nav-menu-mobile");
  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("open");
    });
  }

  // ===== 헤더 스크롤 그림자 =====
  const header = document.getElementById("site-header");
  function handleScroll() {
    if (!header) return;
    if (window.scrollY > 10) {
      header.classList.add("header-scrolled");
    } else {
      header.classList.remove("header-scrolled");
    }
  }
  window.addEventListener("scroll", handleScroll);
  handleScroll();

  // ===== 섹션 리빌 애니메이션 =====
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  // ===== 베타 폼 데모 제출 =====
  window.handleFakeSubmit = function (e) {
    e.preventDefault();
    alert(
      "지금은 데모 폼이라 실제로 저장되지는 않지만,\n실 서비스에서는 이 자리에서 베타 신청이 접수될 예정입니다 🙂"
    );
  };
});

// 모바일 메뉴 클릭 시 자동 닫기
document.querySelectorAll("#nav-menu-mobile a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("nav-menu-mobile")?.classList.remove("open");
  });
});