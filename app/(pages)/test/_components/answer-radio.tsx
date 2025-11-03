type AnswerRadioProps = {
	value: number; // 1-5
	selected: boolean;
	onSelect: () => void;
};

// 크기와 색상 설정 (aspect-square로 원형 보장)
const RADIO_STYLES = {
	1: {
		size: "w-12 h-12 sm:w-18 sm:h-18 md:w-22 md:h-22", // 가장 큼
		borderWidth: "border-3 sm:border-4",
		borderColor: "border-red-500", // 진한 빨강
		shadow: "shadow-[0_0_16px_rgba(239,68,68,0.8)]", // 빨강 번짐 강화
	},
	2: {
		size: "w-10 h-10 sm:w-14 sm:h-14 md:w-18 md:h-18",
		borderWidth: "border-2 sm:border-3",
		borderColor: "border-red-300", // 연한 빨강
		shadow: "shadow-[0_0_12px_rgba(252,165,165,0.6)]", // 연한 빨강 번짐 강화
	},
	3: {
		size: "w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14", // 가장 작음 (중앙)
		borderWidth: "border-2 sm:border-3",
		borderColor: "border-gray-300", // 회색
		shadow: "shadow-[0_0_10px_rgba(229,231,235,0.5)]", // 회색 번짐 강화
	},
	4: {
		size: "w-10 h-10 sm:w-14 sm:h-14 md:w-18 md:h-18",
		borderWidth: "border-2 sm:border-3",
		borderColor: "border-blue-300", // 연한 파랑
		shadow: "shadow-[0_0_12px_rgba(147,197,253,0.6)]", // 연한 파랑 번짐 강화
	},
	5: {
		size: "w-12 h-12 sm:w-18 sm:h-18 md:w-22 md:h-22", // 가장 큼
		borderWidth: "border-3 sm:border-4",
		borderColor: "border-blue-500", // 진한 파랑
		shadow: "shadow-[0_0_16px_rgba(59,130,246,0.8)]", // 파랑 번짐 강화
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
		${style.shadow}
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
			{selected && <span className="block rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]" style={{ width: "60%", height: "60%" }} aria-hidden />}
		</button>
	);
}
