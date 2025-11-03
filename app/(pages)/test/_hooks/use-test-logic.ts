import { useState, useEffect } from "react";
import { PesmaQuestion, AnswersById } from "@/lib/types";
import { submitTestResults } from "@/actions/submit-test";

const SESSION_KEY = "pesma_test_answers"; // 이제 '원본 선택값'을 저장합니다 (1-5)
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
	// selected: 사용자가 클릭한 원본 값(1-5)만 관리
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
				// 세션에는 '원본 선택값'만 저장합니다
				const parsed = JSON.parse(saved) as AnswersById;
				setSelected(parsed || {});
			} catch {
				// 파싱 실패 시 무시
			}
		}
		setIsHydrated(true);
	}, [questions]);

	// 선택값이 변경될 때마다 세션스토리지에 저장 (원본 값 저장)
	useEffect(() => {
		if (isHydrated && Object.keys(selected).length > 0) {
			sessionStorage.setItem(SESSION_KEY, JSON.stringify(selected));
		}
	}, [selected, isHydrated]);

	// 답변 변경 핸들러
	const handleAnswerChange = (value: number) => {
		// 라디오에는 사용자가 고른 원본 값을 그대로 표시
		setSelected((prev) => ({ ...prev, [currentQuestion.id]: value }));

		// 콘솔에는 문제 id와 원본 값만 출력
		console.log("답변 저장(원본):", currentQuestion.id, value);
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

		// 모든 답변이 완료되었는지 확인 (원본 선택 기준)
		if (Object.keys(selected).length !== totalQuestions) {
			alert("모든 질문에 답변해주세요.");
			setIsSubmitting(false);
			try {
				sessionStorage.removeItem("pesma_test_submitting");
			} catch {}
			return;
		}

		console.log("제출할 원본 답변:", selected);

		try {
			// 서버 액션 호출
			const result = await submitTestResults({
				answers: selected, // 원본 선택값 제출 (서버에서 역채점 일괄 처리)
				questions: questions,
				nickname,
			});

			// 결과 식별 쿠키는 서버 액션에서 설정됨 (서버 주도 동기화)

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

			// 처방전 페이지 접근 가드 플래그 설정 (세션 한정)
			try {
				sessionStorage.setItem("pesma_can_view_prescription", "1");
			} catch {}

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
