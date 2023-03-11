import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const documentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ title: z.string(), text: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.document.create({
        data: {
          title: input.title,
          text: input.text,
          userId: ctx.session?.user.id,
        },
      });
    }),
  getAll: protectedProcedure.query(
    async ({ ctx }) => await ctx.prisma.document.findMany()
  ),
  deleteOne: protectedProcedure
    .input(z.object({ documentId: z.string() }))
    .mutation(
      async ({ input, ctx }) =>
        await ctx.prisma.document.delete({
          where: {
            id: input.documentId,
          },
        })
    ),
  getAllUserDocuments: protectedProcedure.query(
    async ({ input, ctx }) =>
      await ctx.prisma.document.findMany({
        where: {
          userId: ctx.session.user.id,
        },
      })
  ),
});
