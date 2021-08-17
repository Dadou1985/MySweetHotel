import i18next from "i18next";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

const apiKey = "zTKetbrLoCQeMx6J0wYfmg";
const loadPath = `https://api.i18nexus.com/project_resources/translations/{{lng}}/{{ns}}.json?api_key=${apiKey}`;

i18next
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: "fr",

    ns: ["default"],
    defaultNS: "default",

    supportedLngs: ["fr","en","es","de","it","pt"],
    
    backend: {
      loadPath: loadPath
    }
  })