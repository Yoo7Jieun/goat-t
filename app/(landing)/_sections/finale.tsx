"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Finale({ progress }: { progress: number }) {
	const router = useRouter();
	const firedRef = useRef(false);
	const opacity = Math.min(1, Math.max(0, progress));

	useEffect(() => {
		if (!firedRef.current && progress >= 1) {
			firedRef.current = true;
			// 약간의 페이드 타임을 주고 이동 (연출용)
			setTimeout(() => router.push("/start"), 200);
		}
	}, [progress, router]);

	return (
		<div className="relative h-full w-full bg-black">
			<div className="absolute inset-0 flex items-center justify-center" style={{ opacity }}>
				<div className="text-white text-2xl font-semibold">시작하러 가는 중...</div>
			</div>
		</div>
	);
}
