import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const paginationRouter = createTRPCRouter({
  getContent: protectedProcedure
    .input(
      z.object({
        page: z.number(),
        limit: z.number(),
        type: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.collection.findMany({
        skip: (input.page - 1) * input.limit,
        take: input.limit,
        include: {
          Documents: true,
        },
        where: {
          type: input.type,
        },
      });
    }),
  getTotalPages: protectedProcedure
    .input(z.object({ pageSize: z.number(), type: z.string() }))
    .query(async ({ ctx, input }) =>
      Math.max(
        Math.ceil(
          (await ctx.prisma.collection
            .findMany({
              where: {
                type: input.type,
              },
            })
            .then((res) => res.length)) / input.pageSize
        ),
        1
      )
    ),
});
