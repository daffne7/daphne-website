// TODO: 後續補上正式連結（填入完整網址，例如 "https://..."；留空則按鈕維持停用狀態）
const SITE_LINKS = {
  course: "",
  registration: "signup.html", // 站內報名頁
  line: "https://line.me/R/ti/p/%40mskon", // LINE 官方帳號 @mskon
  facebook: "https://www.facebook.com/profile.php?id=61563323977308",
  instagram: "",
  contact: "https://line.me/R/ti/p/%40mskon" // 聯絡合作 → LINE 官方帳號
};

// 套用連結：有網址 → 啟用；無網址 → 停用且不跳轉
document.querySelectorAll("[data-link]").forEach(el => {
  const url = SITE_LINKS[el.dataset.link];
  if (url) {
    el.href = url;
    if (/^https?:/.test(url)) { el.target = "_blank"; el.rel = "noopener noreferrer"; } // 站內頁面同分頁開啟
    if (el.dataset.link === "registration") document.querySelectorAll("[data-note]").forEach(n => (n.hidden = true));
  } else {
    if (el.hasAttribute("data-keep")) { // 保留按鈕外觀，但不可點擊
      el.classList.add("is-pending");
      el.setAttribute("aria-disabled", "true");
      el.setAttribute("role", "link");
      el.addEventListener("click", e => e.preventDefault());
      return;
    }
    if (!el.dataset.soon) { el.hidden = true; return; } // 沒有網址且無預告文字 → 先隱藏
    el.textContent = el.dataset.soon;
    el.classList.add("is-disabled");
    el.setAttribute("aria-disabled", "true");
    el.setAttribute("role", "link");
    el.title = "即將開放";
    el.addEventListener("click", e => e.preventDefault());
  }
});

// 手機選單
const btn = document.querySelector(".menu-btn"), nav = document.getElementById("nav");
btn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  btn.setAttribute("aria-expanded", open);
});
nav.addEventListener("click", e => {
  if (e.target.tagName === "A") { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
});

// 痛點互動卡片
document.querySelectorAll(".pain").forEach(p =>
  p.addEventListener("click", () => p.setAttribute("aria-pressed", p.getAttribute("aria-pressed") !== "true"))
);

// 淡入與導覽列目前區塊提示
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: .12 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  const links = [...document.querySelectorAll("nav a[href^='#']")];
  const so = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  links.forEach(a => { const s = document.querySelector(a.getAttribute("href")); if (s) so.observe(s); });
} else {
  document.querySelectorAll(".reveal").forEach(el => el.classList.add("in"));
}

// 標題斷行：在「，」「；」後才換行，避免單字孤零零掉到下一行
document.querySelectorAll("h1,h2,.quote,.sub,.closing,.lead,.strong").forEach(el => {
  if (el.children.length) return;
  const parts = el.textContent.split(/(?<=[，；])/);
  if (parts.length < 2) return;
  el.textContent = "";
  parts.forEach(t => { const s = document.createElement("span"); s.className = "seg"; s.textContent = t; el.appendChild(s); });
});
