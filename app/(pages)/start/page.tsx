"use client";

import { StartTestForm } from "@/app/(pages)/start/_components/start-test-form";
import { WhiteBackground } from "@/components/backgrounds/white-background";

export default function StartPage() {
	return (
		<WhiteBackground>
			<main className="mx-auto max-w-md p-6 min-h-screen flex items-center">
				<div className="w-full">
					<StartTestForm />
				</div>
			</main>
		</WhiteBackground>
	);
}
