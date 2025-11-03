type AnswerRadioProps = {
	value: number; // 1-5
	selected: boolean;
	onSelect: () => void;
};

// 크기와 색상 설정 (aspect-square로 원형 보장)
const RADIO_STYLES = {
	1: {
		size: "w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24", // 가장 큼
		borderWidth: "border-3 sm:border-4",
		borderColor: "border-red-600", // 진한 빨강
	},
	2: {
		size: "w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20",
		borderWidth: "border-2 sm:border-3",
		borderColor: "border-red-400", // 연한 빨강
	},
	3: {
		size: "w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16", // 가장 작음 (중앙)
		borderWidth: "border-2 sm:border-3",
		borderColor: "border-gray-300", // 회색
	},
	4: {
		size: "w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20",
		borderWidth: "border-2 sm:border-3",
		borderColor: "border-blue-400", // 연한 파랑
	},
	5: {
		size: "w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24", // 가장 큼
		borderWidth: "border-3 sm:border-4",
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
