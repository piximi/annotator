import i18n, { InitOptions } from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./translations/en.json";
import fr from "./translations/fr.json";

const resources = {
  en: en,
  fr: fr,
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
