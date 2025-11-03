type QuestionDisplayProps = {
	questionText: string;
};

export function QuestionDisplay({ questionText }: QuestionDisplayProps) {
	return (
		<div className="pb-2 sm:pb-3">
			{/* 두 줄 기준 높이를 고정해서 레이아웃 흔들림을 방지 */}
			<h2 className="text-lg sm:text-2xl md:text-3xl font-bold leading-relaxed text-center sm:text-left min-h-[4.25rem] sm:min-h-[5rem] md:min-h-[6.25rem]">{questionText}</h2>
		</div>
	);
}
