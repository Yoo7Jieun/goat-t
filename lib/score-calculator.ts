import { PesmaQuestion } from "./types";

/**
 * 원본 답변 값을 실제 점수로 변환
 * @param rawValue 사용자가 선택한 값 (1-5)
 * @param reverseScore 역채점 여부
 * @returns 실제 점수 (1-5)
 */
export function calculateScore(rawValue: number, reverseScore: boolean): number {
	if (reverseScore) {
		// reverse_score가 true이면 5->1, 4->2, 3->3, 2->4, 1->5
		return 6 - rawValue;
	}
	// false이면 그대로
	return rawValue;
}

/**
 * 질문과 답변 배열로부터 최종 점수 계산
 */
export function calculateFinalScores(questions: PesmaQuestion[], answers: Map<string, number>): Map<string, number> {
	const scores = new Map<string, number>();

	questions.forEach((question) => {
		const rawValue = answers.get(question.id);
		if (rawValue !== undefined) {
			const score = calculateScore(rawValue, question.reverse_score);
			scores.set(question.id, score);
		}
	});

	return scores;
}
