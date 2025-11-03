"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { AnswersById, PesmaQuestion } from "@/lib/types";
import { calculatePrescriptionCodeFromScores, getGroupScoreDetailsFromScores } from "@/lib/code-calculator";
import { calculateFinalScores } from "@/lib/score-calculator";

type SubmitTestInput = {
	answers: AnswersById; // 원본 선택값(1-5)
	questions: PesmaQuestion[]; // reverse_score 정보를 이용해 서버에서 역채점 처리
	nickname: string; // 필수
	comment?: string;
};

/**
 * 테스트 결과를 DB에 저장하고 결과 ID 반환
 */
export async function submitTestResults(input: SubmitTestInput) {
	const { answers, questions, nickname, comment } = input;

	// 원본 선택값을 서버에서 역채점 반영된 최종 점수로 변환
	const rawMap = new Map<string, number>(Object.entries(answers).map(([k, v]) => [k, Number(v)]));
	const finalScoresMap = calculateFinalScores(questions, rawMap);

	// 점수 분석으로 처방전 코드 계산 (최종 점수 기반)
	const code = calculatePrescriptionCodeFromScores(questions, finalScoresMap);

	// 디버깅용: 그룹별 점수 상세 정보 (최종 점수 기반)
	const scoreDetails = getGroupScoreDetailsFromScores(questions, finalScoresMap);
	console.log("그룹별 점수 상세:", scoreDetails);
	console.log("최종 코드:", code);

	// Prisma로 Result 테이블에 저장 (역채점 반영된 최종 점수 저장)
	const result = await prisma.result.create({
		data: {
			answers: Object.fromEntries(finalScoresMap) as any,
			code,
			nickname,
			comment,
			createdAt: new Date(),
		},
	});

	// 서버에서 쿠키 설정: 클라이언트/서버 동기화의 기준점으로 삼음
	try {
		const cookieStore = await cookies();
		cookieStore.set("pesma_result_id", String(result.id), {
			path: "/",
			// 세션 쿠키(브라우저 종료 시 삭제) 권장. 지속 쿠키가 필요하면 maxAge 지정
			// maxAge: 60 * 60 * 24 * 7,
			sameSite: "lax",
			// 보안 강화를 원하면 httpOnly: true 로 전환하고, 삭제는 API를 통해 처리
			httpOnly: false,
		});
	} catch (e) {
		console.error("Failed to set result cookie:", e);
	}

	return {
		id: result.id,
		code: result.code || code,
		nickname: result.nickname || nickname,
	};
}
