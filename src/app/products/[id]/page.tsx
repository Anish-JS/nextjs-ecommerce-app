import { db } from "@/app/lib/db/prisma";
import PriceTag from "@/components/PriceTag";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cache } from "react";
import AddToCartButton from "./AddToCartButton";
import IncrementProductQuantity from "./actions";

interface ProductPageProps {
  params: { id: string };
}

const getProduct = cache(async (id: string) => {
  const product = await db.product.findUnique({
    where: { id },
  });

  if (!product) notFound();
  return product;
}); //Caching in react to avoid calling db twice for the same product as it is required in the metadata and in the product page

export async function generateMetadata({
  params: { id },
}: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(id);
  return {
    title: `${product.name} - Shoemakers' Lane`,
    description: product.description,
    openGraph: {
      images: [{ url: product.imageUrl }],
    },
  };
}

const ProductPage = async ({ params: { id } }: ProductPageProps) => {
  const product = await getProduct(id);

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-center">
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={500}
        height={500}
        className="rounded-lg"
        priority
      />
      <div>
        <h1 className="text-5xl font-bold">{product.name}</h1>
        <PriceTag price={product.price} className="mt-4" />
        <p className="py-6">{product.description}</p>
        <AddToCartButton
          productId={product.id}
          incrementProductQuantity={IncrementProductQuantity}
        />
      </div>
    </div>
  );
};

export default ProductPage;
