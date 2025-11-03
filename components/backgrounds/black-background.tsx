import { ReactNode } from "react";

interface BlackBackgroundProps {
	children: ReactNode;
	className?: string;
}

export function BlackBackground({ children, className = "" }: BlackBackgroundProps) {
	return (
		<div data-concept="black" className={`min-h-screen bg-black text-white ${className}`}>
			{/* black 배경 전용 장식 요소들 */}
			{/* <div className="absolute inset-0 pointer-events-none">
				여기에 이미지, 텍스트, 패턴 등 추가
			</div> */}

			{/* 실제 콘텐츠 */}
			{children}
		</div>
	);
}
