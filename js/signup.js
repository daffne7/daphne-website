// ===== 報名頁設定（只需要改這裡）=====
const SIGNUP_CONFIG = {
  // Google Apps Script 網頁應用程式網址（寫入試算表並寄通知信）
  appsScriptUrl: "https://script.google.com/macros/s/AKfycbyul-WciUjGgyzGxU_-RwagRxiMxK0v1JYPoo1QNnqj95rRNfW9meq8V-Gn__bEyM_3/exec",
  // 官方 LINE ID
  lineId: "@mskon",
  // 備用日期：平常以 Google 試算表「課程日期」分頁為準；連不上試算表時才使用這份
  courseDates: [
    "2026/12/05（六）14:00–17:00",
    "2026/12/06（日）14:00–17:00"
  ]
};

const $ = id => document.getElementById(id);
const form = $("regForm"), dateSel = $("date"), indSel = $("industry"), indOther = $("industryOther");

function initDates() {
  const ds = SIGNUP_CONFIG.courseDates;
  dateSel.innerHTML = "";
  if (!ds.length) {
    dateSel.add(new Option("課程日期即將公布", ""));
    dateSel.disabled = true;
    $("submitBtn").disabled = true;
    $("formNote").textContent = "目前尚未開放報名，日期公布後即可填寫。";
    return;
  }
  dateSel.disabled = false; $("submitBtn").disabled = false; $("formNote").textContent = "";
  dateSel.add(new Option("請選擇課程日期", ""));
  ds.forEach(d => dateSel.add(new Option(d, d)));
}
initDates();

// 從 Google 試算表「課程日期」分頁讀取最新日期（失敗時沿用上面的備用日期）
async function loadDates() {
  const url = SIGNUP_CONFIG.appsScriptUrl;
  if (!url) return;
  try {
    const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch(url + "?action=dates&t=" + Date.now(), { cache: "no-store", signal: ctrl.signal });
    clearTimeout(t);
    const data = await res.json();
    if (!data.ok || !Array.isArray(data.dates)) return;
    const cur = dateSel.value;
    SIGNUP_CONFIG.courseDates = data.dates;
    initDates();
    if (data.dates.includes(cur)) dateSel.value = cur;
  } catch (e) { console.warn("無法讀取課程日期，使用備用日期", e); }
}
loadDates();

indSel.addEventListener("change", () => { indOther.hidden = indSel.value !== "其他"; });

const clean = s => s.trim().replace(/\s+/g, " ");
function collect() {
  const ind = indSel.value === "其他" ? "其他：" + clean(indOther.value) : indSel.value;
  return { date: dateSel.value, name: clean($("name").value), phone: $("phone").value.replace(/[\s-]/g, ""),
           lineId: clean($("lineId").value), title: clean($("title").value), industry: ind };
}
function validate(d) {
  const e = {};
  if (!d.date) e.date = "請選擇課程日期";
  if (!d.name) e.name = "請填寫姓名";
  if (!/^0\d{8,9}$/.test(d.phone)) e.phone = "請填寫正確的電話，例如 0912345678";
  if (!d.lineId) e.lineId = "請填寫 LINE ID";
  if (!d.title) e.title = "請填寫現階段職務名稱";
  if (!indSel.value) e.industry = "請選擇所在產業類別";
  else if (indSel.value === "其他" && d.industry === "其他：") e.industry = "請填寫產業類別";
  return e;
}
function buildMessage(d) {
  return ["【Facebook 廣告實操課程報名】", "課程日期：" + d.date, "姓名：" + d.name, "電話：" + d.phone,
          "LINE ID：" + d.lineId, "現階段職務：" + d.title, "所在產業：" + d.industry].join("\n");
}
async function sendToSheet(d) {
  const url = SIGNUP_CONFIG.appsScriptUrl;
  if (!url) { console.warn("尚未設定 appsScriptUrl，資料不會寫入 Google 試算表"); return; }
  const req = fetch(url, { method: "POST", mode: "no-cors", keepalive: true,
    headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(d) }).catch(() => {});
  await Promise.race([req, new Promise(r => setTimeout(r, 4000))]);
}

form.addEventListener("submit", async ev => {
  ev.preventDefault();
  if (form.elements.website.value) return; // 防機器人
  const d = collect(), errs = validate(d);
  ["date", "name", "phone", "lineId", "title", "industry"].forEach(k => {
    $("err-" + k).textContent = errs[k] || "";
    const f = $(k); if (f) f.setAttribute("aria-invalid", errs[k] ? "true" : "false");
  });
  const first = Object.keys(errs)[0];
  if (first) { $(first).focus(); return; }
  const btn = $("submitBtn"); btn.disabled = true; btn.textContent = "送出中…";
  await sendToSheet(d);
  const msg = buildMessage(d);
  const lineUrl = "https://line.me/R/oaMessage/" + encodeURIComponent(SIGNUP_CONFIG.lineId) + "/?" + encodeURIComponent(msg);
  $("msgBox").value = msg; $("lineBtn").href = lineUrl;
  form.hidden = true; $("done").hidden = false; $("done").scrollIntoView({ block: "center" });
  setTimeout(() => { window.location.href = lineUrl; }, 400);
});

$("copyBtn").addEventListener("click", async () => {
  const box = $("msgBox"); box.select();
  try { await navigator.clipboard.writeText(box.value); } catch (e) { document.execCommand("copy"); }
  $("copyBtn").textContent = "已複製";
});
