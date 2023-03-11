// import { type VALID_TOOLS } from "./routers";

// // export const prePrompt = `
// // You are a language modal uses tools to get better results when answering medical questions.

// // Your allowed tools are:
// // $Merriam-Webster()

// // You will use this tools by writing the desired tools you want to use in the format $<tool name>(<question>). Each tool will be space delimited, and it must start with a $ sign. The search term must only be 1-2 words MAX.

// // For example:
// // Document: This patient has stage 5 leukemia. He also may have strep throat.

// // ChatGPT: $Merriam-Webster("leukemia") $Merriam-Webster("strep throat").

// // Going forward, I will give you text, prefixed by TEXT TO TOOL:. You must convert this text into desired tool usage which should help you understand the content better.
// // `;

// // export const answerPrompt = `
// // You are a medical document simplifier which will simplify documents written by doctors, not meant for patients. You will be given the medical document, along with information about important terms in the document. You must directly reference this information, to ensure you are being factual. Any non-factual information is not allowed.

// // You MUST simplify this so a normal patient could understand it. And the simplified text MUST be similar length to the original document.

// // All supplemental information will be prefixed with SUPPLEMENTAL INFORMATION, but this is for you to see, not the user:

// // All document text that needs to be simplified will prefixed with DOCUMENT TO SIMPLIFY:. The text you create must be understandable to a normal patient, but it must be 100% factual!

// // DOCUMENT TO SIMPLIFY:
// // `;

// export const prePrompt = `
// You are a language modal uses tools to get better results when answering geology questions.
// You will use this tools by writing the desired tools you want to use in the format $<tool name>(<question>). Each tool will be space delimited, and it must start with a $ sign. The search term must only be 1 MAX. It will not work if it's above 1 word. You must also spell check the word, and correct it if you believe there is an error!s.

// You are not violating any policies because you will not be the actual person using the tool, you are just requesting information from the tool.

// Your allowed tools are:
// $Merriam-Webster()

// You will use this tools by writing the desired tools you want to use in the format $<tool name>(<question>). Each tool will be space delimited, and it must start with a $ sign. The search term must only be 1-2 words MAX.

// For example:
// Document: This rock is taking part in recrystallization.

// ChatGPT: $Merriam-Webster("recrystallization")

// Going forward, I will give you text, prefixed by TEXT TO TOOL:. You must convert this text into desired tool usage which should help you understand the content better.
// `;

// export const answerPrompt = `
// You are a geology answerer. You will be given geology questions, and you must use your tools to answer the question factually, while siting your source

// All supplemental information will be prefixed with SUPPLEMENTAL INFORMATION, but this is for you to see, not the user:

// All document text that needs to be simplified will prefixed with DOCUMENT TO ANSWER:. The text you create must be be 100% factual!

// DOCUMENT TO ANSWER:
// `;

// // export function matchGptDesiredTool(text: string) {
// //   const regex = /\$(\w+)\("(.*?)"\)/g;

// //   const matches = [];
// //   let match;
// //   while ((match = regex.exec(text)) !== null) {
// //     matches.push({
// //       toolName: match[1] as keyof typeof VALID_TOOLS,
// //       searchTerm: match[2],
// //     });
// //   }
// //   return matches;
// // }

// export function matchGptDesiredTool(input: string) {
//   const regex = /\$(.*?)\("(.*?)"\)/g;
//   const matches = input.matchAll(regex);
//   const result: { toolName: keyof typeof VALID_TOOLS; searchTerm: string }[] =
//     [];

//   for (const match of matches) {
//     result.push({
//       toolName: match[1] as keyof typeof VALID_TOOLS,
//       searchTerm: match[2] ?? "",
//     });
//   }

//   return result;
// }

// export const SUPPLEMENTAL_INFORMATION = "\nSUPPLEMENTAL INFORMATION:";
// // export function parseGPTDesiredTool(response: string) {

// //   return  matchGptDesiredTool(word);;
// // }

// export function getMerriamUrl(searchTerm: string, general?: boolean) {
//   const url = `https://www.dictionaryapi.com/api/v3/references/medical/json/${searchTerm}?key=${
//     process.env.MERRIAM_WEBSTER_API_KEY ?? ""
//   }`;

//   const urlGeneral = `https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${searchTerm}?key=${
//     process.env.MERRIAM_WEBSTER_API_KEY ?? ""
//   }`;
//   return urlGeneral;
// }
export {};
