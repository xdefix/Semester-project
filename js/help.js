import { timerState } from "./app.js";
import { getHelpState } from "./helpState.js";

export function createHelpOverlay(app, { t, clues, reveals, puzzleId }) {
    const overlay = document.createElement("div");
    overlay.className = "overlay hidden";
    overlay.id = "help-overlay";

    const state = getHelpState(puzzleId);

    const helpBtn = document.getElementById("help-btn");

    const normalHelpImg = "${BASE_PATH}images/help-icon.png";
    const cooldownHelpImg = "${BASE_PATH}images/help-icon-cooldown.png";

    const normalOverlayBg = "${BASE_PATH}images/help-overlay.png";
    const cooldownOverlayBg = "${BASE_PATH}images/help-overlay-cooldown.png";

    let interval = null;

    overlay.innerHTML = `
    <div class="overlay-content-help">

    <div class="hint-container">
      <div class="hint locked" data-hint="0"></div>
      <div class="hint locked" data-hint="1"></div>
      <div class="hint locked" data-hint="2"></div>
    </div>

      <button id="close-help" class="action-btn">${t("close")}</button>
    </div>
  `;

    app.appendChild(overlay);

    const closeBtn = overlay.querySelector("#close-help");
    const hintEls = overlay.querySelectorAll(".hint");

    // -----------------------------
    // TEXT + LOCK STATE
    // -----------------------------
    function setLocked(el, locked) {
        el.classList.toggle("locked", locked);
        el.disabled = locked;
    }

    function setText(el, id) {
        if (!state.unlocked[id]) {
            el.textContent = t("locked");
            return;
        }

        if (!state.revealed[id]) {
            el.textContent = clues[id];
            return;
        }

        el.textContent = reveals[id];
    }

    // -----------------------------
    // COOLDOWN STATE (single source of truth)
    // -----------------------------
    function isCooldownActive() {
        const now = Date.now();

        const c1 = state.clue1Time && (now - state.clue1Time < 30000);
        const c2 = state.clue2Time && (now - state.clue2Time < 60000);

        return c1 || c2;
    }

    // -----------------------------
    // ICON UPDATE
    // -----------------------------
    function updateHelpIcon() {
        if (!helpBtn) return;

        const target = isCooldownActive()
            ? cooldownHelpImg
            : normalHelpImg;

        if (helpBtn.dataset.state === target) return;

        helpBtn.dataset.state = target;
        helpBtn.src = target;
    }

    // -----------------------------
    // OVERLAY BACKGROUND UPDATE (NEW)
    // -----------------------------
    function updateOverlayBackground() {
        const content = overlay.querySelector(".overlay-content-help");
        if (!content) return;

        const bg = isCooldownActive()
            ? cooldownOverlayBg
            : normalOverlayBg;

        if (content.dataset.bg === bg) return;

        content.dataset.bg = bg;
        content.style.backgroundImage = `url(${bg})`;
        content.style.backgroundSize = "cover";
        content.style.backgroundPosition = "center";
    }

    // -----------------------------
    // HINT UI
    // -----------------------------
    function refreshHints() {
        hintEls.forEach(el => {
            const id = Number(el.dataset.hint);
            setLocked(el, !state.unlocked[id]);
            setText(el, id);
        });
    }

    function refreshAll() {
        refreshHints();
        updateHelpIcon();
        updateOverlayBackground();
    }

    // -----------------------------
    // UNLOCK LOGIC
    // -----------------------------
    function checkUnlocks() {
        const now = Date.now();
        let changed = false;

        const clue1JustUnlocked =
            state.clue1Time &&
            !state.unlocked[1] &&
            now - state.clue1Time >= 30000;

        const clue2JustUnlocked =
            state.clue2Time &&
            !state.unlocked[2] &&
            now - state.clue2Time >= 60000;

        if (clue1JustUnlocked) {
            state.unlocked[1] = true;
            changed = true;
        }

        if (clue2JustUnlocked) {
            state.unlocked[2] = true;
            changed = true;
        }

        // ALWAYS sync visuals
        updateHelpIcon();
        updateOverlayBackground();

        if (changed) {
            refreshHints();
        }
    }

    // -----------------------------
    // CLICK LOGIC
    // -----------------------------
    hintEls.forEach(el => {
        el.addEventListener("click", () => {
            if (timerState.paused) return;

            const id = Number(el.dataset.hint);

            if (id === 0 && state.unlocked[0]) {
                state.revealed[0] = true;
                if (!state.clue1Time) state.clue1Time = Date.now();
            }

            if (id === 1) {
                checkUnlocks();
                if (!state.unlocked[1]) return;

                state.revealed[1] = true;
                if (!state.clue2Time) state.clue2Time = Date.now();
            }

            if (id === 2) {
                checkUnlocks();
                if (!state.unlocked[2]) return;

                state.revealed[2] = true;
            }

            refreshAll();
        });
    });

    // -----------------------------
    // OPEN / CLOSE
    // -----------------------------
    function open() {
        overlay.classList.remove("hidden");
        refreshAll();

        if (!interval) {
            interval = setInterval(() => {
                checkUnlocks();
                updateHelpIcon();
                updateOverlayBackground();
            }, 1000);
        }
    }

    function close() {
        overlay.classList.add("hidden");

        if (interval) {
            clearInterval(interval);
            interval = null;
        }
    }

    closeBtn.onclick = close;

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) close();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
    });

    // -----------------------------
    // LANGUAGE SAFE UPDATE
    // -----------------------------
    function onLanguageChange(newT) {
        overlay.querySelector("h3").textContent = newT("hints");
        closeBtn.textContent = newT("close");

        hintEls.forEach(el => {
            const id = Number(el.dataset.hint);
            setText(el, id);
        });

        // DO NOT touch visuals here (icon/background handled by timer)
    }

    // -----------------------------
    // PUBLIC API
    // -----------------------------
    function update() {
        checkUnlocks();
        updateHelpIcon();
        updateOverlayBackground();
    }

    return {
        open,
        close,
        update,
        onLanguageChange
    };
}