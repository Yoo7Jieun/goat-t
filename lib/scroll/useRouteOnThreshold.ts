"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * progress(0~1)이 threshold 이상이 되는 시점에 한 번만 라우팅
 */
export function useRouteOnThreshold(progress: number, threshold: number, href: string) {
	const router = useRouter();
	const firedRef = useRef(false);

	useEffect(() => {
		if (!firedRef.current && progress >= threshold) {
			firedRef.current = true;
			router.push(href);
		}
	}, [progress, threshold, href, router]);
}
