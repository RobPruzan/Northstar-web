import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter, userRouter } from "~/server/api/routers/example";
import { documentRouter } from "./routers/documentRouter";
import { collectionRouter } from "./routers/collectionRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  user: userRouter,
  document: documentRouter,
  collection: collectionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
