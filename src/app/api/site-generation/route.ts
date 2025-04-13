/* eslint-disable @typescript-eslint/no-unused-vars */
import { SummaryStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import prisma from "~/lib/prisma";

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Initialize OpenAI client with API key from environment variable
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const promptTranca = `
      Necesito que hagas un resumen de la siguiente entrada:
      ${text}

      Sigue la siguiente estructura:
      Resumen:
      [resumen]

      Puntos clave:
      [puntos clave]

      Formato html, usa negritas, cursivas, listas, etc para que el resumen sea más legible.
      estiliza el texto con inner css para que los título (resumen y puntos clave) sean más visibles.
    `;

    // Call OpenAI API
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Eres un asistente experto en hacer resúmenes detallados pero cortos.",
        },
        { role: "user", content: promptTranca },
      ],
      model: "gpt-3.5-turbo",
    });

    // Get the response from OpenAI
    const aiResponse = chatCompletion.choices[0].message.content;

    // Return the response
    return NextResponse.json({
      message: "Summary generated successfully",
      summary: aiResponse,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}

// Add a new function to save summaries
export async function PUT(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { text, summary } = body;

    if (!text || !summary) {
      return NextResponse.json(
        { error: "Text and summary are required" },
        { status: 400 }
      );
    }

    // Save the summary to the database
    const savedSummary = await prisma.summary.create({
      data: {
        text,
        summary,
        generatedAt: new Date(),
        status: SummaryStatus.GENERATED,
      },
    });

    // Return the response
    return NextResponse.json({
      message: "Summary saved successfully",
      summary: savedSummary,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to save summary" },
      { status: 500 }
    );
  }
}
