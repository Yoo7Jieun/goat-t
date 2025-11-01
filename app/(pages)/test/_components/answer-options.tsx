import { AnswerRadio } from "./answer-radio";

type AnswerOptionsProps = {
	value: number | null;
	onChange: (value: number) => void;
};

export function AnswerOptions({ value, onChange }: AnswerOptionsProps) {
	return (
		<div className="w-full grid grid-cols-[1fr_3fr_1fr] items-center gap-4">
			{/* 왼쪽: 아니다 */}
			<div className="flex justify-end text-base font-medium text-gray-600">
				<span>아니다</span>
			</div>

			{/* 중앙: 라디오 버튼들 (카드의 80% 정도 차지) */}
			<div className="flex items-center justify-center gap-3">
				{[1, 2, 3, 4, 5].map((optionValue) => (
					<AnswerRadio key={optionValue} value={optionValue} selected={value === optionValue} onSelect={() => onChange(optionValue)} />
				))}
			</div>

			{/* 오른쪽: 그렇다 */}
			<div className="flex justify-start text-base font-medium text-gray-600">
				<span>그렇다</span>
			</div>
		</div>
	);
}
