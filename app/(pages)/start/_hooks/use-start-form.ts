"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export function useStartForm() {
	const [nickname, setNickname] = useState("");
	const router = useRouter();

	const handleStart = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			const v = nickname.trim();
			if (!v) {
				alert("닉네임을 입력해주세요.");
				return;
			}
			try {
				sessionStorage.setItem("pesma_test_nickname", v);
			} catch {
				// ignore storage errors
			}
			router.push("/test");
		},
		[nickname, router]
	);

	const canSubmit = nickname.trim().length > 0;

	return {
		nickname,
		setNickname,
		handleStart,
		canSubmit,
	};
}
