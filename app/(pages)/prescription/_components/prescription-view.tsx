"use client";

import { useEffect, useState } from "react";
import { Prescription } from "@/lib/prescriptions";
import { PrescriptionTitle } from "./prescription-title";
import { PrescriptionOverview } from "./prescription-overview";
import { PrescriptionSteps } from "./prescription-steps";
import { PrescriptionComment } from "./prescription-comment";
import ResetSessionButton from "@/components/reset-session-button";

type SessionResult = {
	id: number;
	code: string;
	nickname: string;
};

/**
 * Prescription 페이지 뷰
 * - 세션스토리지에서 code와 nickname 읽기
 * - code로 prescription 데이터 fetch
 * - 결과 표시
 */
export function PrescriptionView({ initialResult }: { initialResult?: SessionResult }) {
	const [resultInfo, setResultInfo] = useState<SessionResult | null>(initialResult ?? null);
	const [prescription, setPrescription] = useState<Prescription | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isSubmittingComment, setIsSubmittingComment] = useState(false);

	const handleReset = () => {
		// 세션스토리지는 버튼 컴포넌트에서 비우고, 여기서는 쿠키 제거 + /start 이동
		try {
			document.cookie = "pesma_result_id=; Path=/; Max-Age=0; SameSite=Lax";
		} catch {}
		window.location.href = "/start";
	};

	useEffect(() => {
		if (!initialResult) {
			setError("테스트 결과를 찾을 수 없습니다. 홈에서 테스트를 다시 시작해주세요.");
			setLoading(false);
			return;
		}
		setResultInfo(initialResult);
		fetchPrescription(initialResult.code);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchPrescription = async (code: string) => {
		try {
			const response = await fetch(`/api/prescription?code=${code}`);
			if (!response.ok) {
				throw new Error("처방전을 불러오는데 실패했습니다.");
			}
			const data = await response.json();
			setPrescription(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
		} finally {
			setLoading(false);
		}
	};

	const handleCommentSubmit = async (comment: string) => {
		if (!resultInfo) return;

		setIsSubmittingComment(true);
		try {
			const response = await fetch("/api/prescription", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ comment }),
			});

			if (!response.ok) {
				throw new Error("소감 저장에 실패했습니다.");
			}

			// 저장 후 감사 페이지로 이동
			window.location.href = "/thanks";
		} catch (err) {
			alert(err instanceof Error ? err.message : "소감 저장 중 오류가 발생했습니다.");
		} finally {
			setIsSubmittingComment(false);
		}
	};

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-lg">결과를 불러오는 중...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center space-y-4">
					<div className="text-lg text-red-600">{error}</div>
					<div className="flex items-center justify-center gap-3">
						<a href="/" className="inline-block px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
							홈으로 돌아가기
						</a>
						<ResetSessionButton onReset={handleReset} />
					</div>
				</div>
			</div>
		);
	}

	if (!resultInfo || !prescription) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-lg">결과를 찾을 수 없습니다.</div>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-4xl space-y-8 p-6">
			{/* 처방전 내용 */}
			<div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
				{prescription.name && <PrescriptionTitle nickname={resultInfo.nickname} name={prescription.name} />}

				<PrescriptionOverview dear={prescription.dear} letter={prescription.letter} concept={prescription.concept} movie={prescription.movie} />

				<PrescriptionSteps
					challengeConcept={prescription.challengeConcept}
					challengeKeyword={prescription.challengeKeyword}
					challengeActivity={prescription.challengeActivity}
					maintainConcept={prescription.maintainConcept}
					maintainKeyword={prescription.maintainKeyword}
					maintainActivity={prescription.maintainActivity}
					reconcileConcept={prescription.reconcileConcept}
					reconcileKeyword={prescription.reconcileKeyword}
					reconcileActivity={prescription.reconcileActivity}
				/>

				<PrescriptionComment onSubmit={handleCommentSubmit} isSubmitting={isSubmittingComment} />
			</div>

			{/* 하단 버튼 */}
			<div className="flex justify-center gap-3">
				<a href="/" className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold">
					홈으로 돌아가기
				</a>
				<ResetSessionButton onReset={handleReset} />
			</div>
		</div>
	);
}
