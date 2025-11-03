"use client";

import { NicknameInput } from "./nickname-input";
import { useStartForm } from "../_hooks/use-start-form";

export function StartTestForm() {
	const { nickname, setNickname, handleStart, canSubmit } = useStartForm();

	return (
		<form onSubmit={handleStart} className="flex flex-col items-center gap-6">
			<NicknameInput value={nickname} onChange={setNickname} />
			<button type="submit" disabled={!canSubmit} className="rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed">
				테스트 시작
			</button>
		</form>
	);
}
