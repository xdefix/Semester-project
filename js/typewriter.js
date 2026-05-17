// typewriter.js

// ---------------- STORAGE ----------------
const VISITED_KEY = "visited_story_pages";

// ---------------- HELPERS ----------------
function sleep(ms) {
    return new Promise(resolve =>
        setTimeout(resolve, ms)
    );
}

async function waitWhilePaused(pauseCheck) {
    while (pauseCheck?.()) {
        await sleep(100);
    }
}

// ---------------- SOUND ----------------
let typeSound = null;

function getTypeSound() {
    if (typeSound) return typeSound;

    typeSound = new Audio(
        `${window.BASE_PATH}audio/typewriter.mp3`
    );

    typeSound.volume = 0.15;

    return typeSound;
}

function playTypeSound() {
    try {
        const base = getTypeSound();

        const clone = base.cloneNode();

        clone.volume = base.volume;

        clone.play().catch(() => {});
    } catch (err) {
        console.warn("Typewriter sound failed:", err);
    }
}

// ---------------- VISITED ----------------
function getVisitedPages() {
    return JSON.parse(
        sessionStorage.getItem(VISITED_KEY) || "[]"
    );
}

function markVisited(pageId) {
    const visited = getVisitedPages();

    if (!visited.includes(pageId)) {
        visited.push(pageId);

        sessionStorage.setItem(
            VISITED_KEY,
            JSON.stringify(visited)
        );
    }
}

function hasVisited(pageId) {
    return getVisitedPages().includes(pageId);
}

// ---------------- MAIN ----------------
export async function typewriteParagraphs(
    container,
    {
        pageId = "default",
        speed = 20,
        paragraphDelay = 400,
        punctuationMultiplier = true,
        sound = false,
        soundFrequency = 2,
        pauseCheck = null
    } = {}
) {
    if (!container) return;

    const paragraphs =
        container.querySelectorAll(".story-text");

    // ---------------- REVISIT ----------------
    if (hasVisited(pageId)) {
        paragraphs.forEach(p => {
            p.style.visibility = "visible";
            p.textContent = p.dataset.text || p.textContent;
        });

        return;
    }

    // ---------------- INIT ----------------
    paragraphs.forEach(p => {
        p.dataset.text = p.dataset.text || p.textContent;
        p.textContent = "";
        p.style.visibility = "visible";
    });

    let skipAnimation = false;

    function skipHandler() {
        if (pauseCheck?.()) return; // IMPORTANT: don't skip while paused
        skipAnimation = true;
    }

    document.addEventListener("pointerdown", skipHandler);

    // ---------------- TYPE LOOP ----------------
    for (const p of paragraphs) {
        const fullText = p.dataset.text;

        if (skipAnimation) {
            p.textContent = fullText;
            continue;
        }

        for (let i = 0; i < fullText.length; i++) {

            // pause support (FIXED)
            await waitWhilePaused(pauseCheck);

            // skip support
            if (skipAnimation) {
                p.textContent = fullText;
                break;
            }

            const char = fullText[i];
            p.textContent += char;

            // ---------------- SOUND ----------------
            if (
                sound &&
                char.trim() &&
                i % soundFrequency === 0
            ) {
                playTypeSound();
            }

            // ---------------- TIMING ----------------
            if (punctuationMultiplier) {
                if (char === "." || char === "!" || char === "?") {
                    await sleep(speed * 10);
                } else if (char === "," || char === ";" || char === ":") {
                    await sleep(speed * 5);
                } else {
                    await sleep(speed);
                }
            } else {
                await sleep(speed);
            }
        }

        if (!skipAnimation) {
            await sleep(paragraphDelay);
        }
    }

    document.removeEventListener("pointerdown", skipHandler);

    markVisited(pageId);
}

// ---------------- RESET ----------------
export function resetTypewriterVisits() {
    sessionStorage.removeItem(VISITED_KEY);
}