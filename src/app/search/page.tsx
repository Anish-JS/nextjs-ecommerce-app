import ProductCard from "@/components/ProductCard";
import { db } from "../lib/db/prisma";
import { Metadata } from "next";
import PaginationBar from "@/components/PaginationBar";

interface SearchPageProps {
  searchParams: { query: string; page: string };
}

export function generateMetadata({
  searchParams: { query },
}: SearchPageProps): Metadata {
  return {
    title: `Search: ${query} - Shoemakers' Lane`,
  };
}

export default async function SearchPage({
  searchParams: { query, page = "1" },
}: SearchPageProps) {
  //   const currentPage = parseInt(page);
  //   const pageSize = 6;

  //   const totalItemCount = await db.product.count({
  //     where: {
  //       OR: [
  //         { name: { contains: query, mode: "insensitive" } },
  //         { description: { contains: query, mode: "insensitive" } },
  //       ],
  //     },
  //   });

  //   const totalPages = Math.ceil((totalItemCount - 1) / pageSize);
  const products = await db.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { id: "desc" },
    // skip: (currentPage - 1) * pageSize,
    // take: pageSize,
  });

  if (products.length === 0) {
    return <div className="text-center">No Products Found</div>;
  }

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-2">
          {products.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
        {/* {totalPages > 1 && (
          <PaginationBar totalPages={totalPages} currentPage={currentPage} />
        )} */}
      </div>
    </>
  );
}
