import { ReactNode } from "react";

interface PageBackgroundProps {
	children: ReactNode;
	variant?: "white" | "black";
	className?: string;
}

export function PageBackground({ children, variant = "white", className = "" }: PageBackgroundProps) {
	const backgroundClass = variant === "white" ? "page-bg-white" : "page-bg-black";

	return <div className={`${backgroundClass} ${className}`}>{children}</div>;
}
