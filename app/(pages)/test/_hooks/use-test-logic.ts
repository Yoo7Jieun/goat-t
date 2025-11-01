import { useState, useEffect } from "react";
import { PesmaQuestion, AnswersById } from "@/lib/types";
import { submitTestResults } from "@/actions/submit-test";
import { calculateScore } from "@/lib/score-calculator";

const SESSION_KEY = "pesma_test_answers";
const SESSION_RESULT_KEY = "pesma_test_result"; // legacy; no longer used for routing

/**
 * 테스트 로직을 담당하는 커스텀 훅
 * - 상태 관리
 * - 세션스토리지 저장/복원
 * - 답변 처리
 * - 네비게이션
 */
export function useTestLogic(questions: PesmaQuestion[], nickname: string) {
	// 상태 관리
	const [currentIndex, setCurrentIndex] = useState(0);
	// answers: 변환된 최종 점수(세션/제출용)
	const [answers, setAnswers] = useState<AnswersById>({});
	// selected: 사용자가 클릭한 원본 값(라디오 표시용)
	const [selected, setSelected] = useState<AnswersById>({});
	const [isHydrated, setIsHydrated] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const currentQuestion = questions[currentIndex];
	// 라디오에는 사용자가 클릭한 원본 값을 표시
	const currentAnswer = (selected[currentQuestion.id] ?? null) as number | null;
	const totalQuestions = questions.length;

	// 클라이언트에서만 세션스토리지 복원 (hydration 이후)
	useEffect(() => {
		const saved = sessionStorage.getItem(SESSION_KEY);
		if (saved) {
			try {
				const parsed = JSON.parse(saved) as AnswersById; // 변환 저장된 값
				setAnswers(parsed || {});
				// 변환값을 기반으로 라디오 표시용 원본 값을 복원
				const restoredSelected: AnswersById = {};
				for (const q of questions) {
					const v = parsed?.[q.id];
					if (typeof v === "number") {
						// reverse면 원복: raw = 6 - score, 아니면 그대로
						restoredSelected[q.id] = q.reverse_score ? 6 - v : v;
					}
				}
				if (Object.keys(restoredSelected).length > 0) {
					setSelected(restoredSelected);
				}
			} catch {
				// 파싱 실패 시 무시
			}
		}
		setIsHydrated(true);
	}, [questions]);

	// 답변이 변경될 때마다 세션스토리지에 저장
	useEffect(() => {
		if (isHydrated && Object.keys(answers).length > 0) {
			sessionStorage.setItem(SESSION_KEY, JSON.stringify(answers));
		}
	}, [answers, isHydrated]);

	// 답변 변경 핸들러
	const handleAnswerChange = (value: number) => {
		// 라디오에는 사용자가 고른 원본 값을 그대로 표시
		setSelected((prev) => ({ ...prev, [currentQuestion.id]: value }));

		// 세션/제출용으로는 역채점이 반영된 값을 저장
		const actualScore = calculateScore(value, currentQuestion.reverse_score);
		setAnswers((prev) => ({ ...prev, [currentQuestion.id]: actualScore }));

		// 콘솔에는 문제 id와 변환된 값만 출력
		console.log("답변 저장:", currentQuestion.id, actualScore);
	};

	// 이전 문제로
	const handlePrev = () => {
		if (currentIndex > 0) {
			setCurrentIndex(currentIndex - 1);
		}
	};

	// 다음 문제로
	const handleNext = () => {
		if (currentIndex < totalQuestions - 1) {
			setCurrentIndex(currentIndex + 1);
		}
	};

	// 완료하기
	const handleComplete = async () => {
		if (isSubmitting) return;
		// 세션 단위 중복 제출 방지 플래그 확인
		try {
			if (sessionStorage.getItem("pesma_test_submitting") === "1") {
				return;
			}
			sessionStorage.setItem("pesma_test_submitting", "1");
		} catch {}
		setIsSubmitting(true);

		// 모든 답변이 완료되었는지 확인
		if (Object.keys(answers).length !== totalQuestions) {
			alert("모든 질문에 답변해주세요.");
			setIsSubmitting(false);
			try {
				sessionStorage.removeItem("pesma_test_submitting");
			} catch {}
			return;
		}

		console.log("제출할 답변(변환 저장):", answers);

		try {
			// 서버 액션 호출
			const result = await submitTestResults({
				answers: answers,
				questions: questions,
				nickname,
			});

			// 결과를 세션스토리지에 저장 (prescription 페이지에서 사용)
			// 결과 식별 쿠키 설정(클라이언트에서 설정하여 서버가 읽도록 함)
			try {
				document.cookie = `pesma_result_id=${encodeURIComponent(String(result.id))}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`;
			} catch {}

			// legacy; no longer used for routing
			sessionStorage.setItem(
				SESSION_RESULT_KEY,
				JSON.stringify({
					id: result.id,
					code: result.code,
					nickname: result.nickname,
				})
			);

			// 답변 세션스토리지 클리어
			sessionStorage.removeItem(SESSION_KEY);

			// ID를 URL에 노출하지 않고 쿠키로 식별 → /prescription으로 이동
			// 제출 플래그 정리 후 prescription 페이지로 이동 (id 노출 없이)
			try {
				sessionStorage.removeItem("pesma_test_submitting");
			} catch {}
			window.location.href = `/prescription`;
		} catch (error) {
			console.error("테스트 제출 실패:", error);
			alert("테스트 제출에 실패했습니다. 다시 시도해주세요.");
			setIsSubmitting(false);
			try {
				sessionStorage.removeItem("pesma_test_submitting");
			} catch {}
		}
	};

	// 계산된 상태값들
	const canGoPrev = currentIndex > 0;
	const canGoNext = currentIndex < totalQuestions - 1;
	const isLastQuestion = currentIndex === totalQuestions - 1;
	const isAnswered = currentAnswer !== null;

	return {
		// 상태
		currentQuestion,
		currentAnswer,
		currentIndex,
		totalQuestions,
		// 핸들러
		handleAnswerChange,
		handlePrev,
		handleNext,
		handleComplete,
		// 계산된 값
		canGoPrev,
		canGoNext,
		isLastQuestion,
		isAnswered,
		isSubmitting,
	};
}
