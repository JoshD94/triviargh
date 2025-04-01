import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const questions = await prisma.question.findMany();
        return NextResponse.json(questions);
    } catch (error) {
        return NextResponse.json({
            error: `Failed to fetch questions: ${error instanceof Error ? error.message : String(error)}`
        }, { status: 500 });
    }
}