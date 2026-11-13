# Daphne 個人品牌暨 Facebook 廣告課程網站

純 HTML / CSS / JavaScript，可直接部署到 GitHub Pages。

## 1. 建立 Repository 並上傳
1. 登入 GitHub → New repository，名稱例如 `daphne-website`（Public）。
2. 點 **uploading an existing file**，將本資料夾內所有檔案與資料夾（保持結構）拖曳上傳，按 Commit。

## 2. 啟用 GitHub Pages
Settings → Pages → Source 選 **Deploy from a branch** → Branch 選 `main`、資料夾 `/ (root)` → Save。
約 1–2 分鐘後，網址為 `https://你的帳號.github.io/daphne-website/`。

## 3. 替換 Daphne 形象照
將照片放入 `assets/images/`，檔名分別為：
- `daphne-hero.jpg`（首頁主視覺，建議 4:5 直式，約 800×1000）
- `daphne-about.jpg`（關於區塊，同比例）

放入後虛線佔位框會自動被照片取代。若使用其他檔名，請修改 `index.html` 內對應的 `<img src>`，並記得填寫 alt。

## 4. 修改網站文字
直接編輯 `index.html`，每個區塊都有 `<section>` 與清楚的結構。課程時間、地點、費用等資訊，請寫在 `id="course-info"` 的區塊中（已有 TODO 註解）。

## 5. 更新配色
編輯 `css/style.css` 最上方的 `:root` 變數（`--bg`、`--mist`、`--slate`、`--stone`、`--ink`）。

## 6. 補上按鈕超連結
編輯 `js/main.js` 最上方的 `SITE_LINKS`，填入完整網址（含 `https://`）：
```js
const SITE_LINKS = { course: "", registration: "", line: "", facebook: "", instagram: "", contact: "" };
```
未填的按鈕會維持停用狀態，不會跳轉；填入後自動啟用並以新分頁開啟。
站內導覽（#about、#course 等）無須設定。
