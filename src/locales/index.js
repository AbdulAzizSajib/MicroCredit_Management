import { createI18n } from "vue-i18n";
import en from "./en.json";
import bn from "./bn.json";

const savedLocale = localStorage.getItem("locale") || "en";

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: savedLocale,
  fallbackLocale: "en",
  messages: {
    en,
    bn,
  },
});

export default i18n;

export function setLocale(locale) {
  i18n.global.locale.value = locale;
  localStorage.setItem("locale", locale);
}
