import Storefront from "@/components/Storefront";
import fs from 'fs';
import path from 'path';
import MaintenancePage from '@/components/MaintenancePage';

export default function Home() {
  const DATA_PATH = path.join(process.cwd(), 'products_master.json');
  let maintenanceMode = false;
  let products = [];
  let sliderConfig = { slides: [], transitionSpeed: 5000, enableAutoplay: true };
  
  let fullConfig = null;
  let cms = null;
  
  try {
    if (fs.existsSync(DATA_PATH)) {
      const fileContent = fs.readFileSync(DATA_PATH, 'utf8');
      fullConfig = JSON.parse(fileContent);
      maintenanceMode = fullConfig.settings?.maintenanceMode || false;
      products = fullConfig.products || [];
      sliderConfig = fullConfig.slider || sliderConfig;
      cms = fullConfig.cms || null;
    }
  } catch (err) {
    console.error('Failed to read data:', err);
  }

  if (maintenanceMode) {
    return <MaintenancePage />;
  }

  return (
    <Storefront 
      products={products} 
      sliderConfig={sliderConfig} 
      cms={cms}
      fullConfig={fullConfig}
    />
  );
}
