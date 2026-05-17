// sound.js

// ---------------- STORAGE KEYS ----------------
const MUSIC_KEY = "music_volume";
const SFX_KEY = "sfx_volume";

// ---------------- DEFAULTS ----------------
let musicVolume = parseFloat(
  localStorage.getItem(MUSIC_KEY) ?? "1"
);

let sfxVolume = parseFloat(
  localStorage.getItem(SFX_KEY) ?? "1"
);

// ---------------- MUSIC ----------------
const bgMusic = new Audio(
  `${window.BASE_PATH}audio/music.mp3`
);

bgMusic.loop = true;
bgMusic.volume = musicVolume;

// ---------------- BUTTON ----------------
const buttonSound = new Audio(
  `${window.BASE_PATH}audio/button-click.mp3`
);

// ---------------- TYPEWRITER ----------------
const typewriterSound = new Audio(
  `${window.BASE_PATH}audio/typewriter.mp3`
);

typewriterSound.loop = true;
typewriterSound.preload = "auto";

// ---------------- HELPERS ----------------
function clamp(v) {
  return Math.max(0, Math.min(1, v));
}

function saveVolumes() {
  localStorage.setItem(MUSIC_KEY, musicVolume);
  localStorage.setItem(SFX_KEY, sfxVolume);
}

function applySfxVolume() {
  buttonSound.volume = sfxVolume;
  typewriterSound.volume = sfxVolume;
}

applySfxVolume();

// ---------------- MUSIC ----------------
export function playMusic() {
  bgMusic.volume = musicVolume;
  bgMusic.play().catch(() => {});
}

export function stopMusic() {
  bgMusic.pause();
}

// ---------------- MUSIC VOLUME ----------------
export function setMusicVolume(value) {
  musicVolume = clamp(value);
  bgMusic.volume = musicVolume;
  saveVolumes();
}

export function getMusicVolume() {
  return musicVolume;
}

// ---------------- SFX VOLUME ----------------
export function setSfxVolume(value) {
  sfxVolume = clamp(value);
  applySfxVolume();
  saveVolumes();
}

export function getSfxVolume() {
  return sfxVolume;
}

// ---------------- BUTTON SOUND ----------------
export function playButtonClick() {
  try {
    buttonSound.pause();
    buttonSound.currentTime = 0;
    buttonSound.volume = sfxVolume;
    buttonSound.play().catch(() => {});
  } catch (err) {
    console.warn(err);
  }
}

// ---------------- TYPEWRITER SOUND ----------------
export function playTypewriter() {
  try {
    typewriterSound.volume = sfxVolume;

    if (typewriterSound.paused) {
      typewriterSound.currentTime = 0;
      typewriterSound.play().catch(() => {});
    }
  } catch (err) {
    console.warn(err);
  }
}

export function stopTypewriter() {
  try {
    typewriterSound.pause();
    typewriterSound.currentTime = 0;
  } catch (err) {
    console.warn(err);
  }
}