type AnswerRadioProps = {
	value: number; // 1-5
	selected: boolean;
	onSelect: () => void;
};

// 크기와 색상 설정 (aspect-square로 원형 보장)
const RADIO_STYLES = {
	1: {
		size: "w-24 h-24", // 가장 큼
		borderWidth: "border-4",
		borderColor: "border-red-600", // 진한 빨강
	},
	2: {
		size: "w-20 h-20",
		borderWidth: "border-3",
		borderColor: "border-red-400", // 연한 빨강
	},
	3: {
		size: "w-16 h-16", // 가장 작음 (중앙)
		borderWidth: "border-3",
		borderColor: "border-gray-300", // 회색
	},
	4: {
		size: "w-20 h-20",
		borderWidth: "border-3",
		borderColor: "border-blue-400", // 연한 파랑
	},
	5: {
		size: "w-24 h-24", // 가장 큼
		borderWidth: "border-4",
		borderColor: "border-blue-600", // 진한 파랑
	},
};

export function AnswerRadio({ value, selected, onSelect }: AnswerRadioProps) {
	const style = RADIO_STYLES[value as keyof typeof RADIO_STYLES];

	return (
		<button
			type="button"
			onClick={onSelect}
			className={`
		${style.size}
		${style.borderWidth}
		${style.borderColor}
		aspect-square
		rounded-full
		transition-transform
		duration-200
		hover:scale-110
		bg-transparent
		flex-shrink-0
		relative
		flex items-center justify-center
	  `}
			aria-label={`답변 ${value}`}
		>
			{selected && <span className="block rounded-full bg-white" style={{ width: "60%", height: "60%" }} aria-hidden />}
		</button>
	);
}
