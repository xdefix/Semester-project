import {
  goBack,
  timerState,
  startTimer,
  togglePause,
  formatTime,
  getRemainingTime,
  navigate
} from "./app.js";

import { t } from "./i18n.js";

import { createHelpOverlay } from "./help.js";
import { resetHelpState, clearAllHelpStates, getHelpState } from "./helpState.js";
import { createInfoOverlay } from "./info.js";

export function renderPuzzle2(app) {
  getHelpState("puzzle2");

  app.innerHTML = `
  <section class="page street-page">

    <!-- BACK -->
    <button id="back-btn" class="top-back-btn">
      ${t("back")}
    </button>

    <!-- TIMER -->
    <div class="timer-container">
      <span id="timer">${formatTime(timerState.remaining)}</span>
      <button id="pause-btn" class="icon-btn"></button>
    </div>

    <!-- HELP -->
    <img
      src="${window.BASE_PATH}images/help-icon.png"
      id="help-btn"
      class="corner-btn bottom-left"
      alt="Help"
    >

    <!-- INFO -->
    <img
      src="${window.BASE_PATH}images/info-icon.png"
      id="info-btn"
      class="corner-btn bottom-right"
      alt="Info"
    >


    <!-- CONTENT -->
    <div class="content-box1 puzzle-route-box">
    <!-- PAGE COUNTER -->
    <div class="pages-needed-wrapper">
      <div class="pages-needed-counter">
        <span class="pages-needed-text">
          ${t("pages_needed")} 2.1-2.5
        </span>
      </div>
    </div>

      <!-- LEFT SIDE -->
      <div class="puzzle-left">

        <div class="progress" id="progress"></div>

        <div class="location" id="location"></div>

        <div class="elli-wrap">
          <div class="elli-label">Elli:</div>
          <div class="elli-text" id="elli"></div>
        </div>

        <div class="choices-label">
          ${t("choose_route")}
        </div>

        <div class="choices" id="choices"></div>

      </div>

      <!-- RIGHT SIDE -->
      <div class="puzzle-image-wrap">
        <img
          id="route-image"
          class="route-image"
          src="${window.BASE_PATH}images/puzzle2/start.png"
          alt="Route image"
        >
      </div>

    </div>

    <!-- CONTINUE -->
    <div class="buttons">
      <button
        id="continue-btn"
        class="action-btn"
        style="display:none;"
      >
        ${t("continue")}
      </button>
    </div>

  </section>
  `;

  // --------------------------------------------------
  // HELP + INFO
  // --------------------------------------------------

  const help = createHelpOverlay(app, {
    t,
    puzzleId: "puzzle2",
    clues: [
      t("clue1"),
      t("clue2"),
      t("solution")
    ],
    reveals: [
      t("reveal1.1"),
      t("reveal2.1"),
      t("reveal3.1")
    ]
  });

  const info = createInfoOverlay(app, {
    t,
    title: t("info_title"),
    title2: t("info_title2"),
    leftText: t("info_text_left2"),
    rightText: t("info_text_right2")
  });

  // --------------------------------------------------
  // PUZZLE DATA
  // --------------------------------------------------

  const STEPS = 6;

  const nodes = {
    start: {
      step: 0,
      image: `${window.BASE_PATH}images/puzzle2/start.png`,
      location: "Elli's House — Schubert Straße",
      elli: t("puzzle2_start_elli"),
      choices: [
        { label: "North — Jahn Straße", next: "dead_jahn" },
        { label: "North — Gasser Straße", next: "dead_gasser" },
        { label: "West — Schubert Straße", next: "schubert" }
      ]
    },

    schubert: {
      step: 1,
      image: `${window.BASE_PATH}images/puzzle2/schubert.png`,
      location: "Schubert Straße",
      elli: t("puzzle2_schubert_elli"),
      choices: [
        {
          label: "Mariazeller Straße",
          next: "dead_mariazeller"
        },
        {
          label: "Maria Theresia Straße",
          next: "maria_theresia"
        },
        {
          label: "Josef Straße",
          next: "josef"
        }
      ]
    },

    maria_theresia: {
      step: 2,
      image: `${window.BASE_PATH}images/puzzle2/maria-theresia.png`,
      location: "Maria Theresia Straße",
      elli: t("puzzle2_maria_elli"),
      choices: [
        {
          label: "North via Schul Ring",
          next: "josef"
        },
        {
          label: "North via Kalcher Straße",
          next: "josef"
        },
        {
          label: "Kalcher → Mariazeller Straße",
          next: "dead_mariazeller_2"
        }
      ]
    },

    josef: {
      step: 3,
      image: `${window.BASE_PATH}images/puzzle2/josef.png`,
      location: "Josef Straße",
      elli: t("puzzle2_josef_elli"),
      choices: [
        {
          label: "North — Schießstatt Promenade",
          next: "schiessstatt"
        },
        {
          label: "North-East — Linzer Straße",
          next: "dead_linzer"
        }
      ]
    },

    schiessstatt: {
      step: 4,
      image: `${window.BASE_PATH}images/puzzle2/schiessstatt.png`,
      location: "Schießstatt Promenade",
      elli: t("puzzle2_schiessstatt_elli"),
      choices: [
        {
          label: "North — Prater Straße",
          next: "prater"
        },
        {
          label: "West — Schießstatt Ring",
          next: "ring"
        },
        {
          label: "North — Brunn Gasse",
          next: "dead_brunn"
        }
      ]
    },

    prater: {
      step: 5,
      image: `${window.BASE_PATH}images/puzzle2/prater.png`,
      location: "Prater Straße",
      elli: t("puzzle2_prater_elli"),
      choices: [
        {
          label: "Continue north",
          next: "success"
        },
        {
          label: "West — Waldstraße",
          next: "dead_wald"
        }
      ]
    },

    ring: {
      step: 5,
      image: `${window.BASE_PATH}images/puzzle2/ring.png`,
      location: "Schießstatt Ring",
      elli: t("puzzle2_ring_elli"),
      choices: [
        {
          label: "Continue north",
          next: "success"
        },
        {
          label: "West — Waldstraße",
          next: "dead_wald"
        }
      ]
    },

    dead_jahn: {
      type: "dead",
      step: 0,
      image: `${window.BASE_PATH}images/puzzle2/fail.png`,
      location: "Jahn Straße",
      text: t("puzzle2_dead_jahn")
    },

    dead_gasser: {
      type: "dead",
      step: 0,
      image: `${window.BASE_PATH}images/puzzle2/fail.png`,
      location: "Gasser Straße",
      text: t("puzzle2_dead_gasser")
    },

    dead_mariazeller: {
      type: "dead",
      step: 1,
      image: `${window.BASE_PATH}images/puzzle2/fail.png`,
      location: "Mariazeller Straße",
      text: t("puzzle2_dead_mariazeller")
    },

    dead_mariazeller_2: {
      type: "dead",
      step: 2,
      image: `${window.BASE_PATH}images/puzzle2/fail.png`,
      location: "Kalcher → Mariazeller",
      text: t("puzzle2_dead_mariazeller2")
    },

    dead_linzer: {
      type: "dead",
      step: 3,
      image: `${window.BASE_PATH}images/puzzle2/fail.png`,
      location: "Linzer Straße",
      text: t("puzzle2_dead_linzer")
    },

    dead_brunn: {
      type: "dead",
      step: 4,
      image: `${window.BASE_PATH}images/puzzle2/fail.png`,
      location: "Brunn Gasse",
      text: t("puzzle2_dead_brunn")
    },

    dead_wald: {
      type: "dead",
      step: 5,
      image: `${window.BASE_PATH}images/puzzle2/fail.png`,
      location: "Waldstraße",
      text: t("puzzle2_dead_wald")
    }
  };

  // --------------------------------------------------
  // ELEMENTS
  // --------------------------------------------------

  const progressEl = app.querySelector("#progress");
  const locationEl = app.querySelector("#location");
  const elliEl = app.querySelector("#elli");
  const choicesEl = app.querySelector("#choices");
  const imageEl = app.querySelector("#route-image");

  // --------------------------------------------------
  // PROGRESS
  // --------------------------------------------------

  function renderPips(step) {
    progressEl.innerHTML = "";

    for (let i = 0; i < STEPS; i++) {
      const pip = document.createElement("div");

      pip.className =
        "pip" +
        (i < step
          ? " done"
          : i === step
            ? " active"
            : "");

      progressEl.appendChild(pip);
    }
  }

  // --------------------------------------------------
  // IMAGE TRANSITION
  // --------------------------------------------------

  function updateImage(src) {
    if (!imageEl) return;

    imageEl.style.opacity = "0";

    setTimeout(() => {
      imageEl.src = src;
      imageEl.style.opacity = "1";
    }, 120);
  }

  // --------------------------------------------------
  // RENDER NODE
  // --------------------------------------------------

  function renderNode(id) {
    // ---------------- SUCCESS ----------------

    if (id === "success") {
      renderPips(STEPS);

      updateImage(`${window.BASE_PATH}images/puzzle2/success.png`);

      locationEl.textContent =
        t("puzzle2_success_location");

      elliEl.textContent =
        t("puzzle2_success_elli");

      choicesEl.innerHTML = "";

      // hide label
      app.querySelector(".choices-label").style.display =
        "none";

      const successText = document.createElement("div");

      successText.className = "success-text";

      successText.textContent =
        t("puzzle2_success_text");

      choicesEl.appendChild(successText);

      const continueBtn =
        app.querySelector("#continue-btn");

      continueBtn.style.display = "block";

      return;
    }

    const node = nodes[id];

    // update image
    if (node.image) {
      updateImage(node.image);
    }

    // ---------------- NORMAL ----------------

    renderPips(node.step);

    locationEl.textContent = node.location;

    choicesEl.innerHTML = "";

    app.querySelector("#continue-btn").style.display =
      "none";

    // ---------------- DEAD END ----------------

    if (node.type === "dead") {
      elliEl.textContent = node.text;
      choicesEl.innerHTML = "";

      // hide label
      app.querySelector(".choices-label").style.display =
        "none";


      const retryBtn = document.createElement("button");

      retryBtn.className = "action-btn";

      retryBtn.textContent = t("try_again");

      retryBtn.onclick = () => {
        renderNode("start");
      };

      choicesEl.appendChild(retryBtn);

      return;
    }

    // ---------------- NORMAL CHOICES ----------------

    elliEl.textContent = node.elli;

    node.choices.forEach(choice => {
      const btn = document.createElement("button");

      btn.className = "choice-btn";

      btn.textContent = choice.label;

      btn.onclick = () => {
        renderNode(choice.next);
      };

      choicesEl.appendChild(btn);
    });
  }

  // --------------------------------------------------
  // START
  // --------------------------------------------------

  renderNode("start");

  // --------------------------------------------------
  // TIMER
  // --------------------------------------------------

  const pauseBtn = app.querySelector("#pause-btn");

  function updateUI() {
    const timerEl = app.querySelector("#timer");

    if (timerEl) {
      timerEl.textContent =
        formatTime(getRemainingTime());
    }

    if (pauseBtn) {
      pauseBtn.innerHTML = timerState.paused
        ? `<img src="${BASE_PATH}images/play-btn.png" alt="Play" class="btn-icon">`
        : `<img src="${BASE_PATH}images/pause-btn.png" alt="Pause" class="btn-icon">`;
    }

    const paused = timerState.paused;

    app.querySelectorAll("button").forEach(el => {
      if (el.id !== "pause-btn") {
        el.disabled = paused;
        el.style.opacity = paused ? "0.5" : "1";
      }
    });

    const helpBtn = app.querySelector("#help-btn");
    const infoBtn = app.querySelector("#info-btn");

    [helpBtn, infoBtn].forEach(el => {
      if (el) {
        el.style.pointerEvents =
          paused ? "none" : "auto";

        el.style.opacity =
          paused ? "0.5" : "1";
      }
    });

    help.update(paused);
    info.update(paused);
  }

  startTimer(updateUI);

  updateUI();

  pauseBtn.onclick = () => {
    togglePause(updateUI);
  };

  // --------------------------------------------------
  // HELP + INFO BUTTONS
  // --------------------------------------------------

  app.querySelector("#help-btn").onclick = () => {
    info.close();
    help.open();
  };

  app.querySelector("#info-btn").onclick = () => {
    help.close();
    info.open();
  };

  // --------------------------------------------------
  // CONTINUE
  // --------------------------------------------------

  app.querySelector("#continue-btn").onclick = () => {
    navigate("puzzle3extra");
  };

  // --------------------------------------------------
  // BACK
  // --------------------------------------------------

  app.querySelector("#back-btn").onclick = () => {
    goBack();
  };
}