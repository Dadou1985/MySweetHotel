import fs from "fs";
import path from "path";

export default async function InjectFileToHtmlScript(targetedFilePath, filePath) {
    const indexPath = path.resolve(targetedFilePath);
    let html = fs.readFileSync(indexPath, "utf8");

    // On cherche la balise </head> pour injecter juste avant
    html = html.replace(
        "</head>",
        `  <script src="${filePath}"></script>\n</head>`
    );

    await fs.writeFileSync(indexPath, html, "utf8");
    console.log(`✅ Balise <script src="${filePath}"> injectée avec succès dans index.html`);
}