import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import ProductPageContent from '@/components/product/ProductPageContent';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

async function getProductData(id: string) {
  const DATA_PATH = path.join(process.cwd(), 'products_master.json');
  if (!fs.existsSync(DATA_PATH)) return null;

  const fileContent = fs.readFileSync(DATA_PATH, 'utf8');
  const data = JSON.parse(fileContent);
  const product = data.products.find((p: any) => p.id === id);
  return product || null;
}

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const product = await getProductData(params.id);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: product.meta_title || `${product.name} | KZ Phantom Premium Audio`,
    description: product.description || `Experience the engineering of ${product.name}.`,
    keywords: product.meta_keywords || `KZ, ${product.name}, IEM, Planar, Audiophile, Audio Engineering`,
    openGraph: {
      title: product.meta_title || product.name,
      description: product.description,
      images: [product.images.product],
    },
  };
}

export default async function ProductPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const product = await getProductData(params.id);

  if (!product) {
    notFound();
  }

  return (
    <main className="bg-[#050505] min-h-screen selection:bg-blue-500 selection:text-white">
      <Navbar />
      <ProductPageContent product={product} />
      <Footer />
    </main>
  );
}
