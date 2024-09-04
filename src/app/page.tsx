import Image from "next/image";
import { db } from "./lib/db/prisma";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import PaginationBar from "@/components/PaginationBar";

export default async function Home() {
  const products = await db.product.findMany({
    orderBy: { id: "desc" },
  });
  return (
    <div className="flex flex-col items-center">
      <div className="hero rounded-xl bg-base-200">
        <div className="hero-content flex-col lg:flex-row ">
          <Image
            src={products[0].imageUrl}
            alt={products[0].name}
            width={400}
            height={800}
            className="w-full max-w-sm  rounded-lg shadow-2xl"
            priority
          />
          <div>
            <h1 className="text-5xl font-bold">{products[0].name} </h1>
            <p className="py-6"> {products[0].description}</p>
            <Link
              href={`/products/${products[0].id}`}
              className="btn btn-primary"
            >
              Check it out
            </Link>
          </div>
        </div>
      </div>
      {/* <ProductCard product={products[0]}></ProductCard> */}
      <div className="my-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {products.slice(1).map((product) => {
          return <ProductCard product={product} key={product.id} />;
        })}
      </div>

      <PaginationBar currentPage={3} totalPages={15} />
    </div>
  );
}
