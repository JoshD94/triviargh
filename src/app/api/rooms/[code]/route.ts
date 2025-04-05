import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } },
) {
  try {
    // Find the room by code or create it if it doesn't exist
    let room = await prisma.room.findUnique({
      where: { code: params.code },
      include: { questions: true },
    });

    // If room doesn't exist, create it
    if (!room) {
      room = await prisma.room.create({
        data: {
          code: params.code,
        },
        include: { questions: true },
      });
    }

    return NextResponse.json(room.questions);
  } catch (error) {
    return NextResponse.json(
      {
        error: `Failed to fetch questions: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { code: string } },
) {
  try {
    const body = await request.json();

    // Validate request body
    if (!body || !body.question || !body.options) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check preconditions
    if (body.options.length != 4 || body.answer > 3 || body.answer < 0) {
      return NextResponse.json(
        {
          error:
            "A question must have 4 possible options and answer must be between 0 and 3.",
        },
        { status: 400 },
      );
    }

    // Find the room or create it if it doesn't exist
    let room = await prisma.room.findUnique({
      where: { code: params.code },
    });

    if (!room) {
      room = await prisma.room.create({
        data: {
          code: params.code,
        },
      });
    }

    // Create the question and connect it to the room
    const newQuestion = await prisma.question.create({
      data: {
        question: body.question,
        options: body.options,
        answer: body.answer,
        room: {
          connect: {
            id: room.id,
          },
        },
      },
    });

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: `Failed to create question: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    );
  }
}
