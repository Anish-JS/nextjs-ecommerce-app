import { getCart } from "../lib/db/cart";

export const metadata = {
  title: "Your Cart - Shoemakers' Lane",
};

const CartPage = async () => {
  const cart = await getCart();
  return (
    <div>
      <h1 className="text-3xl mb-6 font-bold">Shopping Cart</h1>
      {cart?.items.map(() => {
        return <></>;
      })}
    </div>
  );
};

export default CartPage;
