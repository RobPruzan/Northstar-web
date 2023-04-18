import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const collectionRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.collection.findMany({
      include: {
        Documents: true,
      },
    });
  }),
  searchQuery: protectedProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.collection.findMany({
        where: {
          name: {
            // contains: input.name,
            // lower case version of both strings
            contains: input.name,
            mode: "insensitive",
          },
        },
        select: {
          name: true,
          type: true,
        },
        take: 20,
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        type: z.string(),
        documents: z.array(
          z.object({
            title: z.string(),
            text: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const collection = await ctx.prisma.collection.create({
        data: {
          name: input.name,
          type: input.type,
          totalDocuments: input.documents.length,
          Documents: {
            create: input.documents,
          },
        },
      });

      // await ctx.prisma.collection.update({
      //   where: {
      //     id: collection.id,
      //   },
      //   data: {
      //     collectionId: collection.id,
      //   }
      // })
      return collection;
    }),
});
