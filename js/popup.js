import { t, onLanguageChanged } from "./i18n.js";

let popupRoot = null;
let currentPopup = null;

export function initPopup() {
    if (popupRoot) return;

    popupRoot = document.createElement("div");
    popupRoot.id = "custom-popup";
    popupRoot.classList.add("hidden");

    document.body.appendChild(popupRoot);
}

// 🔥 ALWAYS active listener (not dependent on init timing)
onLanguageChanged(() => {
    if (popupRoot && currentPopup && !popupRoot.classList.contains("hidden")) {
        renderPopup();
    }
});

function renderPopup() {
    if (!popupRoot || !currentPopup) return;

    popupRoot.innerHTML = `
        <div class="modal1" id="popup-overlay">
            <div class="popup-box" id="popup-box">
                <p>${t("wrong")}</p>

                <button class="popup-btn" id="popup-ok">
                    > OK
                </button>
            </div>
        </div>
    `;

    popupRoot.onclick = () => {
        hidePopup();
        currentPopup?.onClose?.();
    };
}

export function showPopup(messageKey, onClose) {
    if (!popupRoot) initPopup();

    currentPopup = { messageKey, onClose };

    popupRoot.classList.remove("hidden");
    renderPopup();
}

export function hidePopup() {
    if (!popupRoot) return;

    popupRoot.classList.add("hidden");
    popupRoot.innerHTML = "";
    popupRoot.onclick = null;
    currentPopup = null;
}

