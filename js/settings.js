import { loadLanguage, i18nState, t } from "./i18n.js";
import { resetHelpState, clearAllHelpStates, getHelpState } from "./helpState.js";
import {
  rerender,
  resetGame,
  navigate,
  getCurrentPage,
  restartAllowedPages
} from "./app.js";

import {
  setMusicVolume,
  setSfxVolume,
  getMusicVolume,
  getSfxVolume
} from "./sound.js";

// ---------------- LANGUAGE ----------------
export async function setLanguage(lang) {
  localStorage.setItem("lang", lang);
  i18nState.language = lang;

  await loadLanguage(lang);
  rerender();
  updateSettingsTexts();
}

// ---------------- TEXT UPDATE ----------------
function updateSettingsTexts() {
  const title = document.querySelector(".settings-title");
  const restartBtn = document.getElementById("restart-game-btn");

  if (title) title.textContent = t("settings");

  const labels = document.querySelectorAll(".section-label");
  if (labels[0]) labels[0].textContent = t("language");
  if (labels[1]) labels[1].textContent = t("music_volume");
  if (labels[2]) labels[2].textContent = t("sfx_volume");

  const page = getCurrentPage();

  if (restartBtn) {
    if (restartAllowedPages.has(page)) {
      restartBtn.style.display = "block";
      restartBtn.textContent = t("restart_game");
    } else {
      restartBtn.style.display = "none";
    }
  }

  const muteMusicBtn =
  document.getElementById("mute-music-btn");

const muteSfxBtn =
  document.getElementById("mute-sfx-btn");

if (muteMusicBtn)
  muteMusicBtn.textContent = t("mute");

if (muteSfxBtn)
  muteSfxBtn.textContent = t("mute");
}

// ---------------- OVERLAY HTML ----------------
export function renderSettingsOverlay() {
  return `
    <button id="settings-btn" class="settings-btn"></button>

    <div id="settings-overlay" class="overlay hidden">
      <div class="overlay-content">

        <button id="close-settings" class="close-btn">
          <span class="close-text">✕</span>
        </button>

        <h2 class="settings-title">${t("settings")}</h2>

        <!-- LANGUAGE -->
        <div class="settings-section">
          <p class="section-label">${t("language")}</p>

          <div class="language-buttons">
            <button data-no-sound class="lang-btn" data-lang="en">[EN]</button>
            <button data-no-sound class="lang-btn" data-lang="de">[DE]</button>
          </div>
        </div>

<div class="audio-settings-row">

  <!-- MUSIC -->
  <div class="settings-section audio-section">
    <p class="section-label">${t("music_volume")}</p>

    <div class="knob-surround">

      <span class="knob-min">MIN</span>
      <span class="knob-max">MAX</span>

      <div class="knob-wrapper">
        <div class="ticks" id="music-ticks"></div>

        <img
          src="${window.BASE_PATH}images/knob.png"
          class="knob"
          id="music-dial"
        />
      </div>

    </div>
        <button id="mute-music-btn" class="action-btn2">${t("mute")}</button>
  </div>

  <!-- SFX -->
  <div class="settings-section audio-section">
    <p class="section-label">${t("sfx_volume")}</p>

    <div class="knob-surround">

      <span class="knob-min">MIN</span>
      <span class="knob-max">MAX</span>

      <div class="knob-wrapper">
        <div class="ticks" id="sfx-ticks"></div>

        <img
          src="${window.BASE_PATH}images/knob.png"
          class="knob"
          id="sfx-dial"
        />
      </div>

    </div>
        <button id="mute-sfx-btn" class="action-btn2">${t("mute")}</button>
  </div>

</div>

<button id="restart-game-btn" class="restart-btn">
  ${t("restart_game")}
</button>

      </div>
    </div>

    <div id="confirm-modal" class="modal hidden">
      <div class="modal-box">
        <p id="confirm-text"></p>

        <div class="modal-actions">
          <button id="confirm-cancel" class="btn-secondary"></button>
          <button id="confirm-ok" class="btn-danger"></button>
        </div>
      </div>
    </div>
  `;
}

// ---------------- CONFIRM MODAL ----------------
function showConfirm(message, onConfirm) {
  const modal = document.getElementById("confirm-modal");
  const text = document.getElementById("confirm-text");
  const ok = document.getElementById("confirm-ok");
  const cancel = document.getElementById("confirm-cancel");

  if (!modal || !text || !ok || !cancel) return;

  text.textContent = message;
  ok.textContent = t("restart_yes");
  cancel.textContent = t("restart_no");

  modal.classList.remove("hidden");

  const cleanup = () => {
    modal.classList.add("hidden");
    ok.onclick = null;
    cancel.onclick = null;
  };

  ok.onclick = () => {
    cleanup();
    onConfirm();
  };

  cancel.onclick = cleanup;
}

// ---------------- CREATE TICKS ----------------
function createTicks(container, activeCount = 0) {
  if (!container) return;

  container.innerHTML = "";

  const TOTAL = 27;

  for (let i = 0; i < TOTAL; i++) {
    const tick = document.createElement("div");

    tick.className =
      i < activeCount ? "tick active-tick" : "tick";

    tick.style.transform =
      `rotate(${-135 + i * 10}deg)`;

    container.appendChild(tick);
  }
}

