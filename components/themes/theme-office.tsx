import { ReactNode } from "react";

interface OfficeThemeProps {
	children: ReactNode;
	className?: string;
}

export function OfficeTheme({ children, className = "" }: OfficeThemeProps) {
	return (
		<div className={`min-h-screen bg-white text-gray-900 ${className}`}>
			{/* 상단 테마 안내 텍스트 */}
			<div className="w-full text-center py-2 text-gray-600 text-sm opacity-50">office 테마 디자인이 들어갈 영역입니다</div>

			{/* office 테마 전용 장식 요소들 */}
			{/* <div className="absolute inset-0 pointer-events-none">
				여기에 이미지, 텍스트, 패턴 등 추가
			</div> */}

			{/* 실제 콘텐츠 */}
			{children}
		</div>
	);
}
