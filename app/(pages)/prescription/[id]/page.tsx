import { prisma } from "@/lib/prisma";
import { PrescriptionView } from "../_components/prescription-view";

export default async function PrescriptionByIdPage({ params }: { params: { id: string } }) {
	const idNum = Number(params.id);
	let initialResult: { id: number; code: string; nickname: string } | undefined;

	if (!Number.isNaN(idNum)) {
		const result = await prisma.result.findUnique({
			where: { id: idNum },
			select: { id: true, code: true, nickname: true },
		});
		if (result && result.code && result.nickname) {
			initialResult = { id: result.id, code: result.code, nickname: result.nickname };
		}
	}

	return <PrescriptionView initialResult={initialResult} />;
}
