import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const paginationRouter = createTRPCRouter({
  getContent: protectedProcedure
    .input(
      z.object({
        page: z.number(),
        limit: z.number(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.collection.findMany({
        skip: (input.page - 1) * input.limit,
        take: input.limit,
        include: {
          Documents: true,
        },
      });
    }),
  getTotalPages: protectedProcedure
    .input(z.object({ pageSize: z.number() }))
    .query(async ({ ctx, input }) =>
      Math.max(
        Math.floor((await ctx.prisma.collection.count()) / input.pageSize),
        1
      )
    ),
});
