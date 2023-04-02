import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
type WhereClause =
  | {
      type: string;
    }
  | {
      name: {
        equals: string;
      };
    };
export const paginationRouter = createTRPCRouter({
  getContent: protectedProcedure
    .input(
      z.object({
        page: z.number(),
        limit: z.number(),
        type: z.string(),
        searchName: z.string().optional(),
      })
    )
    .query(({ ctx, input }) => {
      let whereClause: WhereClause = {
        type: input.type,
      };

      if (input.searchName) {
        whereClause = {
          name: {
            equals: input.searchName,
          },
        };
      }

      return ctx.prisma.collection.findMany({
        skip: (input.page - 1) * input.limit,
        take: input.limit,
        include: {
          Documents: true,
        },
        where: whereClause,
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
  getTotalPages: protectedProcedure
    .input(
      z.object({
        pageSize: z.number(),
        type: z.string(),
        searchName: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      let whereClause: WhereClause = {
        type: input.type,
      };
      if (input.searchName) {
        whereClause = {
          name: {
            equals: input.searchName,
          },
        };
      }

      return Math.max(
        Math.ceil(
          (await ctx.prisma.collection
            .findMany({
              where: whereClause,

              orderBy: {
                createdAt: "desc",
              },
            })
            .then((res) => res.length)) / input.pageSize
        ),
        1
      );
    }),
});
