import { z } from "zod";
import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from "openai";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
// import {
//   answerPrompt,
//   getMerriamUrl,
//   matchGptDesiredTool,
//   prePrompt,
//   SUPPLEMENTAL_INFORMATION,
// } from "./gptHelpers";
export type ToolProvider = {
  name: string;
  getUrl?: (searchTerm: string) => string;
  toAnswerString?: (response: Response) => string | Promise<string>;
  headers: string;
  body: string;
};

// const soundSchema = z.object({
//   audio: z.string(),
// });

// const prsSchema = z.object({
//   mw: z.string(),
//   sound: soundSchema,
// });

// const dtSchema = z.array(z.tuple([z.string(), z.string()]));

// const sdsenseSchema = z.object({
//   sd: z.string(),
//   dt: dtSchema,
// });

// const senseSchema = z.object({
//   sn: z.string(),
//   dt: dtSchema,
//   sdsense: z.optional(sdsenseSchema),
// });

// const sseqSchema = z.array(z.array(z.tuple([z.string(), senseSchema])));

// const defSchema = z.array(
//   z.object({
//     sseq: sseqSchema,
//   })
// );

// const metaSchema = z.object({
//   id: z.string(),
//   uuid: z.string(),
//   src: z.string(),
//   section: z.string(),
//   stems: z.array(z.string()),
//   offensive: z.boolean(),
// });

// const hwiSchema = z.object({
//   hw: z.string(),
//   prs: z.array(prsSchema),
// });

// const merriamResponseScehma = z.object({
//   meta: metaSchema,
//   hom: z.number(),
//   hwi: hwiSchema,
//   fl: z.string(),
//   def: defSchema,
//   shortdef: z.array(z.string()),
// });

// export type MerriamResponse = z.infer<typeof merriamResponseScehma>;

// export type ValidToolProvider = "Wikipedia" | "Google" | "Merriam-Webster";

// export type ToolUsage = Record<ValidToolProvider, ToolProvider>;
// async function merriamResToAnswerString(response: Response) {
//   // const json = merriamResponseScehma.parse(response);
//   const json = (await response.json()) as MerriamResponse[];

//   return json[0]?.shortdef?.join(".") ?? "";
// }

// export const getWikiPediaUrl = async (searchTerm: string) => {
//   const url = `https://api.wikimedia.org/core/v1/wikipedia/en/search/page?q=${searchTerm}&limit=10`;
//   const response = await fetch(url);
//   const jsonRes = (await response.json()) as [{ excerpt: string }];
//   const excerpt = jsonRes[0].excerpt;
//   return excerpt;
// };

// async function wikiResToAnswerString(searchTerm: Response) {
//   const url = `https://api.wikimedia.org/core/v1/wikipedia/en/search/page?q=${searchTerm}&limit=10`;
//   const response = await fetch(url);
//   const jsonRes = (await response.json()) as [{ excerpt: string }];
//   const excerpt = jsonRes[0].excerpt;
//   return excerpt;
// }

// export const VALID_TOOLS: ToolUsage = {
//   ["Merriam-Webster"]: {
//     name: "Merriam-Webster",
//     getUrl: getMerriamUrl,
//     toAnswerString: merriamResToAnswerString,

//     headers: "",
//     body: "",
//   },
//   Wikipedia: {
//     name: "Wikipedia",
//     getUrl: getWikiPediaUrl,
//     toAnswerString: wikiResToAnswerString,

//     headers: "",
//     body: "",
//   },
//   Google: {
//     name: "Google",

//     headers: "",
//     body: "",
//   },
// };

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

// export const medGPTRouter = createTRPCRouter({
//   summarizeText: publicProcedure
//     .input(
//       z.object({
//         documentPrompt: z.string(),
//       })
//     )
//     .mutation(async ({ input }) => {
//       const apiKey = process.env.OPENAI_API_KEY;
//       const orgKey = process.env.OPENAI_ORG_KEY;
//       const configuration = new Configuration({
//         organization: orgKey,
//         apiKey: apiKey,
//       });
//       const openai = new OpenAIApi(configuration);
//       const newPrompt = `${prePrompt} ${input.documentPrompt}}`;
//       const response = (
//         await openai.createChatCompletion({
//           model: "gpt-3.5-turbo",
//           messages: [
//             {
//               content: newPrompt,
//               role: ChatCompletionRequestMessageRoleEnum.Assistant,
//             },
//           ],
//         })
//       ).data.choices?.[0]?.message?.content;

//       const parsedTools = matchGptDesiredTool(response ?? "");
//       console.log("la toolies", parsedTools, response);
//       const gptToolAnswers = new Map<string, string>();

//       for (const tool of parsedTools) {
//         if (tool) {
//           const { searchTerm, toolName } = tool;
//           const toolInfo = VALID_TOOLS[toolName];

//           const toolUrl = toolInfo.getUrl?.(searchTerm ?? "") ?? "";

//           // await
//           const toolResponse = await fetch(toolUrl);

//           const toolInfoAnswer = await toolInfo.toAnswerString?.(toolResponse);
//           console.log("answer from tool", toolInfoAnswer);

//           gptToolAnswers.set(searchTerm, toolInfoAnswer ?? "");
//         }
//       }

//       console.log("\n\n\n\n MAP RES", gptToolAnswers);

//       const toolsAnswerPrompt = `${answerPrompt} ${
//         input.documentPrompt
//       } ${SUPPLEMENTAL_INFORMATION} ${[...gptToolAnswers.values()]?.join(" ")}`;

//       console.log("toolsAnswerPrompt", toolsAnswerPrompt);

//       const responseWithTools = await openai.createChatCompletion({
//         model: "gpt-3.5-turbo",
//         messages: [
//           {
//             content: toolsAnswerPrompt,
// role: ChatCompletionRequestMessageRoleEnum.Assistant,
//           },
//         ],
//       });
//       return {
//         content: responseWithTools.data.choices?.[0]?.message?.content,
//         gptToolAnswers,
//       };
//     }),
//
