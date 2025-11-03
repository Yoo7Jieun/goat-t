"use client";

import { useEffect } from "react";
import { TrainTheme } from "@/components/themes/theme-train";

export default function TrainPage() {
	// train 페이지 진입 시 세션 플래그 정리
	useEffect(() => {
		try {
			sessionStorage.removeItem("pesma_can_view_prescription");
		} catch {}
		// 결과 식별 쿠키도 함께 정리하여 세션/쿠키 동기화 유지
		try {
			document.cookie = "pesma_result_id=; Path=/; Max-Age=0; SameSite=Lax";
		} catch {}
	}, []);
	return (
		<TrainTheme>
			<main className="min-h-screen flex items-center justify-center p-6">
				<div className="text-center space-y-6">
					<h1 className="text-3xl font-bold">
						소중한 소감을 남겨주셔서
						<br />
						감사합니다!
					</h1>
					<div className="flex items-center justify-center gap-3">
						<a href="/" className="inline-flex items-center rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800">
							홈으로 가기
						</a>
						<a href="/start" className="inline-flex items-center rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50">
							테스트 다시 시작
						</a>
					</div>
				</div>
			</main>
		</TrainTheme>
	);
}
