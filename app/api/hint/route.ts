import { GoogleGenAI } from "@google/genai";
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { pieces, stepCount, phase } = await req.json();

    const prompt = `
      你是一位精通「華容道」的軍師（如諸葛亮）。
      玩家目前進行到第 ${stepCount} 步（階段：${phase.title}）。
      
      本階段戰略目標：${phase.goal}
      兵法核心：${phase.keyIdea}
      
      這是目前的棋盤狀態 (JSON):
      ${JSON.stringify(pieces)}
      
      請給予一個有幫助且具備鼓勵性的提示。
      不要直接告訴玩家下一步怎麼走，而是解釋「為什麼」要這樣做。
      請用繁體中文回答，語氣要像一位智者或軍師，帶有三國演義的古風感，但要通俗易懂。
      保持簡短（2-3 句話）。
    `;

    const response = await ai.models.generateContent({
      model: "gemma-3-27b-it", // Using a fast model for responsiveness
      contents: prompt,
    });

    return NextResponse.json({ hint: response.text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ hint: "主公，請先設法為曹操騰出空間。" }, { status: 500 });
  }
}
