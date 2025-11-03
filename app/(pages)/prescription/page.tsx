import { PrescriptionView } from "./_components/prescription-view";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function PrescriptionPage() {
	let initialResult: { id: number; code: string; nickname: string } | undefined;

	// 쿠키에 저장된 result id로만 접근 가능
	try {
		const cookieStore = await cookies();
		const idCookie = cookieStore.get("pesma_result_id");
		const idNum = idCookie ? Number(idCookie.value) : NaN;

		if (!idCookie || Number.isNaN(idNum)) {
			// 쿠키가 없으면 시작 페이지로 리다이렉트
			redirect("/start");
		}

		const result = await prisma.result.findUnique({
			where: { id: idNum },
			select: { id: true, code: true, nickname: true },
		});

		if (result && result.code && result.nickname) {
			initialResult = { id: result.id, code: result.code, nickname: result.nickname };
		} else {
			// DB에 결과가 없으면 시작 페이지로
			redirect("/start");
		}
	} catch (error) {
		// 쿠키 접근 실패 또는 기타 오류 시
		redirect("/start");
	}

	return <PrescriptionView initialResult={initialResult} />;
}
