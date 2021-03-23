import { useSelector } from "react-redux";
import { languageSelector } from "../../store/selectors/languageSelector";
import { de, en, fi, gr, hi, hu } from "../../translations/";
import { Language } from "../../types/Language";
import fr from "../../translations/fr";

export const useTranslation = () => {
  const language = useSelector(languageSelector);

  const t = (word: string) => {
    switch (language) {
      case Language.English:
        if (!en.translation[word]) return word;
        return en.translation[word];
      case Language.Finnish:
        if (!fi.translation[word]) return word;
        return fi.translation[word];
      case Language.French:
        if (!fr.translation[word]) return word;
        return fr.translation[word];
      case Language.German:
        if (!de.translation[word]) return word;
        return de.translation[word];
      case Language.Greek:
        if (!gr.translation[word]) return word;
        return gr.translation[word];
      case Language.Hindi:
        if (!hi.translation[word]) return word;
        return hi.translation[word];
      case Language.Hungarian:
        if (!hu.translation[word]) return word;
        return hu.translation[word];
      default:
        return word;
    }
  };

  return t;
};
