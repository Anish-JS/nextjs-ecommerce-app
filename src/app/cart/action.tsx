"use server";

import { revalidatePath } from "next/cache";
import createCart, { getCart } from "../lib/db/cart";
import { db } from "../lib/db/prisma";

const setProductQuantity = async (productId: string, quantity: number) => {
  const cart = (await getCart()) ?? (await createCart());
  const articleInCart = cart.items.find((item) => item.productId === productId);

  if (quantity === 0) {
    if (articleInCart)
      await db.cartItem.delete({
        where: { id: articleInCart.id },
      });
  } else {
    if (articleInCart) {
      await db.cartItem.update({
        where: { id: articleInCart.id },
        data: { quantity: quantity },
      });
    } else {
      await db.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity: quantity,
        },
      });
    }
  }

  revalidatePath("/cart");
};

export default setProductQuantity;
