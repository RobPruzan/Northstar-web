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
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
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
