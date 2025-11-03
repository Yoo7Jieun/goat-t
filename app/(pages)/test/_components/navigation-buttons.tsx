type NavigationButtonsProps = {
	onPrev: () => void;
	onNext: () => void;
	onComplete: () => void;
	canGoPrev: boolean;
	canGoNext: boolean;
	isLastQuestion: boolean;
	isAnswered: boolean;
	isSubmitting?: boolean;
};

export function NavigationButtons({ onPrev, onNext, onComplete, canGoPrev, canGoNext, isLastQuestion, isAnswered, isSubmitting = false }: NavigationButtonsProps) {
	const nextDisabled = !canGoNext || !isAnswered;

	return (
		<div className="flex flex-col gap-2">
			<div className="flex gap-3">
				<button onClick={onPrev} disabled={!canGoPrev} className="rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40">
					이전
				</button>

				{!isLastQuestion ? (
					<button onClick={onNext} disabled={nextDisabled} className="flex-1 rounded-lg bg-black px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40">
						{nextDisabled ? "응답을 완료해주세요" : "다음"}
					</button>
				) : (
					<button onClick={onComplete} disabled={!isAnswered || isSubmitting} className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40" aria-busy={isSubmitting}>
						{isSubmitting ? "제출 중..." : "완료하기"}
					</button>
				)}
			</div>
			{/* Disabled 상태에서는 버튼 텍스트로 안내를 표시합니다. */}
		</div>
	);
}