// ---------------- DIAL CONTROL ----------------
function setupDial(dialEl, ticksEl, onChange) {
  if (!dialEl) return;

  const MIN_ANGLE = -135;
  const MAX_ANGLE = 135;
  const RANGE = 270;

  let dragging = false;

  const clamp = (v, min, max) =>
    Math.min(max, Math.max(min, v));

  const snap = (v) =>
    Math.round(v * 100) / 100;

  function render(value) {
    value = clamp(value, 0, 1);
    value = snap(value);

    const IMAGE_OFFSET = 80;

    const angle =
      MIN_ANGLE + value * RANGE + IMAGE_OFFSET;

    dialEl.style.transform =
      `rotate(${angle}deg)`;

    dialEl.dataset.value = value;

    const activeTicks =
      Math.round(value * 27);

    createTicks(ticksEl, activeTicks);

    if (onChange) onChange(value);
  }

  function updateFromPointer(clientX, clientY) {
    const rect =
      dialEl.getBoundingClientRect();

    const centerX =
      rect.left + rect.width / 2;

    const centerY =
      rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;

    let angle =
      Math.atan2(dy, dx) *
      (180 / Math.PI);

    angle += 90;

    if (angle > 180) angle -= 360;

    angle = clamp(
      angle,
      MIN_ANGLE,
      MAX_ANGLE
    );

    const value =
      (angle - MIN_ANGLE) / RANGE;

    render(value);
  }

  function onPointerMove(e) {
    if (!dragging) return;

    updateFromPointer(
      e.clientX,
      e.clientY
    );
  }

  function stopDrag() {
    dragging = false;
    dialEl.style.cursor = "grab";
  }

  dialEl.addEventListener(
    "pointerdown",
    (e) => {
      dragging = true;

      dialEl.style.cursor =
        "grabbing";

      dialEl.setPointerCapture(
        e.pointerId
      );

      updateFromPointer(
        e.clientX,
        e.clientY
      );

      e.preventDefault();
    }
  );

  document.addEventListener(
    "pointermove",
    onPointerMove
  );

  document.addEventListener(
    "pointerup",
    stopDrag
  );

  return {
    render
  };
}

// ---------------- EVENTS ----------------
export function initSettingsEvents() {
  const overlay =
    document.getElementById(
      "settings-overlay"
    );

  const btn =
    document.getElementById(
      "settings-btn"
    );

  const closeBtn =
    document.getElementById(
      "close-settings"
    );

  const restartBtn =
    document.getElementById(
      "restart-game-btn"
    );

  const musicDial =
    document.getElementById(
      "music-dial"
    );

  const sfxDial =
    document.getElementById(
      "sfx-dial"
    );

  const musicTicks =
    document.getElementById(
      "music-ticks"
    );

  const sfxTicks =
    document.getElementById(
      "sfx-ticks"
    );
  const muteMusicBtn =
    document.getElementById(
      "mute-music-btn"
    );

  const muteSfxBtn =
    document.getElementById(
      "mute-sfx-btn"
    );

  if (!overlay || !btn || !closeBtn) return;

  // OPEN
  btn.onclick = () => {
    overlay.classList.remove("hidden");
    updateSettingsTexts();
  };

  // CLOSE
  function close() {
    overlay.classList.add("hidden");
  }

  closeBtn.onclick = close;

  overlay.addEventListener("click", e => {
    if (e.target === overlay) close();
  });

  document.addEventListener(
    "keydown",
    e => {
      if (
        e.key === "Escape" &&
        !overlay.classList.contains("hidden")
      ) {
        close();
      }
    }
  );

  // LANGUAGE
  const langButtons =
    document.querySelectorAll(".lang-btn");

  langButtons.forEach(btn => {
    if (
      btn.dataset.lang ===
      i18nState.language
    ) {
      btn.classList.add("active");
    }

    btn.onclick = async () => {
      const lang = btn.dataset.lang;

      langButtons.forEach(b =>
        b.classList.remove("active")
      );

      btn.classList.add("active");

      await setLanguage(lang);
    };
  });

  // RESTART
  if (restartBtn) {
    restartBtn.onclick = () => {
      showConfirm(
        t("restart_confirm"),
        () => {
          clearAllHelpStates();

          resetGame();

          overlay.classList.add("hidden");

          navigate("landing");

          sessionStorage.removeItem(
            "visited_story_pages"
          );
        }
      );
    };
  }

  // MUSIC KNOB
  const musicControl = setupDial(
    musicDial,
    musicTicks,
    (value) => {
      setMusicVolume(value);
    }
  );

  // SFX KNOB
  const sfxControl = setupDial(
    sfxDial,
    sfxTicks,
    (value) => {
      setSfxVolume(value);
    }
  );

  if (muteMusicBtn) {
    muteMusicBtn.onclick = () => {
      musicControl.render(0);
    };
  }

  if (muteSfxBtn) {
    muteSfxBtn.onclick = () => {
      sfxControl.render(0);
    };
  }

  // INITIAL VALUES
  musicControl.render(
    getMusicVolume()
  );

  sfxControl.render(
    getSfxVolume()
  );
}