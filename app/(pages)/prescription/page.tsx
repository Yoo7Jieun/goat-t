import { PrescriptionView } from "./_components/prescription-view";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

type SearchParams = Promise<{ id?: string }>;

export default async function PrescriptionPage({ searchParams }: { searchParams: SearchParams }) {
	const params = await searchParams;
	const idParam = params.id;

	let initialResult: { id: number; code: string; nickname: string } | undefined;

	// 1) URL 쿼리로 id가 온 경우(레거시/내부 링크 호환)
	if (idParam) {
		const idNum = Number(idParam);
		if (!Number.isNaN(idNum)) {
			const result = await prisma.result.findUnique({
				where: { id: idNum },
				select: { id: true, code: true, nickname: true },
			});
			if (result && result.code && result.nickname) {
				initialResult = { id: result.id, code: result.code, nickname: result.nickname };
			}
		}
	}

	// 2) 쿠키에 저장된 result id로 식별(권장 경로)
	if (!initialResult) {
		try {
			const cookieStore = await cookies();
			const idCookie = cookieStore.get("pesma_result_id");
			const idNum = idCookie ? Number(idCookie.value) : NaN;
			if (!Number.isNaN(idNum)) {
				const result = await prisma.result.findUnique({
					where: { id: idNum },
					select: { id: true, code: true, nickname: true },
				});
				if (result && result.code && result.nickname) {
					initialResult = { id: result.id, code: result.code, nickname: result.nickname };
				}
			}
		} catch {
			// 쿠키 접근 실패 시 무시하고 클라이언트 fallback으로
		}
	}

	return <PrescriptionView initialResult={initialResult} />;
}
