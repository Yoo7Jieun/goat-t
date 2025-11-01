"use client";

import { useState, useEffect } from "react";
import { PesmaQuestion } from "@/lib/types";
import { useTestLogic } from "../_hooks/use-test-logic";
import { ProgressBar } from "./progress-bar";
import { QuestionDisplay } from "./question-display";
import { AnswerOptions } from "./answer-options";
import { NavigationButtons } from "./navigation-buttons";
import ResetSessionButton from "@/components/reset-session-button";

type TestViewProps = {
	questions: PesmaQuestion[];
};

/**
 * 테스트 UI 뷰 (CSS 담당자 수정 영역)
 * - 레이아웃과 컴포넌트 배치만 담당
 * - 로직은 use-test-logic.ts에서 관리
 */
export function TestView({ questions }: TestViewProps) {
	const [nickname, setNickname] = useState("");

	// 세션스토리지에서 nickname 읽기
	useEffect(() => {
		const savedNickname = sessionStorage.getItem("pesma_test_nickname");
		if (!savedNickname) {
			// nickname이 없으면 시작 페이지로 리다이렉트
			window.location.href = "/start";
			return;
		}
		setNickname(savedNickname);
	}, []);

	const { currentQuestion, currentAnswer, currentIndex, totalQuestions, handleAnswerChange, handlePrev, handleNext, handleComplete, canGoPrev, canGoNext, isLastQuestion, isAnswered } = useTestLogic(questions, nickname);

	// nickname 로딩 중
	if (!nickname) {
		return <div className="flex min-h-screen items-center justify-center">로딩 중...</div>;
	}

	return (
		<div className="mx-auto max-w-2xl space-y-8 p-6">
			{/* 상단 유틸 영역 */}
			<div className="flex justify-end">
				<ResetSessionButton onReset={() => window.location.reload()} />
			</div>
			{/* 프로그레스바 */}
			<ProgressBar current={currentIndex + 1} total={totalQuestions} />

			{/* 질문 표시 */}
			<QuestionDisplay questionText={currentQuestion.text} />

			{/* 답변 옵션 (라디오 버튼) */}
			<AnswerOptions value={currentAnswer} onChange={handleAnswerChange} />

			{/* 네비게이션 버튼 */}
			<NavigationButtons onPrev={handlePrev} onNext={handleNext} onComplete={handleComplete} canGoPrev={canGoPrev} canGoNext={canGoNext} isLastQuestion={isLastQuestion} isAnswered={isAnswered} />
		</div>
	);
}
