"use client";

import ZoomImage from "../_components/ZoomImage";

export default function Hero({ progress }: { progress: number }) {
	return (
		<div className="relative h-full w-full">
			{/* 실제 이미지 경로 제공 전까지는 배경 그라디언트를 사용 */}
			<div className="absolute inset-0 bg-gradient-to-b from-black to-gray-800" />
			{/* 이미지가 준비되면 아래 ZoomImage를 사용하고, src를 public/landing/hero/hero-1.jpg 등으로 교체 */}
			{/* <ZoomImage src="/landing/hero/hero-1.jpg" alt="hero" progress={progress} /> */}
			<div className="absolute inset-0 flex flex-col items-center justify-center text-white">
				<h1 className="text-4xl font-bold tracking-tight">GOAT</h1>
				<p className="mt-3 text-base opacity-80">당신에게 맞는 처방을 찾아가는 여행</p>
			</div>
		</div>
	);
}
