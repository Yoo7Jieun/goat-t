type ProgressBarProps = {
	current: number;
	total: number;
};

export function ProgressBar({ current, total }: ProgressBarProps) {
	const percentage = (current / total) * 100;

	return (
		<div className="w-full">
			<div className="mb-2 flex justify-between text-sm sm:text-base text-gray-600">
				<span>
					{current} / {total}
				</span>
				<span>{Math.round(percentage)}%</span>
			</div>
			<div className="h-2 sm:h-3 w-full overflow-hidden rounded-full bg-gray-200">
				<div className="h-full bg-black transition-all duration-300" style={{ width: `${percentage}%` }} />
			</div>
		</div>
	);
}
