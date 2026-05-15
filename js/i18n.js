const cache = {};

export const i18nState = {
  language: localStorage.getItem("lang") || "en",
  translations: {}
};

// optional subscribers so UI can refresh when language loads
let listeners = [];

export function onLanguageChanged(fn) {
  listeners.push(fn);
}

// ---------- INIT ----------
export async function initI18n() {
  await loadLanguage(i18nState.language);
}

// ---------- LOAD ----------
export async function loadLanguage(lang) {
  i18nState.language = lang;

  if (cache[lang]) {
    i18nState.translations = cache[lang];
    listeners.forEach(fn => fn());
    return;
  }

  const res = await fetch(`${window.BASE_PATH}lang/${lang}.json`);
  if (!res.ok) {
    throw new Error("Language file not found");
  }
  const data = await res.json();

  cache[lang] = data;
  i18nState.translations = data;

  listeners.forEach(fn => fn());
}

// ---------- BASIC TRANSLATE ----------
export function t(key) {
  return i18nState.translations[key] ?? key;
}

// ---------- TEMPLATE REPLACE ----------
export function tReplace(key, values = {}) {
  let text = t(key);

  for (const k in values) {
    text = text.replace(`{${k}}`, values[k]);
  }

  return text;
}