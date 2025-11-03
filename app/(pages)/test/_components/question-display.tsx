type QuestionDisplayProps = {
	questionText: string;
};

export function QuestionDisplay({ questionText }: QuestionDisplayProps) {
	return (
		<div className="py-4 sm:py-6">
			<h2 className="text-xl sm:text-2xl md:text-3xl font-bold leading-relaxed text-center sm:text-left">{questionText}</h2>
		</div>
	);
}
