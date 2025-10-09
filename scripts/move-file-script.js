import fs from "fs";
import path from "path";

export default async function MoveFileScript(initialPath, finalDir, fileName) {
    const sourcePath = path.resolve(initialPath);
    const destinationDir = path.resolve(finalDir);
    const destinationPath = path.join(destinationDir, fileName);

    await fs.copyFileSync(sourcePath, destinationPath);
    return console.log(`✅ Fichier manifest.js déplacé vers ${destinationPath}`);
}