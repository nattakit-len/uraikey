import OpenAI from "openai";

// @link https://nextjs.org/docs/app/building-your-application/routing/route-handlers#streaming
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { message } = await req.json();

  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content: message }],
    model: "gpt-3.5-turbo",
  });

  return Response.json(chatCompletion.choices);
}
