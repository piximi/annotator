import { useSelector } from "react-redux";
import { languageSelector } from "../../store/selectors/languageSelector";
import { de, en, fi } from "../../translations/";
import { Language } from "../../types/Language";

export const useTranslation = () => {
  const language = useSelector(languageSelector);

  const t = (word: string) => {
    switch (language) {
      case Language.German:
        return "a german word";
      default:
        return "Another word";
    }
  };

  return t;
};
