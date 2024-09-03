import { cookies } from "next/dist/client/components/headers";
import { db } from "./prisma";
import { Cart, CartItem, Product, Prisma } from "@prisma/client";

export type CartWithProducts = Prisma.CartGetPayload<{
  include: {
    items: {
      include: {
        product: true;
      };
    };
  };
}>;

export type ShoppingCart = CartWithProducts & {
  size: number;
  subtotal: number;
};
export async function getCart(): Promise<ShoppingCart | null> {
  const localCartId = cookies().get("localCartId")?.value;
  const cart = localCartId
    ? await db.cart.findUnique({
        where: { id: localCartId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })
    : null;

  if (!cart) {
    return null;
  }
  return {
    ...cart,
    size: cart.items.reduce((acc, curr) => acc + curr.quantity, 0),
    subtotal: cart.items.reduce(
      (acc, curr) => acc + curr.quantity * curr.product.price,
      0
    ),
  };
}

const createCart = async (): Promise<ShoppingCart> => {
  const newCart = await db.cart.create({
    data: {},
  });
  cookies().set("localCartId", newCart.id); //if user not logged in we provide support for anonymous carts. Finding if a user belongs to a particular cart
  //this is not ver safe. Always encrypt the cart id or else it is easy for user to change another user's cart items.
  //Add additional security to cookies
  return {
    ...newCart,
    items: [],
    size: 0,
    subtotal: 0,
  };
};

export default createCart;
