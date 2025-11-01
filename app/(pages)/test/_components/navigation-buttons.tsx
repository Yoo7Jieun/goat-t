type NavigationButtonsProps = {
	onPrev: () => void;
	onNext: () => void;
	onComplete: () => void;
	canGoPrev: boolean;
	canGoNext: boolean;
	isLastQuestion: boolean;
	isAnswered: boolean;
};

export function NavigationButtons({ onPrev, onNext, onComplete, canGoPrev, canGoNext, isLastQuestion, isAnswered }: NavigationButtonsProps) {
	return (
		<div className="flex gap-3">
			<button onClick={onPrev} disabled={!canGoPrev} className="rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40">
				이전
			</button>

			{!isLastQuestion ? (
				<button onClick={onNext} disabled={!canGoNext || !isAnswered} className="flex-1 rounded-lg bg-black px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40">
					다음
				</button>
			) : (
				<button onClick={onComplete} disabled={!isAnswered} className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40">
					완료하기
				</button>
			)}
		</div>
	);
}
