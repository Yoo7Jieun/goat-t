"use client";

import React from "react";

type NicknameInputProps = {
	value: string;
	onChange: (v: string) => void;
	maxLength?: number;
};

export function NicknameInput({ value, onChange, maxLength = 20 }: NicknameInputProps) {
	return (
		<div className="flex flex-col items-center gap-2">
			<label htmlFor="nickname" className="text-lg font-medium text-gray-700">
				닉네임을 입력해주세요
			</label>
			<input id="nickname" type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="닉네임" className="rounded-lg border-2 border-gray-300 px-4 py-2 text-center text-lg focus:border-black focus:outline-none" maxLength={maxLength} autoFocus />
		</div>
	);
}
