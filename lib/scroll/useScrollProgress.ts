"use client";

import { useEffect, useState } from "react";

/**
 * 문서 스크롤 진행도를 0~1로 반환하는 훅
 */
export function useScrollProgress() {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const update = () => {
			try {
				const doc = document.documentElement;
				const scrollTop = window.scrollY || doc.scrollTop || 0;
				const scrollHeight = doc.scrollHeight - window.innerHeight;
				const p = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
				setProgress(Math.max(0, Math.min(1, p)));
			} catch {
				// no-op
			}
		};

		update();
		const onScroll = () => requestAnimationFrame(update);
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll);
		return () => {
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
		};
	}, []);

	return progress;
}
