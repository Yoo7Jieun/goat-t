"use client";

import { useState } from "react";

type PrescriptionCommentProps = {
	onSubmit: (comment: string) => void;
	isSubmitting?: boolean;
};

export function PrescriptionComment({ onSubmit, isSubmitting = false }: PrescriptionCommentProps) {
	const [comment, setComment] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (comment.trim()) {
			onSubmit(comment.trim());
		}
	};

	return (
		<div className="border-t pt-6">
			<h3 className="text-xl font-bold mb-4">소감 남기기</h3>
			<form onSubmit={handleSubmit} className="space-y-4">
				<textarea
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					placeholder="테스트를 마친 소감을 자유롭게 남겨주세요..."
					className="w-full min-h-[120px] p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
					disabled={isSubmitting}
				/>
				<div className="flex justify-end">
					<button type="submit" disabled={!comment.trim() || isSubmitting} className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold transition-colors">
						{isSubmitting ? "저장 중..." : "소감 저장"}
					</button>
				</div>
			</form>
		</div>
	);
}
