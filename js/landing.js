import { navigate } from "./app.js";
import { t } from "./i18n.js";

export function renderLanding(app) {
app.innerHTML = `
  <section class="page landing-page">
    <div class="content-box-landing">
      <h1>${t("title")}</h1>

      <div class="landing-description-row">
        <p>${t("description")}</p>
        <img 
          src="${window.BASE_PATH}images/img-landing.png" 
          alt="Landing illustration"
          class="landing-image"
        />
      </div>
    </div>

    <div class="buttons">
      <button id="download-btn" class="action-btn">${t("download")}</button>
      <button id="start-btn" class="action-btn">${t("start")}</button>
    </div>
  </section>
`;

  const downloadBtn = app.querySelector("#download-btn");
  const startBtn = app.querySelector("#start-btn");

  downloadBtn.onclick = () => navigate("download");
  startBtn.onclick = () => navigate("rules");
}