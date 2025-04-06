import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const prisma = new PrismaClient();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function get_questions() {
    try {
        console.log("Starting question generation...");

        const result = await ai.models.generateContent({
            model: "gemini-2.0-flash-001",
            contents: `
            Generate a fun, challenging trivia question on a random topic. 
            Return the response in the following JSON structure:

            {
            "question": "The full text of the trivia question",
            "options": ["First option", "Second option", "Third option", "Fourth option"],
            "answer": 0 // Index of the correct answer (0-3)
            }

            For example, if the question is "What is the capital of France?" and the options are ["Berlin", "Madrid", "Paris", "Rome"], the answer should be 2.
            There must only be one correct answer, and only four options in total.
            Omit any code blocks in the response with json ticks.
            Do not include any additional text or explanations outside of the JSON structure.
            Make sure the question is not too easy or too difficult, and that the options are plausible.
            The question should be suitable for a general audience and should not be too obscure or niche.
            `,
        });

        if (result?.candidates?.[0]?.content?.parts?.[0]?.text) {
            let text = result.candidates[0].content.parts[0].text;

            // Remove code fences if present
            text = text.replace(/```json\n|\n```|```/g, "");

            console.log("Cleaned text:", text);
            return JSON.parse(text);
        }

        throw new Error("Failed to extract question from API response");
    } catch (error) {
        console.error("Error:", error);
        return {
            question: "What is the capital of France?",
            options: ["London", "Berlin", "Paris", "Madrid"],
            answer: 2
        };
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        if (!body || !body.roomCode) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 },
            );
        }

        // Call the AI to generate a question
        const ai_question = await get_questions();
        if (!ai_question) {
            return NextResponse.json(
                { error: "Failed to generate question" },
                { status: 500 },
            );
        }
        // Get room id given the room code
        const room = await prisma.room.findUnique({
            where: {
                code: body.roomCode,
            },
        });
        if (!room) {
            return NextResponse.json(
                { error: "Room not found" },
                { status: 404 },
            );
        }
        const new_question = await prisma.question.create({
            data: {
                question: ai_question.question,
                options: ai_question.options,
                answer: ai_question.answer,
                roomId: room.id,
            },
        });

        return NextResponse.json(new_question, { status: 201 });
    } catch (error) {
        console.error("POST error details:", error);
        return NextResponse.json(
            {
                error: `Failed to create question: ${error instanceof Error ? error.message : String(error)}`,
            },
            { status: 500 },
        );
    }
}