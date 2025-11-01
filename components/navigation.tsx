import Link from "next/link";

export function Navigation() {
	return (
		<nav className="border-b">
			<div className="container mx-auto px-4 py-4">
				<Link href="/" className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
					Home
				</Link>
			</div>
		</nav>
	);
}
