"use client";

import { useMemo } from "react";
import { useScrollProgress } from "@/lib/scroll/useScrollProgress";
import { useRouteOnThreshold } from "@/lib/scroll/useRouteOnThreshold";
import Hero from "../_sections/hero";
import Gallery from "../_sections/gallery";
import Finale from "../_sections/finale";

export default function LandingRoot() {
	const progress = useScrollProgress(); // 0 ~ 1

	// 마지막 5%에서 /start로 라우팅 (한 번만)
	useRouteOnThreshold(progress, 0.95, "/start");

	// 섹션용 부분 진행도 계산 예시
	const sections = useMemo(
		() => [
			{ start: 0.0, end: 0.33 },
			{ start: 0.33, end: 0.66 },
			{ start: 0.66, end: 1.0 },
		],
		[]
	);

	const heroProgress = clamp01((progress - sections[0].start) / (sections[0].end - sections[0].start));
	const galleryProgress = clamp01((progress - sections[1].start) / (sections[1].end - sections[1].start));
	const finaleProgress = clamp01((progress - sections[2].start) / (sections[2].end - sections[2].start));

	return (
		<main className="min-h-[300vh] bg-white">
			{/* 각 섹션은 화면 높이 이상으로 구성하여 스크롤 여유를 줌 */}
			<section className="h-screen sticky top-0 overflow-hidden">
				<Hero progress={heroProgress} />
			</section>

			<section className="h-screen sticky top-0 overflow-hidden">
				<Gallery progress={galleryProgress} />
			</section>

			<section className="h-screen sticky top-0 overflow-hidden">
				<Finale progress={finaleProgress} />
			</section>
		</main>
	);
}

function clamp01(v: number) {
	if (v < 0) return 0;
	if (v > 1) return 1;
	return v;
}
