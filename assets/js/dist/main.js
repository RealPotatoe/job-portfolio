function setupThemeSwitcher() {
  const themeToggle = document.getElementById("theme-toggle");
  const htmlElement = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (prefersDark) {
    htmlElement.setAttribute("data-theme", "dark");
  } else {
    htmlElement.setAttribute("data-theme", "light");
  }
  themeToggle?.addEventListener("click", () => {
    const currentTheme = htmlElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    htmlElement.setAttribute("data-theme", newTheme);
  });
}
let translations = {};
function getTranslation(key) {
  return key.split(".").reduce(
    (obj, i) => obj ? obj[i] : null,
    translations
  );
}
async function setLanguage(lang) {
  const response = await fetch(`assets/locales/${lang}.json`);
  translations = await response.json();
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (key) {
      const translation = getTranslation(key);
      if (translation) {
        element.innerHTML = translation;
      }
    }
  });
  document.querySelectorAll("[data-i18n-list]").forEach((element) => {
    const key = element.getAttribute("data-i18n-list");
    if (key) {
      const translation = getTranslation(key);
      if (translation && Array.isArray(translation)) {
        element.innerHTML = translation.map(
          (item) => `<li>${item}</li>`
        ).join("");
      }
    }
  });
  const langSwitcher = document.querySelector(".lang-switcher");
  langSwitcher?.querySelectorAll("button").forEach((button) => {
    if (button.getAttribute("data-lang") === lang) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}
function setupLocalization() {
  const langSwitcher = document.querySelector(".lang-switcher");
  const browserLang = navigator.language.split("-")[0];
  const lang = ["en", "de"].includes(browserLang) ? browserLang : "en";
  setLanguage(lang);
  langSwitcher?.addEventListener("click", (event) => {
    const target = event.target;
    if (target.tagName === "BUTTON") {
      const selectedLang = target.getAttribute("data-lang");
      if (selectedLang) {
        setLanguage(selectedLang);
      }
    }
  });
}
function setupAnimations() {
  const timelineItems = document.querySelectorAll(
    ".timeline-item"
  );
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("float-in");
        }
      });
    },
    {
      threshold: 0.1
    }
  );
  timelineItems.forEach((item) => {
    observer.observe(item);
  });
}
document.addEventListener("DOMContentLoaded", () => {
  setupThemeSwitcher();
  setupLocalization();
  setupAnimations();
});
