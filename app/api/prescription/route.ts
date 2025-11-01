import { NextRequest, NextResponse } from "next/server";
import { getPrescriptionByCode } from "@/lib/prescriptions";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const code = searchParams.get("code");

	if (!code) {
		return NextResponse.json({ error: "code 파라미터가 필요합니다." }, { status: 400 });
	}

	try {
		const prescription = await getPrescriptionByCode(code);

		if (!prescription) {
			return NextResponse.json({ error: "해당 코드의 처방전을 찾을 수 없습니다." }, { status: 404 });
		}

		return NextResponse.json(prescription);
	} catch (error) {
		console.error("Prescription fetch error:", error);
		return NextResponse.json({ error: "처방전을 불러오는 중 오류가 발생했습니다." }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { comment } = body as { comment?: string };

		if (!comment || typeof comment !== "string" || !comment.trim()) {
			return NextResponse.json({ error: "comment가 필요합니다." }, { status: 400 });
		}

		// 쿠키에서 결과 id 읽기
		const idCookie = request.cookies.get("pesma_result_id");
		const resultId = idCookie ? Number(idCookie.value) : NaN;
		if (Number.isNaN(resultId)) {
			return NextResponse.json({ error: "결과를 식별할 수 없습니다." }, { status: 400 });
		}

		const result = await prisma.result.update({
			where: { id: resultId },
			data: { comment: comment.trim() },
		});

		return NextResponse.json({ success: true, result });
	} catch (error) {
		console.error("Prescription comment error:", error);
		return NextResponse.json({ error: "소감 저장 중 오류가 발생했습니다." }, { status: 500 });
	}
}
