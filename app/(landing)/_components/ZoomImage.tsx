"use client";

import Image from "next/image";

type ZoomImageProps = {
	src: string;
	alt: string;
	progress: number; // 0 ~ 1
	minScale?: number;
	maxScale?: number;
	className?: string;
};

export default function ZoomImage({ src, alt, progress, minScale = 1, maxScale = 1.2, className }: ZoomImageProps) {
	const scale = minScale + (maxScale - minScale) * clamp01(progress);

	return (
		<div className={className ?? "relative h-full w-full"} style={{ overflow: "hidden" }}>
			<div style={{ transform: `scale(${scale})`, transition: "transform 0.06s linear", willChange: "transform" }} className="h-full w-full">
				<Image src={src} alt={alt} fill priority sizes="100vw" className="object-cover" />
			</div>
		</div>
	);
}

function clamp01(v: number) {
	if (v < 0) return 0;
	if (v > 1) return 1;
	return v;
}
