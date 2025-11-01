import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { resultId, comment } = body;

		if (!resultId || typeof resultId !== "number") {
			return NextResponse.json({ error: "resultId가 필요합니다." }, { status: 400 });
		}

		if (!comment || typeof comment !== "string" || !comment.trim()) {
			return NextResponse.json({ error: "comment가 필요합니다." }, { status: 400 });
		}

		// Result 업데이트
		const result = await prisma.result.update({
			where: { id: resultId },
			data: { comment: comment.trim() },
		});

		return NextResponse.json({ success: true, result });
	} catch (error) {
		console.error("Comment update error:", error);
		return NextResponse.json({ error: "소감 저장 중 오류가 발생했습니다." }, { status: 500 });
	}
}
