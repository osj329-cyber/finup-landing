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


  // ===== 카드뉴스 슬라이더 =====
  (function initNewsSlider() {
    const root = document.querySelector("[data-news-slider]");
    if (!root) return;

    const viewport = root.querySelector("[data-news-viewport]");
    const track = root.querySelector("[data-news-track]");
    const btnPrev = root.querySelector("[data-news-prev]");
    const btnNext = root.querySelector("[data-news-next]");
    const dotsWrap = document.querySelector("[data-news-dots]");

    if (!viewport || !track || !btnPrev || !btnNext || !dotsWrap) return;

    const slides = Array.from(track.querySelectorAll(".news-slide"));

    function getSlideStep() {
      const first = slides[0];
      if (!first) return viewport.clientWidth;
      const rect = first.getBoundingClientRect();
      // gap 포함 (track gap)
      const styles = window.getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
      return rect.width + gap;
    }

    function getPerView() {
      const step = getSlideStep();
      if (!step) return 1;
      return Math.max(1, Math.round(viewport.clientWidth / step));
    }

    function getPageCount() {
      const perView = getPerView();
      return Math.max(1, Math.ceil(slides.length / perView));
    }

    function getCurrentPage() {
      const step = getSlideStep();
      if (!step) return 0;
      return Math.round(viewport.scrollLeft / (step * getPerView()));
    }

    function scrollToPage(pageIndex) {
      const perView = getPerView();
      const step = getSlideStep();
      const target = pageIndex * perView * step;
      viewport.scrollTo({ left: target, behavior: "smooth" });
    }

    function rebuildDots() {
      dotsWrap.innerHTML = "";
      const count = getPageCount();
      for (let i = 0; i < count; i++) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "news-dot";
        b.setAttribute("aria-label", `카드뉴스 ${i + 1}번째 페이지로 이동`);
        b.addEventListener("click", () => scrollToPage(i));
        dotsWrap.appendChild(b);
      }
      updateUI();
    }

    function updateUI() {
      const page = getCurrentPage();
      const count = getPageCount();
      const dots = Array.from(dotsWrap.querySelectorAll(".news-dot"));
      dots.forEach((d, i) => d.classList.toggle("active", i === page));

      btnPrev.disabled = page <= 0;
      btnNext.disabled = page >= count - 1;
    }

    btnPrev.addEventListener("click", () => {
      const page = getCurrentPage();
      scrollToPage(Math.max(0, page - 1));
    });

    btnNext.addEventListener("click", () => {
      const page = getCurrentPage();
      scrollToPage(Math.min(getPageCount() - 1, page + 1));
    });

    // 키보드 접근성(←/→)
    viewport.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") btnPrev.click();
      if (e.key === "ArrowRight") btnNext.click();
    });

    // 스크롤 중 UI 갱신 (가볍게 throttling)
    let ticking = false;
    viewport.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        updateUI();
        ticking = false;
      });
    });

    window.addEventListener("resize", rebuildDots);

    // 초기화
    rebuildDots();
  })();

});
