const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(__dirname, '../public/assets/primary/Thunderbit_cb7a65_20260407_201914.csv');
const INTERNAL_ASSETS_DIR = path.join(__dirname, '../public/assets/internal');
const OUTPUT_PATH = path.join(__dirname, '../data.json');

function parseCSV(csvText) {
    const result = [];
    let currentRow = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 0; i < csvText.length; i++) {
        const char = csvText[i];
        const nextChar = csvText[i + 1];

        if (inQuotes) {
            if (char === '"' && nextChar === '"') {
                // Handle escaped quotes
                currentField += '"';
                i++;
            } else if (char === '"') {
                inQuotes = false;
            } else {
                currentField += char;
            }
        } else {
            if (char === '"') {
                inQuotes = true;
            } else if (char === ',') {
                currentRow.push(currentField.trim());
                currentField = '';
            } else if (char === '\n' || (char === '\r' && nextChar === '\n')) {
                if (char === '\r') i++;
                currentRow.push(currentField.trim());
                result.push(currentRow);
                currentRow = [];
                currentField = '';
            } else {
                currentField += char;
            }
        }
    }
    // Push final field/row if any
    if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        result.push(currentRow);
    }

    const headers = result[0].map(h => h.replace(/^"|"$/g, '').trim());
    return result.slice(1).map(row => {
        const obj = {};
        headers.forEach((h, index) => {
            obj[h] = row[index] || "";
        });
        return obj;
    });
}

function findBestImages(productDir) {
    let images = { product: '', internal: '', all: [] };
    if (!fs.existsSync(productDir)) return images;

    function walkDir(dir) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                walkDir(fullPath);
            } else if (file.match(/\.(webp|png|jpg|jpeg)$/i)) {
                // Get relative path for public usage
                const relativePath = '/assets/internal' + fullPath.split('internal')[1].replace(/\\/g, '/');
                images.all.push(relativePath);
                
                const lowerFile = file.toLowerCase();
                // Strategy for primary product image
                if (!images.product && (lowerFile.includes('-01.') || lowerFile.includes('main-card') || lowerFile.includes('hero'))) {
                    images.product = relativePath;
                }
                // Strategy for internal structural image
                if (!images.internal && (lowerFile.includes('-03.') || lowerFile.includes('-04.') || lowerFile.includes('internal') || lowerFile.includes('structure'))) {
                    images.internal = relativePath;
                }
            }
        }
    }

    walkDir(productDir);
    
    // Fallback if patterns didn't match
    if (!images.product && images.all.length > 0) images.product = images.all[0];
    if (!images.internal && images.all.length > 1) images.internal = images.all.find(img => img.includes('-03') || img.includes('-04')) || images.all[1];
    
    return images;
}

function process() {
    console.log("🚀 Starting Data Processing...");
    
    if (!fs.existsSync(CSV_PATH)) {
        console.error("❌ CSV file not found at:", CSV_PATH);
        return;
    }

    const csvText = fs.readFileSync(CSV_PATH, 'utf8');
    const products = parseCSV(csvText);
    
    const models = [];

    products.forEach(p => {
        const name = p["Product Name"];
        if (!name) return;

        const id = name.toLowerCase().replace(/ /g, '-');
        
        // Find local assets if they exist
        // The user unzipped them into folders that might have spaces or different case
        const possibleDirs = [
            path.join(INTERNAL_ASSETS_DIR, name),
            path.join(INTERNAL_ASSETS_DIR, id),
            path.join(INTERNAL_ASSETS_DIR, name.replace('KZ ', 'kz-'))
        ];
        
        let localAssets = { product: '', internal: '', all: [] };
        for (const dir of possibleDirs) {
            if (fs.existsSync(dir)) {
                localAssets = findBestImages(dir);
                break;
            }
        }

        // Categorization logic
        let category = "Audiophile";
        const desc = (p["Product Description"] || "").toLowerCase();
        if (desc.includes("planar")) category = "Planar";
        else if (desc.includes("hybrid")) category = "Hybrid";
        else if (desc.includes("dynamic")) category = "Dynamic";
        else if (desc.includes("balanced armature")) category = "Balanced Armature";
        else if (id.startsWith('kz-pr')) category = "Planar";
        else if (id.startsWith('kz-zs')) category = "Hybrid";
        else if (id.startsWith('kz-ed')) category = "Dynamic";

        const specs = {
            frequency_response: p["Frequency Response"] || "20Hz-40kHz",
            impedance: (p["Impedance"] || "24") + "Ω",
            sensitivity: p["Sensitivity"] || "110dB"
        };

        // Signature inference
        let signature = "Balanced";
        if (category === "Planar") signature = "Analytical";
        if (desc.includes("v-shaped") || desc.includes("bass")) signature = "Fun";
        if (desc.includes("transparent") || desc.includes("monitoring")) signature = "Balanced";

        models.push({
            id,
            name,
            category,
            driver_config: p["Product Description"] || category + " High-Performance Driver",
            specs,
            signature,
            price_range: "Mid-range", // Could be inferred from price if available
            images: {
                product: localAssets.product || p["Product Image"] || "/images/icon-dropdown.webp",
                internal: localAssets.internal || ""
            },
            all_internal_assets: localAssets.all,
            links: {
                official: p["Product URL"] || ""
            }
        });
    });

    const finalData = {
        models: models
    };

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(finalData, null, 2));
    console.log(`✅ SUCCESS! Processed ${models.length} products.`);
    console.log(`📄 data.json updated at: ${OUTPUT_PATH}`);
}

process();
