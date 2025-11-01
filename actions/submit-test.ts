"use server";

import { prisma } from "@/lib/prisma";
import { AnswersById, PesmaQuestion } from "@/lib/types";
import { calculatePrescriptionCodeFromScores, getGroupScoreDetailsFromScores } from "@/lib/code-calculator";

type SubmitTestInput = {
	answers: AnswersById; // 이미 역채점 반영된 최종 점수 (1-5)
	questions: PesmaQuestion[]; // reverse_score 정보는 여기서는 사용하지 않음
	nickname: string; // 필수로 변경
	comment?: string;
};

/**
 * 테스트 결과를 DB에 저장하고 결과 ID 반환
 */
export async function submitTestResults(input: SubmitTestInput) {
	const { answers, questions, nickname, comment } = input;

	// 이미 역채점 반영된 점수 객체를 Map으로 변환
	const finalScoresMap = new Map<string, number>(Object.entries(answers));

	// 점수 분석으로 처방전 코드 계산 (최종 점수 기반)
	const code = calculatePrescriptionCodeFromScores(questions, finalScoresMap);

	// 디버깅용: 그룹별 점수 상세 정보 (최종 점수 기반)
	const scoreDetails = getGroupScoreDetailsFromScores(questions, finalScoresMap);
	console.log("그룹별 점수 상세:", scoreDetails);
	console.log("최종 코드:", code);

	// Prisma로 Result 테이블에 저장 (실제 점수 저장)
	const result = await prisma.result.create({
		data: {
			answers: answers as any, // 역채점 반영된 최종 점수 (객체 형태)
			code,
			nickname,
			comment,
			createdAt: new Date(),
		},
	});

	// 쿠키 설정은 클라이언트에서 처리(서버 액션 환경 차이로 인한 호환성 이슈 회피)

	return {
		id: result.id,
		code: result.code || code,
		nickname: result.nickname || nickname,
	};
}
