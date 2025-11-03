import { AnswerRadio } from "./answer-radio";

type AnswerOptionsProps = {
	value: number | null;
	onChange: (value: number) => void;
};

export function AnswerOptions({ value, onChange }: AnswerOptionsProps) {
	return (
		<div className="w-full py-6 sm:py-8">
			<div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-4 md:gap-6">
				{/* 왼쪽: 아니다 */}
				<div className="flex justify-end text-sm sm:text-base md:text-lg font-medium text-gray-600">
					<span>아니다</span>
				</div>

				{/* 중앙: 라디오 버튼들 */}
				<div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-3">
					{[1, 2, 3, 4, 5].map((optionValue) => (
						<AnswerRadio key={optionValue} value={optionValue} selected={value === optionValue} onSelect={() => onChange(optionValue)} />
					))}
				</div>

				{/* 오른쪽: 그렇다 */}
				<div className="flex justify-start text-sm sm:text-base md:text-lg font-medium text-gray-600">
					<span>그렇다</span>
				</div>
			</div>
		</div>
	);
}
