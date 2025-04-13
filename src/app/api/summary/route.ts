/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { Client } from "@upstash/qstash";
import prisma from "~/lib/prisma";

// Initialize QStash client
const qstashClient = new Client({
  token: process.env.QSTASH_TOKEN || "",
});

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { text, summary = null } = body;

    let summaryId = null;

    // New logic: Always save to database with empty summary field
    const savedSummary = await prisma.summary.create({
      data: {
        text,
        summary: "", // Empty summary field
        status: "PENDING",
      },
    });
    summaryId = savedSummary.id;

    // Send a message to QStash with the summary ID
    try {
      // Get the app URL from environment variables or use a default
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";

      // Use ngrok tunnel for local development
      const ngrokUrl = "https://eaa8-201-244-238-219.ngrok-free.app";

      // Check if destination is a localhost URL
      const destinationUrl = `http://localhost:3001/api/process-summary`;
      const isLocalhost =
        destinationUrl.includes("localhost") ||
        destinationUrl.includes("127.0.0.1") ||
        destinationUrl.includes("::1");

      let qstashDestination = destinationUrl;

      if (isLocalhost) {
        // For local development, use ngrok tunnel instead of localhost
        console.log("Using ngrok tunnel for local development");

        // Replace localhost URL with ngrok URL
        qstashDestination = destinationUrl.replace(
          /https?:\/\/(localhost|127\.0\.0\.1|\:\:1)(:\d+)?/,
          ngrokUrl
        );

        console.log("Redirecting to ngrok tunnel:", qstashDestination);
      }

      // Send a message to QStash to process the summary asynchronously
      const qstashResponse = await qstashClient.publishJSON({
        url: qstashDestination,
        body: {
          summaryId: summaryId,
          text: text,
        },
      });

      console.log("QStash message sent:", qstashResponse.messageId);
    } catch (qstashError) {
      console.error("QStash Error:", qstashError);
      // Continue execution even if QStash fails
    }

    // Return the response
    return NextResponse.json({
      message: "Summary queued for processing",
      summaryId,
      saved: true,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to process summary request" },
      { status: 500 }
    );
  }
}

// New endpoint for QStash test message
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { message, destination } = body;

    if (!message || !destination) {
      return NextResponse.json(
        { error: "Message and destination are required" },
        { status: 400 }
      );
    }

    // Check if destination is a localhost URL
    const isLocalhost =
      destination.includes("localhost") ||
      destination.includes("127.0.0.1") ||
      destination.includes("::1");

    // Use ngrok tunnel for local development
    const ngrokUrl = "https://eaa8-201-244-238-219.ngrok-free.app";

    if (isLocalhost) {
      // For local development, use ngrok tunnel instead of localhost
      console.log("Using ngrok tunnel for local development");

      // Replace localhost URL with ngrok URL
      const ngrokDestination = destination.replace(
        /https?:\/\/(localhost|127\.0\.0\.1|\:\:1)(:\d+)?/,
        ngrokUrl
      );

      console.log("Redirecting to ngrok tunnel:", ngrokDestination);

      // Send a real message to QStash using the ngrok URL
      const response = await qstashClient.publishJSON({
        url: `${ngrokUrl}/api/webhook`,
        body: {
          message: message,
          timestamp: new Date().toISOString(),
          originalDestination: destination,
        },
      });

      return NextResponse.json({
        success: true,
        messageId: response.messageId,
        message: "Message sent to local backend via ngrok tunnel",
        ngrokUrl: ngrokUrl,
      });
    }

    // For production, send a real message to QStash
    const response = await qstashClient.publishJSON({
      url: destination,
      body: {
        message: message,
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      messageId: response.messageId,
      message: "Message queued successfully",
    });
  } catch (error) {
    console.error("QStash Error:", error);
    return NextResponse.json(
      { error: "Failed to send message to QStash", details: String(error) },
      { status: 500 }
    );
  }
}

// Add a new GET endpoint to retrieve summaries
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      // Get a specific summary
      const summary = await prisma.summary.findUnique({
        where: { id },
      });

      if (!summary) {
        return NextResponse.json(
          { error: "Summary not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(summary);
    } else {
      // Get all summaries
      const summaries = await prisma.summary.findMany({
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(summaries);
    }
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve summaries" },
      { status: 500 }
    );
  }
}

// Add a DELETE endpoint to remove a summary
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Summary ID is required" },
        { status: 400 }
      );
    }

    // Delete the summary
    await prisma.summary.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Summary deleted successfully",
    });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to delete summary" },
      { status: 500 }
    );
  }
}
