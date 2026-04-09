const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const { XMLParser } = require('fast-xml-parser');

const SITEMAP_PATH = path.join(__dirname, '../sitemap.xml');
const OUTPUT_PATH = path.join(__dirname, '../products_master.json');

async function scrapeProduct(url) {
  try {
    console.log(`Scraping: ${url}`);
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 15000
    });
    
    const $ = cheerio.load(html);
    
    const name = $('h1').first().text().trim() || url.split('/').pop().replace('.html', '').replace(/-/g, ' ').toUpperCase();
    const id = url.split('/').pop().replace('.html', '');
    
    // Extract Specs
    const specs = {
      impedance: '',
      sensitivity: '',
      frequency: '',
      driver: ''
    };

    // Try to find the spec grid
    $('.spec-grid .spec-item, .product-info-section .spec-item').each((i, el) => {
      const label = $(el).find('.spec-label').text().trim().toLowerCase();
      const value = $(el).find('.spec-value').text().trim();
      
      if (label.includes('impedance')) specs.impedance = value;
      else if (label.includes('sensitivity')) specs.sensitivity = value;
      else if (label.includes('frequency')) specs.frequency = value;
    });

    // Fallback for specs if the structure is different
    if (!specs.impedance) {
      $('td, span, p, div').each((i, el) => {
        const text = $(el).text().trim();
        if (text.includes('Ω') && text.length < 20) specs.impedance = text;
        if (text.includes('dB') && (text.includes('±') || /\d+dB/.test(text)) && text.length < 20) specs.sensitivity = text;
        if (text.match(/\d+-\d+Hz/) || text.match(/\d+Hz-\d+kHz/)) specs.frequency = text;
      });
    }

    // Extract Driver Config (usually at the top or in a specific section)
    const driverText = $('p, h2, h3').filter((i, el) => {
      const t = $(el).text();
      return t.includes('Driver') && (t.includes('Planar') || t.includes('Dynamic') || t.includes('BA') || t.includes('Hybrid'));
    }).first().text().trim();
    specs.driver = driverText || "High-Performance Driver System";

    const assets = {
      product: '',
      graph: '',
      internal: []
    };
    
    const allImages = [];
    $('img').each((i, el) => {
      let src = $(el).attr('src') || $(el).attr('data-src');
      if (!src) return;
      
      const fullSrc = src.startsWith('http') ? src : `https://kz-audio.com${src.startsWith('/') ? '' : '/'}${src}`;
      allImages.push(fullSrc);
    });

    // Strategy: 
    // - Primary Image: ends with -01.webp or _1.jpg, or is the first large image
    // - Internal: ends with -03.webp, -04.webp, -07.webp or contains structural keywords
    // - Graph: contains "graph" or "frequency"
    
    allImages.forEach(src => {
      const lowerSrc = src.toLowerCase();
      
      // Target High-Res Primary
      if (lowerSrc.includes('-01.') || lowerSrc.includes('_1.') || lowerSrc.includes('hero')) {
        if (!assets.product) assets.product = src;
      }
      
      // Target Internal structure
      const internalPatterns = ['-03.', '-04.', '-07.', 'internal', 'structure', 'exploded', 'blueprint', 'driver-layout'];
      if (internalPatterns.some(p => lowerSrc.includes(p))) {
        assets.internal.push(src);
      }
      
      // Target Graph
      if (lowerSrc.includes('graph') || lowerSrc.includes('frequency')) {
        if (!assets.graph) assets.graph = src;
      }
    });

    // Fallback for Primary if not found
    if (!assets.product && allImages.length > 0) {
      assets.product = allImages.find(img => !img.includes('icon') && !img.includes('logo')) || allImages[0];
    }
    
    // Fallback for Internal if not found
    if (assets.internal.length === 0 && allImages.length > 5) {
       assets.internal = allImages.slice(3, 8).filter(img => !img.includes('icon') && !img.includes('logo'));
    }

    return {
      id,
      name,
      url,
      specs,
      images: {
        product: assets.product,
        graph: assets.graph,
        internal: assets.internal[0] || ""
      },
      all_internal_assets: [...new Set(assets.internal)]
    };
  } catch (err) {
    console.error(`Error scraping ${url}:`, err.message);
    return null;
  }
}

async function main() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error('sitemap.xml not found at project root');
    return;
  }

  const xmlData = fs.readFileSync(SITEMAP_PATH, 'utf-8');
  const parser = new XMLParser();
  const jsonObj = parser.parse(xmlData);
  
  const urls = jsonObj.urlset.url
    .map(u => u.loc)
    .filter(url => 
      url.includes('.html') && 
      !url.includes('privacy-policy') && 
      !url.includes('contact') &&
      url !== 'https://kz-audio.com/'
    );

  console.log(`LOG: Found ${urls.length} product URLs total.`);
  console.log(`LOG: Initiating full harvest (Concurrency: 5)...`);
  
  const results = [];
  const CONCURRENCY = 5;
  
  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const batch = urls.slice(i, i + CONCURRENCY);
    console.log(`LOG: Processing batch ${Math.floor(i/CONCURRENCY) + 1}...`);
    const batchResults = await Promise.all(batch.map(url => scrapeProduct(url)));
    results.push(...batchResults.filter(Boolean));
    console.log(`LOG: Total progress: ${results.length}/${urls.length}`);
    
    // Polite delay for CDN
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2));
  console.log(`\n✅ HARVEST COMPLETE!`);
  console.log(`📄 Results saved to: ${OUTPUT_PATH}`);
  console.log(`📦 Total products captured: ${results.length}`);
}

main();
