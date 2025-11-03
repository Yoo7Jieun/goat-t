"use client";

import { useScrollProgress } from "@/lib/scroll/useScrollProgress";
import { useRouteOnThreshold } from "@/lib/scroll/useRouteOnThreshold";

export default function LandingRoot() {
	const progress = useScrollProgress(); // 0 ~ 1

	// 90% 스크롤 시 /start로 라우팅
	useRouteOnThreshold(progress, 0.9, "/start");

	// progress에 따라 텍스트를 확대 (1배 → 3배)
	const scale = 1 + progress * 2;

	return (
		<main className="min-h-[300vh] bg-white">
			{/* 중앙 고정: 줌인되는 텍스트 */}
			<div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
				{/* 중앙: 줌인되는 텍스트 */}
				<div className="transition-transform duration-100 ease-out" style={{ transform: `scale(${scale})` }}>
					<p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 text-center px-4">줌인 스크롤 이팩트가 들어갈 자리입니다</p>
				</div>

				{/* 하단: 안내 메시지 */}
				<div className="mt-8">
					<p className="text-base sm:text-lg text-gray-600 text-center">스크롤하시면 테스트 시작 페이지로 이동합니다</p>
				</div>
			</div>
		</main>
	);
}

function clamp01(v: number) {
	if (v < 0) return 0;
	if (v > 1) return 1;
	return v;
}
