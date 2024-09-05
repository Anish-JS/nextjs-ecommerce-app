import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | null;
}
const dbBase = globalThis.prisma || new PrismaClient();

export const db = dbBase.$extends({
  query: {
    cart: {
      async update({ args, query }) {
        args.data = { ...args.data, updatedAt: new Date() };
        return query(args);
      },
    },
  },
});

if (process.env.NODE_ENV !== "production") globalThis.prisma = dbBase;
