import ShopEngine from "@/components/ShopEngine";
import fs from 'fs';
import path from 'path';

export default function ShopPage() {
  const DATA_PATH = path.join(process.cwd(), 'products_master.json');
  let products = [];
  
  try {
    if (fs.existsSync(DATA_PATH)) {
      const fileContent = fs.readFileSync(DATA_PATH, 'utf8');
      const fullConfig = JSON.parse(fileContent);
      products = fullConfig.products || [];
    }
  } catch (err) {
    console.error('Failed to read data for shop:', err);
  }

  return (
    <ShopEngine products={products} />
  );
}
