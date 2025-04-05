import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const questions = await prisma.question.findMany();
    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json(
      {
        error: `Failed to fetch questions: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
    const new_question = await prisma.question.create({
      data: {
        question: body.question,
        options: body.options,
        answer: body.answer,
        roomId: body.roomId,
      },
    });
    return NextResponse.json(new_question, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: `Failed to create question: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    );
  }
}
