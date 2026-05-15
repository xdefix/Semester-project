import { navigate, goBack } from "./app.js";
import { t } from "./i18n.js";

export function renderRules(app) {
  app.innerHTML = `
    <section class="page landing-page">
     <button id="back-btn" class="top-back-btn">${t("back")}</button>

      <!-- RULES CONTENT -->
      <div class="content-box2">
        <h2>${t("rules_title")}</h2>

        <ul class="rules-list">
          <li>${t("rule_time_limit")}</li>
          <li>${t("rule_clues")}</li>
          <li>${t("rule_diary")}</li>
          <li>${t("rule_settings")}</li>
        </ul>
      </div>

      <!-- CONTINUE -->
      <div class="buttons">
        <button id="continue-btn" class="action-btn">${t("continue")}</button>
      </div>

    </section>
  `;

  const continueBtn = app.querySelector("#continue-btn");
  const backBtn = app.querySelector("#back-btn");

  continueBtn.onclick = () => navigate("intro");
  backBtn.onclick = () => goBack();
}