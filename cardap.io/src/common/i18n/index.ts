import i18n from "i18next";
import { initReactI18next, Trans } from "react-i18next";
import translationPT from "./pt-BR";

const languages = {
  "pt-BR": {
    translation: translationPT,
  },
};

type TLanguage = keyof typeof languages;

i18n.use(initReactI18next).init({
  returnNull: false,
  lng: "pt-BR",
  load: "currentOnly",
  resources: languages,
  debug: false,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

export { Trans };

export type { TLanguage };
