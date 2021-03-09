import i18n, { InitOptions } from "i18next";
import { initReactI18next } from "react-i18next";
import { de, en, fi, hi, hu, se, gr } from "./translations";

const resources = {
  de: de,
  en: en,
  fi: fi,
  hi: hi,
  hu: hu,
  se: se,
  gr: gr,
};

const options: InitOptions = {
  resources,
  interpolation: { escapeValue: false },
  keySeparator: false,
  lng: "en",
};

i18n
  .use(initReactI18next)
  .init(options)
  .then(() => {});

export default i18n;
