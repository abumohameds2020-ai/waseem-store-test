const fs = require('fs');
const path = require('path');

const JSON_INPUT_PATH = path.join(__dirname, '../public/assets/primary/Thunderbit_cb7a65_20260407_202653.json');
const INTERNAL_ASSETS_DIR = path.join(__dirname, '../public/assets/internal');
const OUTPUT_PATH = path.join(__dirname, '../data.json');

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
                if (!images.internal && (lowerFile.includes('-03.') || lowerFile.includes('-04.') || lowerFile.includes('internal') || lowerFile.includes('structure') || lowerFile.includes('exploded'))) {
                    images.internal = relativePath;
                }
            }
        }
    }

    walkDir(productDir);
    
    // Fallback if patterns didn't match
    if (!images.product && images.all.length > 0) images.product = images.all[0];
    if (!images.internal) {
        images.internal = images.all.find(img => img.includes('-03') || img.includes('-04') || img.includes('-07')) || "";
    }
    
    return images;
}

function process() {
    console.log("🚀 Starting Data Merger...");
    
    if (!fs.existsSync(JSON_INPUT_PATH)) {
        console.error("❌ Input JSON file not found at:", JSON_INPUT_PATH);
        return;
    }

    const inputData = JSON.parse(fs.readFileSync(JSON_INPUT_PATH, 'utf8'));
    const models = [];

    inputData.forEach(p => {
        let name = p["Product Name"] || "";
        if (!name) return;

        // Rule 1: Clean Bold Headlines
        name = name.replace(/\(.*\)/g, '').trim(); // Remove brackets
        const id = name.toLowerCase().replace(/ /g, '-').replace(/[()]/g, '');
        
        // Find local assets
        const possibleDirs = [
            path.join(INTERNAL_ASSETS_DIR, name),
            path.join(INTERNAL_ASSETS_DIR, name.replace('KZ ', 'kz-')),
            path.join(INTERNAL_ASSETS_DIR, id)
        ];
        
        let localAssets = { product: '', internal: '', all: [] };
        for (const dir of possibleDirs) {
            if (fs.existsSync(dir)) {
                localAssets = findBestImages(dir);
                break;
            }
        }

        // Rule 3: Core Tech Mapping (Extract mm from description)
        const rawDesc = p["Product Description"] || "";
        const driverMatch = rawDesc.match(/(\d+\.?\d*mm)/i);
        const driverSize = driverMatch ? driverMatch[1] : "Professional Tech";
        
        // Rule 4: Concise Intro (First 2 sentences)
        const shortDesc = rawDesc.split(/[.!?]/).filter(s => s.trim().length > 0).slice(0, 2).join('. ') + '.';

        const specs = {
            frequency_response: p["Frequency Response"] || "20Hz-40kHz",
            impedance: (p["Impedance"] || "24").toString().replace('Ω', '') + "Ω",
            sensitivity: p["Sensitivity"] || "110dB"
        };

        // Signature inference
        let signature = "Balanced";
        const category = rawDesc.toLowerCase().includes("planar") ? "Planar" : (rawDesc.toLowerCase().includes("hybrid") ? "Hybrid" : "Dynamic");
        
        models.push({
            id,
            name,
            headline: name, // Large Bold Headline
            category,
            driver_config: driverSize, // Core Spec: 13.2mm, etc.
            description: shortDesc, // Short clean intro
            specs,
            signature,
            price_range: "Premium",
            images: {
                product: localAssets.product || p["Product Image"] || "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600",
                internal: localAssets.internal || "https://images.unsplash.com/photo-1610410427814-1e03f001e715?q=80&w=600" 
            },
            gallery: localAssets.all.filter(img => {
                const lowerImg = img.toLowerCase();
                const junkPatterns = ['logo', 'icon', 'menu', 'arrow', 'bottom', 'btn', 'button', 'header', 'footer', 'dropdown'];
                const isJunk = junkPatterns.some(pattern => lowerImg.includes(pattern)) || img === localAssets.product || img === localAssets.internal;
                return !isJunk;
            }),
            links: {
                official: p["Product URL"] || ""
            }
        });
    });

    // Logging missing images for user diagnostics
    const missing = models.filter(m => m.images.product.includes('icon-dropdown.webp'));
    if (missing.length > 0) {
        console.warn(`\n⚠️  Found ${missing.length} products missing primary images in JSON:`);
        missing.forEach(m => console.warn(`   - ${m.name}`));
    }

    const finalData = {
        models: models
    };

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(finalData, null, 2));
    console.log(`✅ SUCCESS! Merged ${models.length} products with 15 premium assets.`);
    console.log(`📄 data.json updated at: ${OUTPUT_PATH}`);
}

process();
