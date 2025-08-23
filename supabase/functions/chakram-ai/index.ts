// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

console.log("Hello from Functions!");

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SPLIT_PLACEHOLDER = Deno.env.get("SPLIT_PLACEHOLDER") ?? "*&*";
const CREATE_EXPENSE_PROMPT_ID = Deno.env.get("CREATE_EXPENSE_PROMPT_ID") ??
  "*&*";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const GEMINI_API_BASE_URL = Deno.env.get("GEMINI_API_BASE_URL") ?? "";
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") ?? "";
const GEMINI_MODEL = Deno.env.get("GEMINI_MODEL") ?? "";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};
Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (
    SUPABASE_URL === "" ||
    SUPABASE_ANON_KEY === "" ||
    SPLIT_PLACEHOLDER === "" ||
    CREATE_EXPENSE_PROMPT_ID === "" ||
    GEMINI_API_BASE_URL === "" ||
    GEMINI_API_KEY === "" ||
    GEMINI_MODEL === ""
  ) {
    return sendResponse(
      500,
      "Some environment variables are not set. Please check your configuration.",
    );
  }
  const { userId, userPrompt } = await req.json();
  const { data: expenseOptionsData, error: expenseOptionsError } =
    await supabase
      .from("ExpenseOptions")
      .select("ExpensePaidBy, ExpenseGroup")
      .eq("UserId", userId);
  if (expenseOptionsError) {
    return sendResponse(
      500,
      `Error fetching expense options: ${expenseOptionsError}`,
    );
  }
  if (expenseOptionsData?.length === 0) {
    sendResponse(400, "Expense options not found for user.");
  }
  const expensePaidBy = expenseOptionsData[0]?.ExpensePaidBy ?? "";
  const expenseGroup = expenseOptionsData[0]?.ExpenseGroup ?? "";
  if (expensePaidBy === "" || expenseGroup === "") {
    sendResponse(400, "Expense options are not set for user.");
  }
  const { data: systemPrompt, error: systemPromptError } = await supabase
    .from("Prompts")
    .select("prompt")
    .eq("prompt_id", CREATE_EXPENSE_PROMPT_ID);
  if (systemPromptError) {
    return sendResponse(
      500,
      `Error fetching system prompt: ${systemPromptError}`,
    );
  }
  if (systemPrompt?.length === 0) {
    sendResponse(400, "No prompt found for creating expense.");
  }
  let systemPromptText = systemPrompt[0]?.prompt ?? "";
  if (systemPromptText === "") {
    sendResponse(400, "Prompt text is empty.");
  }
  const nowIST = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

  systemPromptText = systemPromptText.replaceAll(
    "##SplitPlaceholder##",
    SPLIT_PLACEHOLDER,
  )
    .replaceAll("##PaidByPlaceholder##", expensePaidBy)
    .replaceAll("##ItemGroupByPlaceholder##", expenseGroup)
    .replaceAll("##UserIdPlaceholder##", userId)
    .replaceAll("##CurrentDateTimePlaceholder##", nowIST)
    ;

  const payload = {
    "system_instruction": {
      "parts": [
        {
          "text": systemPromptText,
        },
      ],
    },
    "contents": [
      {
        "role": "user",
        "parts": [
          {
            "text": userPrompt,
          },
        ],
      },
    ],
  };
  const url = GEMINI_API_BASE_URL.replace("${model}", GEMINI_MODEL)
    .replace("${apiKey}", GEMINI_API_KEY);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  if (!response.ok) {
    return sendResponse(
      500,
      `Error from Gemini API: ${result.error?.message ?? "Unknown error"}`,
    );
  }
  if (result?.candidates?.length === 0) {
    return sendResponse(400, "No candidates returned from Gemini API.");
  }
  const candidate = result.candidates[0];
  if (!candidate || !candidate.content) {
    return sendResponse(400, "No content returned from Gemini API.");
  }
  const content = candidate.content;
  if (!content.parts || content.parts.length === 0) {
    return sendResponse(400, "No parts in content returned from Gemini API.");
  }
  const text = content.parts[0].text;
  if (!text || text.trim() === "") {
    return sendResponse(
      400,
      "No text in content parts returned from Gemini API.",
    );
  }
  const responseList = text.split(SPLIT_PLACEHOLDER);
  return sendResponse(200, responseList);
});
function sendResponse(
  statusCode: number,
  data: string,
): Response {
  return new Response(JSON.stringify({ data }), {
    status: statusCode,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/chakram-ai' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
