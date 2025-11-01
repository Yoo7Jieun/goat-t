"use client";

export default function Gallery({ progress }: { progress: number }) {
	// 간단한 패럴랙스 느낌: progress에 따라 Y 이동/투명도 조절
	const y1 = (1 - progress) * 40; // px
	const y2 = (1 - progress) * 80;
	const opacity = Math.min(1, Math.max(0, progress * 1.2));

	return (
		<div className="relative h-full w-full bg-white">
			<div className="absolute inset-0 grid grid-cols-2 gap-4 p-6" style={{ opacity }}>
				<div className="h-48 rounded-lg bg-gray-200" style={{ transform: `translateY(${y1}px)`, transition: "transform 0.06s linear" }} />
				<div className="h-64 rounded-lg bg-gray-300" style={{ transform: `translateY(${y2}px)`, transition: "transform 0.06s linear" }} />
				<div className="h-56 rounded-lg bg-gray-200" style={{ transform: `translateY(${y2}px)`, transition: "transform 0.06s linear" }} />
				<div className="h-40 rounded-lg bg-gray-300" style={{ transform: `translateY(${y1}px)`, transition: "transform 0.06s linear" }} />
			</div>
		</div>
	);
}
