// PESMA 테스트 질문 타입
export type PesmaQuestion = {
	id: string; // "p1", "e1", "s1" 등
	text: string; // 질문 텍스트
	reverse_score?: boolean; // 역채점 여부 (선택) - 없으면 id 접미사("_r")로 판단
};

// 사용자 답변 맵 (1-5점)
export type AnswersById = Record<string, number>; // { s1: 1, s2: 3, ... }

// 테스트 결과 타입
export type TestResult = {
	answers: AnswersById;
	code?: string; // 계산된 처방전 코드
	nickname?: string;
	comment?: string;
};
