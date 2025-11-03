"use client";

import { StartTestForm } from "@/app/(pages)/start/_components/start-test-form";
import { MatrixTheme } from "@/components/themes/theme-matrix";

export default function StartPage() {
	return (
		<MatrixTheme>
			<main className="mx-auto max-w-md p-6 min-h-screen flex items-center">
				<div className="w-full">
					<StartTestForm />
				</div>
			</main>
		</MatrixTheme>
	);
}
