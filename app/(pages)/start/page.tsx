"use client";

import { StartTestForm } from "@/app/(pages)/start/_components/start-test-form";

export default function StartPage() {
	return (
		<main className="mx-auto max-w-md p-6 min-h-screen flex items-center">
			<div className="w-full">
				<h1 className="text-2xl font-bold mb-4">닉네임 입력</h1>
				<StartTestForm />
			</div>
		</main>
	);
}
