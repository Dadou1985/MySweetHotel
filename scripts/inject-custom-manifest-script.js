import InjectFileToHtmlScript from "./inject-file-to-html-script.js";
import MoveFileScript from "./move-file-script.js";

async function injectCustomManifestScript(initialPath, finalDir, fileName, targetedFilePath, filePath) {
    try {
        // Étape 1 : déplacer le fichier
        const movedFilePath = await MoveFileScript(initialPath, finalDir, fileName);
        console.log(`✅ Fichier déplacé : ${movedFilePath}`);
    
        // Étape 2 : injecter dans le HTML
        await InjectFileToHtmlScript(targetedFilePath, filePath);
        console.log(`✅ Script injecté : ${fileName}`);
    
      } catch (error) {
        console.error("❌ Erreur dans injectCustomManifestScript :", error);
      }
}

injectCustomManifestScript("./utils/manifest.js", "./web-build", "manifest.js", "./web-build/index.html", "/manifest.js");