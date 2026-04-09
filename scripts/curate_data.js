const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../data.json');
const TARGET_NAMES = [
    'KZ Duonic',
    'KZ PRX',
    'KZ PR3',
    'KZ PR2',
    'KZ ZS12 Pro X',
    'KZ ZS10 Pro 2',
    'KZ Symphony',
    'KZ ZSN PRO 2',
    'KZ ZAT',
    'KZ Krila',
    'KZ Phantom'
];

function curate() {
    if (!fs.existsSync(DATA_PATH)) {
        console.error("❌ data.json not found!");
        return;
    }

    const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    
    // Filter models
    const filteredModels = data.models.filter(m => {
        return TARGET_NAMES.includes(m.name);
    });

    data.models = filteredModels;

    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
    console.log(`✅ SUCCESS! Curated database to ${filteredModels.length} premium products.`);
    filteredModels.forEach(m => console.log(`   - ${m.name}`));
}

curate();
