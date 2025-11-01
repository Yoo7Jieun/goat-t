type QuestionDisplayProps = {
	questionText: string;
};

export function QuestionDisplay({ questionText }: QuestionDisplayProps) {
	return (
		<div>
			<h2 className="text-2xl font-bold leading-relaxed">{questionText}</h2>
		</div>
	);
}
