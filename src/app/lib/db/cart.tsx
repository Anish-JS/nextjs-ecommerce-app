import { cookies } from "next/dist/client/components/headers";
import { db } from "./prisma";
import { Cart, CartItem, Product, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export type CartWithProducts = Prisma.CartGetPayload<{
  include: {
    items: {
      include: {
        product: true;
      };
    };
  };
}>;

export type CartItemWithProduct = Prisma.CartItemGetPayload<{
  include: { product: true };
}>;

export type ShoppingCart = CartWithProducts & {
  size: number;
  subtotal: number;
};
export async function getCart(): Promise<ShoppingCart | null> {
  const session = await getServerSession(authOptions);

  let cart: CartWithProducts | null = null;
  if (session) {
    cart = await db.cart.findFirst({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  } else {
    const localCartId = cookies().get("localCartId")?.value;
    cart = localCartId
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
  }

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
  const session = await getServerSession(authOptions);

  let newCart: Cart;

  if (session) {
    newCart = await db.cart.create({
      data: { userId: session.user.id },
    });
  } else {
    newCart = await db.cart.create({
      data: {},
    });
    cookies().set("localCartId", newCart.id);
  }
  //if user not logged in we provide support for anonymous carts. Finding if a user belongs to a particular cart
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

export async function mergeAnonymousCartIntoUserCart(userId: string) {
  const localCartId = cookies().get("localCartId")?.value;
  const localCart = localCartId
    ? await db.cart.findUnique({
        where: { id: localCartId },
        include: {
          items: true,
        },
      })
    : null;

  if (!localCart) return;

  const userCart = await db.cart.findFirst({
    where: { userId },
    include: {
      items: true,
    },
  });

  await db.$transaction(async (tx) => {
    if (userCart) {
      const mergedCartItems = mergeCartItems(localCart?.items!, userCart.items);

      await tx.cartItem.deleteMany({
        where: { cartId: userCart.id },
      });

      await tx.cart.update({
        where: { id: userCart.id },
        data: {
          items: {
            createMany: {
              data: mergedCartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
              })),
            },
          },
        },
      });
    } else {
      await tx.cart.create({
        data: {
          userId,
          items: {
            createMany: {
              data: localCart?.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
              })),
            },
          },
        },
      });
    }
    await tx.cart.delete({
      where: { id: localCart.id },
    });

    cookies().set("localCartId", "");
  });
}

function mergeCartItems(...cartItems: CartItem[][]) {
  return cartItems.reduce((acc, items) => {
    items.forEach((item) => {
      const existingItem = acc.find((i) => item.productId == i.productId);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        acc.push(item);
      }
    });
    return acc;
  }, [] as CartItem[]);
}
