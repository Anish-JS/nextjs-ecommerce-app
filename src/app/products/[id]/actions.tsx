"use server";

import createCart, { getCart } from "@/app/lib/db/cart";
import { db } from "@/app/lib/db/prisma";
import { revalidatePath } from "next/cache";

const IncrementProductQuantity = async (productId: string) => {
  const cart = (await getCart()) ?? (await createCart());

  const articleInCart = cart.items.find((item) => item.productId === productId);
  if (articleInCart) {
    await db.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        items: {
          update: {
            where: { id: articleInCart.id },
            data: { quantity: { increment: 1 } },
          },
        },
      },
    });
  } else {
    await db.cart.update({
      where: { id: cart.id },
      data: {
        items: {
          create: {
            productId,
            quantity: 1,
          },
        },
      },
    });
  }

  revalidatePath("/products/[id]");
};

export default IncrementProductQuantity;
