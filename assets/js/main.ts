function setupThemeSwitcher() {
    const themeToggle = document.getElementById("theme-toggle");
    const htmlElement = document.documentElement;

    // Theme switcher logic
    const prefersDark =
        window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Set initial theme based on OS preference
    if (prefersDark) {
        htmlElement.setAttribute("data-theme", "dark");
    } else {
        htmlElement.setAttribute("data-theme", "light"); // Explicitly set light if not dark
    }

    themeToggle?.addEventListener("click", () => {
        const currentTheme = htmlElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        htmlElement.setAttribute("data-theme", newTheme);
    });
}

let translations: any = {};

function getTranslation(key: string): string | string[] {
    return key.split(".").reduce(
        (obj, i) => (obj ? obj[i] : null),
        translations,
    );
}

async function setLanguage(lang: string) {
    const response = await fetch(`assets/locales/${lang}.json`);
    translations = await response.json();

    document.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.getAttribute("data-i18n");
        if (key) {
            const translation = getTranslation(key) as string;
            if (translation) {
                element.innerHTML = translation;
            }
        }
    });

    document.querySelectorAll("[data-i18n-list]").forEach((element) => {
        const key = element.getAttribute("data-i18n-list");
        if (key) {
            const translation = getTranslation(key) as string[];
            if (translation && Array.isArray(translation)) {
                element.innerHTML = translation.map((item: string) =>
                    `<li>${item}</li>`
                ).join("");
            }
        }
    });

    // Update active button style
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
        const target = event.target as HTMLElement;
        if (target.tagName === "BUTTON") {
            const selectedLang = target.getAttribute("data-lang");
            if (selectedLang) {
                setLanguage(selectedLang);
            }
        }
    });
}

function setupAnimations() {
    const timelineItems: NodeListOf<Element> = document.querySelectorAll(
        ".timeline-item",
    );

    const observer = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry: IntersectionObserverEntry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("float-in");
                }
            });
        },
        {
            threshold: 0.1,
        },
    );

    timelineItems.forEach((item: Element) => {
        observer.observe(item);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupThemeSwitcher();
    setupLocalization();
    setupAnimations();
});
