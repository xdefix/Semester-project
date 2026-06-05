import { goBack } from "./app.js";
import { t } from "./i18n.js";

export function renderDownload(app) {
  app.innerHTML = `
    <section class="page landing-page">
     <button id="back-btn" class="top-back-btn">${t("back")}</button>
      <div class="content-box2">
        <p>${t("download_info")}</p>
        <p>${t("download_info2")}</p>
      </div>

      <div class="buttons" >
        <a href="${window.BASE_PATH}files/Setup_Guide.pdf" download  >
         <button class="action-btn"> ${t("download")} </button>
        </a>

      </div>
    </section>
  `;

  const backBtn = app.querySelector("#back-btn");
  backBtn.onclick = () => goBack();
}