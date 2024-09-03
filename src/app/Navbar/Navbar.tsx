import Link from "next/link";
import { redirect } from "next/navigation";
import { getCart } from "../lib/db/cart";
import ShoppingCartButton from "./ShoppingCartButton";

async function searchProducts(formData: FormData) {
  "use server";
  const searchQuery = formData.get("searchQuery")?.toString();
  if (searchQuery) {
    redirect("/search?query=" + searchQuery);
  }
}

const Navbar = async () => {
  const cart = await getCart();
  return (
    <div className="bg-base-100">
      <div className="navbar max-w-7xl m-auto flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <Link
            href="/"
            className="btn-ghost text-xl normal-case p-1 rounded-md font-bold"
          >
            {/* Image */}
            Shoemakers' Lane
          </Link>
        </div>
        <div className="flex-none gap-1">
          <form action={searchProducts}>
            <div className="form-control">
              <input
                name="searchQuery"
                placeholder="Search"
                className="input input-bordered w-full min-w-[100px]"
              />
            </div>
          </form>
          <ShoppingCartButton cart={cart} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
