import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});

export const userRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => ctx.prisma.user.findMany()),

  getOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) =>
      ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
      })
    ),
});

export const documentRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => ctx.prisma.document.findMany()),
});
