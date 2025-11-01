"use client";

import React from "react";

type ResetSessionButtonProps = {
	className?: string;
	label?: string;
	onReset?: () => void;
};

export default function ResetSessionButton({ className, label = "초기화", onReset }: ResetSessionButtonProps) {
	const handleClick = () => {
		try {
			if (typeof window !== "undefined") {
				window.sessionStorage.clear();
			}
			onReset?.();
		} catch (e) {
			// no-op: sessionStorage may be unavailable
		}
	};

	return (
		<button type="button" onClick={handleClick} className={className ?? "inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"}>
			{label}
		</button>
	);
}
