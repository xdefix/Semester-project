import { timerState } from "./app.js";

export function createInfoOverlay(app, { t, pages = [] }) {
  let spreadIndex = 0;

  const overlay = document.createElement("div");
  overlay.className = "overlay hidden";
  overlay.id = "info-overlay";

  overlay.innerHTML = `
    <div class="overlay-content-info">

      <div class="info-columns">

        <div class="info-left info-page-container">

          <h4 class="info-title info-left-title"></h4>

          <p class="info-page-text info-left-text"></p>

          <button
            class="info-page-arrow info-page-arrow-left"
            type="button"
            aria-label="Previous pages"
          >
            <img
              src="${window.BASE_PATH}images/page-arrow-l.png"
              alt="Previous"
            />
          </button>

        </div>

        <div class="info-right info-page-container">

          <h4 class="info-title info-right-title"></h4>

          <p class="info-page-text info-right-text"></p>

          <button
            class="info-page-arrow info-page-arrow-right"
            type="button"
            aria-label="Next pages"
          >
            <img
              src="${window.BASE_PATH}images/page-arrow-r.png"
              alt="Next"
            />
          </button>

        </div>

      </div>

      <button id="close-info" class="action-btn">
        ${t ? t("close") : "Close"}
      </button>

    </div>
  `;

  app.appendChild(overlay);

  const closeBtn = overlay.querySelector("#close-info");

  const leftTitleEl = overlay.querySelector(".info-left-title");
  const rightTitleEl = overlay.querySelector(".info-right-title");

  const leftTextEl = overlay.querySelector(".info-left-text");
  const rightTextEl = overlay.querySelector(".info-right-text");

  const leftArrow = overlay.querySelector(".info-page-arrow-left");
  const rightArrow = overlay.querySelector(".info-page-arrow-right");

  function refreshPages() {
    if (!pages.length) return;

    const current = pages[spreadIndex];

    leftTitleEl.textContent = current.title || "";
    rightTitleEl.textContent = current.title2 || "";

    leftTextEl.innerHTML = current.text || "";
    rightTextEl.innerHTML = current.text2 || "";

    // first spread
    if (spreadIndex === 0) {
      leftArrow.classList.add("info-page-arrow-disabled");
    } else {
      leftArrow.classList.remove("info-page-arrow-disabled");
    }

    // last spread
    if (spreadIndex >= pages.length - 1) {
      rightArrow.classList.add("info-page-arrow-disabled");
    } else {
      rightArrow.classList.remove("info-page-arrow-disabled");
    }
  }

  leftArrow.addEventListener("click", () => {
    if (spreadIndex === 0) return;

    spreadIndex--;

    refreshPages();
  });

  rightArrow.addEventListener("click", () => {
    if (spreadIndex >= pages.length - 1) return;

    spreadIndex++;

    refreshPages();
  });

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

  refreshPages();

  return {
    open,
    close,
    update
  };
}