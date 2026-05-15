import { timerState } from "./app.js";

export function createInfoOverlay(app, { t, title, title2, leftText, rightText }) {
  const overlay = document.createElement("div");
  overlay.className = "overlay hidden";
  overlay.id = "info-overlay";

  overlay.innerHTML = `
    <div class="overlay-content-info">
      <div class="info-columns">

        <div class="info-left">
          <h4 class="info-title">${title}</h4>
          <p>${leftText}</p>
        </div>

        <div class="info-right">
          <h4 class="info-title">${title2}</h4>
          <p>${rightText}</p>
        </div>

      </div>

      <button id="close-info" class="action-btn">Close</button>
    </div>
  `;

  app.appendChild(overlay);

  const closeBtn = overlay.querySelector("#close-info");

  function open() {
    overlay.classList.remove("hidden");
  }

  function close() {
    overlay.classList.add("hidden");
  }

  closeBtn.onclick = close;

  // outside click close
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      close();
    }
  });

  // ESC key close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.classList.contains("hidden")) {
      close();
    }
  });

  function update(paused) {
    overlay.querySelectorAll("button").forEach((el) => {
      el.disabled = paused;
    });
  }

  return { open, close, update };
}