console.log("LOG: Script started...");
const fs = require('fs');
const path = require('path');

const sitemapPath = path.join(__dirname, '../sitemap.xml');
console.log("LOG: Looking for sitemap at:", sitemapPath);

if (fs.existsSync(sitemapPath)) {
    const data = fs.readFileSync(sitemapPath, 'utf8');
    console.log("LOG: Sitemap loaded. Size:", data.length, "chars");
    
    const { XMLParser } = require('fast-xml-parser');
    const parser = new XMLParser();
    const jsonObj = parser.parse(data);
    
    if (jsonObj && jsonObj.urlset && jsonObj.urlset.url) {
        console.log("LOG: URLs found in XML:", jsonObj.urlset.url.length);
        console.log("LOG: First URL:", jsonObj.urlset.url[0].loc);
    } else {
        console.error("LOG ERROR: Failed to parse XML structure correctly.");
    }
} else {
    console.error("LOG ERROR: Sitemap file missing.");
}

console.log("LOG: Debug finished.");
