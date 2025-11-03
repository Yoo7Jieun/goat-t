import { ReactNode } from "react";

interface MatrixThemeProps {
	children: ReactNode;
	className?: string;
}

export function MatrixTheme({ children, className = "" }: MatrixThemeProps) {
	return (
		<div className={`min-h-screen bg-black text-white ${className}`}>
			{/* 상단 테마 안내 텍스트 */}
			<div className="w-full text-center py-2 text-white text-sm opacity-50">matrix 테마 디자인이 들어갈 영역입니다</div>

			{/* matrix 테마 전용 장식 요소들 */}
			{/* <div className="absolute inset-0 pointer-events-none">
				여기에 이미지, 텍스트, 패턴 등 추가
			</div> */}

			{/* 실제 콘텐츠 */}
			{children}
		</div>
	);
}
