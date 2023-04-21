import { z } from "zod";

const AudioSchema = z.object({
  audio: z.string(),
});

const PronunciationSchema = z.object({
  mw: z.string(),
  sound: AudioSchema.optional(),
});

const CategorySchema = z.object({
  cat: z.string(),
});

const CalledAlsoSchema = z.object({
  intro: z.string(),
  cats: z.array(CategorySchema),
});

const SenseSchema = z.object({
  sn: z.string().optional(),
  dt: z.array(
    z.array(
      z.union([
        z.object({ text: z.string() }),
        CalledAlsoSchema,
        z.object({
          vis: z.array(
            z.object({
              t: z.string(),
              aq: z.object({
                auth: z.string().optional(),
                source: z.string().optional(),
              }),
            })
          ),
        }),
      ])
    )
  ),
  snote: z.array(z.array(z.object({ t: z.string() }))).optional(),
});

const DefinitionSchema = z.object({
  sseq: z.array(z.array(SenseSchema)),
});

const UrosSchema = z.object({
  ure: z.string(),
  prs: z.array(PronunciationSchema).optional(),
  fl: z.string(),
});

const EntrySchema = z.object({
  meta: z.object({
    id: z.string(),
    uuid: z.string(),
    sort: z.string(),
    src: z.string(),
    section: z.string(),
    stems: z.array(z.string()),
    offensive: z.boolean(),
  }),
  hwi: z.object({
    hw: z.string(),
    prs: z.array(PronunciationSchema).optional(),
  }),
  fl: z.string(),
  def: z.array(DefinitionSchema),
  uros: z.array(UrosSchema).optional(),
  shortdef: z.array(z.string()),
});

export const ApiResponseSchema = z.array(EntrySchema);

export type ApiResponse = z.infer<typeof ApiResponseSchema>;
