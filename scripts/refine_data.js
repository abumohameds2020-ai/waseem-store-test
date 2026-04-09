const fs = require('fs');
const path = require('path');

const PRODUCTS_MASTER_PATH = path.join(__dirname, '../products_master.json');
const DATA_JSON_PATH = path.join(__dirname, '../data.json');

function refine() {
    console.log("LOG: Starting data refinement...");
    
    if (!fs.existsSync(PRODUCTS_MASTER_PATH)) {
        console.error("LOG ERROR: products_master.json not found.");
        return;
    }
    
    const masterData = JSON.parse(fs.readFileSync(PRODUCTS_MASTER_PATH, 'utf8'));
    const dataJson = JSON.parse(fs.readFileSync(DATA_JSON_PATH, 'utf8'));
    
    const existingModelsMap = new Map();
    dataJson.models.forEach(m => existingModelsMap.set(m.id, m));
    
    const newModels = [];
    
    masterData.forEach(item => {
        // 1. Better Image Selection for Product Hero
        let bestProductImage = item.images.product;
        if (bestProductImage.includes('icon-dropdown.webp') || bestProductImage.includes('logo')) {
            // Try to find a better one in all_internal_assets that looks like a product photo
            const candidates = item.all_internal_assets.filter(img => 
                !img.includes('icon') && !img.includes('graph') && !img.includes('logo')
            );
            if (candidates.length > 0) {
                bestProductImage = candidates[0];
            } else {
                // Fallback to official pattern if possible, or keep original if nothing else
                bestProductImage = `https://kz-audio.com/pub/media/catalog/product/${item.id.replace('kz-', '').charAt(0)}/${item.id.replace('kz-', '').charAt(1)}/${item.id.replace('kz-', '').replace(/-/g, '')}_1.jpg`;
            }
        }

        const internalImage = item.images.internal || (item.all_internal_assets.length > 0 ? item.all_internal_assets[0] : "");

        if (existingModelsMap.has(item.id)) {
            // Update existing
            const existing = existingModelsMap.get(item.id);
            existing.images.internal = internalImage;
            existing.all_internal_assets = item.all_internal_assets;
            // Only update product image if the current one is broken or lower quality
            if (!existing.images.product || existing.images.product.includes('placeholder')) {
                existing.images.product = bestProductImage;
            }
        } else {
            // Create New
            const category = item.id.startsWith('kz-pr') ? 'Planar' :
                           item.id.startsWith('kz-as') ? 'Balanced Armature' :
                           item.id.startsWith('kz-zs') ? 'Hybrid' :
                           item.id.startsWith('kz-ed') ? 'Dynamic' : 'Audiophile';
            
            const newModel = {
                id: item.id,
                name: item.name,
                category: category,
                driver_config: category === 'Planar' ? '13.2mm Planar Driver' : 'High-Performance Driver System',
                specs: {
                    frequency_response: "20Hz-40kHz",
                    impedance: "24Ω",
                    sensitivity: "110dB"
                },
                signature: "Balanced",
                price_range: "Mid-range",
                images: {
                    product: bestProductImage,
                    internal: internalImage
                },
                all_internal_assets: item.all_internal_assets,
                links: {
                    official: item.url
                }
            };
            newModels.push(newModel);
        }
    });

    dataJson.models.push(...newModels);
    
    // Sort models: Curated ones first (by ID presence in original set), then others
    const originalOrder = ["kz-pr3", "kz-zs10-pro-x", "kz-zsn-pro-x", "kz-castor", "kz-krila", "kz-as24", "kz-ast", "kz-asx", "kz-zs10-pro-2", "kz-symphony", "kz-phantom"];
    
    dataJson.models.sort((a, b) => {
        const indexA = originalOrder.indexOf(a.id);
        const indexB = originalOrder.indexOf(b.id);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.name.localeCompare(b.name);
    });

    fs.writeFileSync(DATA_JSON_PATH, JSON.stringify(dataJson, null, 2));
    console.log(`LOG: Refinement complete! Total models in data.json: ${dataJson.models.length}`);
}

refine();
