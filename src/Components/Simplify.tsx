import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { BsSend } from "react-icons/bs";
import { z } from "zod";
import { word_tokenize } from "./ViewHelpers/TextView";

type Roles = "user" | "bot";

type Message = {
  role: Roles;
  createdAt?: string;
  text: string;
  id?: string;
};

type MedicalWord = {
  word: string;
  location: number;
  definitions: string[];
};

const DEFAULT_MESSAGE: Message = {
  role: "user",
  text: "",
};

const goals = [
  "Identifying difficult medical terminology",
  "Getting definitions for difficult medical terminology",
  "Simplifying definitions",
  "Validating Summarization",
  "Loading Summarization",
] as const;
type Goals = (typeof goals)[number];

type Task = {
  completed: false;
  goal: Goals;
};

const calculationTasks: Task[] = goals.map((goal) => ({
  goal,
  completed: false,
}));

const MERRIAM_WEBSTER_API_KEY = z
  .string()
  .parse(process.env["NEXT_PUBLIC_MERRIAM_WEBSTER_API_KEY"]);
export function getMerriamUrl(searchTerm: string) {
  return `https://www.dictionaryapi.com/api/v3/references/medical/json/${searchTerm}?key=${MERRIAM_WEBSTER_API_KEY}`;
}

const baseUrl = z.string().parse(process.env["NEXT_PUBLIC_MODEL_ENDPOINT_URL"]);

const difficultyUrl = `${baseUrl}/difficulty`;
const gptUrl = `${baseUrl}/gpt`;
const wordDifficultyUrl = `${baseUrl}/word_difficulty`;

const Simplify = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const messageRef = useRef<HTMLDivElement>(null);
  const [wordDefinitions, setWordDefinitions] = useState<
    {
      word: string;
      location: number;
      definition: string;
    }[]
  >([]);
  const [currentUserMessage, setCurrentUserMessage] =
    useState<Message>(DEFAULT_MESSAGE);

  const medicalWords = wordDefinitions.reduce<MedicalWord[]>((prev, curr) => {
    return prev.find((w) => w.location === curr.location);
  }, []);

  const difficultyMutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await (
        await fetch(difficultyUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        })
      ).json();

      return z.number().parse(res);
    },
  });

  const gptMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const res = await (
        await fetch(gptUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        })
      ).json();
      return z.string().parse(res);
    },
  });

  const wordsDifficultyMutation = useMutation({
    mutationFn: async (words: string[]) => {
      const res = await (
        await fetch(wordDifficultyUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ words }),
        })
      ).json();
      return z
        .array(
          z.object({
            word: z.string(),
            difficulty: z.number(),
          })
        )
        .parse(res);
    },
  });

  const definitionMutation = useMutation({
    mutationFn: async (word: string) => {
      const res = await (
        await fetch(getMerriamUrl(word), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ word }),
        })
      ).json();
      // definitely the wrong type
      // return z.string().parse(res);
      return z
        .object({
          word: z.string(),
          definition: z.string(),
        })
        .parse({
          word,
          definition: res,
        });
    },
    onSuccess: (data) => {
      setWordDefinitions((prev) => [...prev, data]);
    },
  });

  const wordSenseMutation = useMutation({
    mutationFn: async ({
      context,

      words,
    }: {
      context: string[];

      words: MedicalWord[];
    }) => {
      const;
      const res = await (await fetch()).json();
    },
  });

  const loadingState = calculationTasks.map(({ completed, goal }) => {
    switch (goal) {
      // case "Getting definitions for difficult medical terminology":
      //   return {completed: }

      case "Identifying difficult medical terminology":
        return { goal, completed: wordsDifficultyMutation.isSuccess };
      case "Loading Summarization":
        return { goal, completed: gptMutation.isSuccess };
      case "Validating Summarization":
        return { goal, completed: difficultyMutation.isSuccess };
    }
  });

  const pipeline = () => undefined;

  const getDefinitions = (difficultWords: any[]) => [];

  const enhanceDocument = (definitions: any[]) => "";

  const handleStart = async () => {
    currentUserMessage && setMessages((prev) => [...prev, currentUserMessage]);
    const difficultWords = await wordsDifficultyMutation.mutateAsync(
      word_tokenize(currentUserMessage.text)
    );

    const definitions = getDefinitions(difficultWords);
    const enhancedDocument = enhanceDocument(difficultWords);
    const gptRes = await gptMutation.mutateAsync(enhancedDocument);

    setCurrentUserMessage(DEFAULT_MESSAGE);
  };

  useEffect(() => {
    if (messageRef.current) {
      const lastChild = messageRef.current.lastElementChild;
      if (lastChild) {
        lastChild.scrollIntoView({
          behavior: "smooth",
        });
      }
    }
  }, [messages, setMessages]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-evenly p-4">
      <p className="text-4xl font-bold text-white">
        Medical Document Simplification Pipeline
      </p>
      <div className="flex h-[600px] w-5/6 flex-col rounded-lg border border-slate-600 bg-slate-700 px-6 py-2 shadow-lg">
        <div
          ref={messageRef}
          className="flex h-5/6 w-full flex-col overflow-y-scroll px-10"
        >
          {messages.map((message) =>
            message.role === "user" ? (
              <div
                key={message.id}
                className="mt-5  mb-10 flex w-full justify-end"
              >
                <div className="rounded-lg bg-slate-300 p-3 shadow-lg">
                  {message.text}
                </div>
              </div>
            ) : (
              <div
                key={message.id}
                className="mt-5 ml-7 mb-10 flex w-full justify-start"
              >
                <div className="rounded-lg bg-slate-400 p-3 shadow-lg">
                  {message.text}
                </div>
              </div>
            )
          )}
        </div>
        <div className="flex h-1/6 w-full justify-evenly">
          <textarea
            value={currentUserMessage?.text}
            onChange={(e) =>
              setCurrentUserMessage((prev) => ({
                ...prev,
                text: e.target.value,
              }))
            }
            className=" h-4/5 w-5/6 rounded-lg bg-slate-900 p-3 text-gray-200 outline-none ring-0 ring-slate-500 focus:ring-1 "
          />
          <button className="flex h-4/5 w-20 items-center justify-center rounded-md bg-slate-900 p-2 shadow-lg  transition hover:scale-105">
            <BsSend size={25} className="fill-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Simplify;
