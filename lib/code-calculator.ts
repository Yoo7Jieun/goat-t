import { PesmaQuestion } from "./types";
import { calculateFinalScores } from "./score-calculator";

type GroupScores = {
	p: number;
	e: number;
	s: number;
	m: number;
	a: number;
};

/**
 * 질문을 그룹별로 분류
 */
function groupQuestions(questions: PesmaQuestion[]): Record<string, PesmaQuestion[]> {
	const groups: Record<string, PesmaQuestion[]> = {
		p: [],
		e: [],
		s: [],
		m: [],
		a: [],
	};

	questions.forEach((q) => {
		const prefix = q.id[0].toLowerCase();
		if (prefix in groups) {
			groups[prefix].push(q);
		}
	});

	return groups;
}

/**
 * 그룹별 점수 합계 계산
 */
function calculateGroupScores(questions: PesmaQuestion[], answers: Map<string, number>): GroupScores {
	const groups = groupQuestions(questions);
	const finalScores = calculateFinalScores(questions, answers);

	const groupScores: GroupScores = {
		p: 0,
		e: 0,
		s: 0,
		m: 0,
		a: 0,
	};

	// 각 그룹의 점수 합계 계산
	Object.entries(groups).forEach(([groupKey, groupQuestions]) => {
		const key = groupKey as keyof GroupScores;
		groupScores[key] = groupQuestions.reduce((sum, question) => {
			return sum + (finalScores.get(question.id) || 0);
		}, 0);
	});

	return groupScores;
}

/**
 * 그룹 점수를 기반으로 코드 부여
 */
export function calculatePrescriptionCode(questions: PesmaQuestion[], answers: Map<string, number>): string {
	const groups = groupQuestions(questions);
	const groupScores = calculateGroupScores(questions, answers);

	const codeMapping = {
		p: { high: "P", low: "N" },
		e: { high: "E", low: "D" },
		s: { high: "S", low: "I" },
		m: { high: "M", low: "U" },
		a: { high: "A", low: "L" },
	};

	let code = "";

	// 각 그룹에 대해 코드 부여
	(["p", "e", "s", "m", "a"] as const).forEach((groupKey) => {
		const groupQuestions = groups[groupKey];
		const totalQuestions = groupQuestions.length;
		const threshold = (totalQuestions * 5) / 2; // 문제수 * 5 / 2
		const score = groupScores[groupKey];

		const mapping = codeMapping[groupKey];
		code += score >= threshold ? mapping.high : mapping.low;
	});

	return code;
}

/**
 * 디버깅용: 그룹별 점수 상세 정보
 */
export function getGroupScoreDetails(questions: PesmaQuestion[], answers: Map<string, number>) {
	const groups = groupQuestions(questions);
	const groupScores = calculateGroupScores(questions, answers);

	return Object.entries(groups).map(([groupKey, groupQuestions]) => {
		const key = groupKey as keyof GroupScores;
		const score = groupScores[key];
		const totalQuestions = groupQuestions.length;
		const maxScore = totalQuestions * 5;
		const threshold = (totalQuestions * 5) / 2;

		return {
			group: groupKey.toUpperCase(),
			score,
			maxScore,
			threshold,
			isHigh: score >= threshold,
			questions: groupQuestions.length,
		};
	});
}

/**
 * 이미 역채점이 반영된 최종 점수 Map을 받아 코드 계산
 */
export function calculatePrescriptionCodeFromScores(questions: PesmaQuestion[], finalScores: Map<string, number>): string {
	const groups = groupQuestions(questions);

	const groupTotals: GroupScores = { p: 0, e: 0, s: 0, m: 0, a: 0 };

	Object.entries(groups).forEach(([groupKey, groupQuestions]) => {
		const key = groupKey as keyof GroupScores;
		groupTotals[key] = groupQuestions.reduce((sum, q) => sum + (finalScores.get(q.id) || 0), 0);
	});

	const codeMapping = {
		p: { high: "P", low: "N" },
		e: { high: "E", low: "D" },
		s: { high: "S", low: "I" },
		m: { high: "M", low: "U" },
		a: { high: "A", low: "L" },
	};

	let code = "";
	(["p", "e", "s", "m", "a"] as const).forEach((groupKey) => {
		const groupQuestions = groups[groupKey];
		const totalQuestions = groupQuestions.length;
		const threshold = (totalQuestions * 5) / 2;
		const score = groupTotals[groupKey];
		const mapping = codeMapping[groupKey];
		code += score >= threshold ? mapping.high : mapping.low;
	});

	return code;
}

/**
 * 이미 역채점 반영된 최종 점수에서 그룹별 상세 정보 산출
 */
export function getGroupScoreDetailsFromScores(questions: PesmaQuestion[], finalScores: Map<string, number>) {
	const groups = groupQuestions(questions);

	return Object.entries(groups).map(([groupKey, groupQuestions]) => {
		const key = groupKey as keyof GroupScores;
		const score = groupQuestions.reduce((sum, q) => sum + (finalScores.get(q.id) || 0), 0);
		const totalQuestions = groupQuestions.length;
		const maxScore = totalQuestions * 5;
		const threshold = (totalQuestions * 5) / 2;

		return {
			group: groupKey.toUpperCase(),
			score,
			maxScore,
			threshold,
			isHigh: score >= threshold,
			questions: groupQuestions.length,
		};
	});
}
