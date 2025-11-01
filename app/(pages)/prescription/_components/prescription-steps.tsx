"use client";

import { useState } from "react";

type StepContent = {
	concept?: string;
	keyword?: string;
	activity?: string;
};

type Tab = {
	id: string;
	label: string;
	content: StepContent;
};

type PrescriptionStepsProps = {
	challengeConcept?: string;
	challengeKeyword?: string;
	challengeActivity?: string;
	maintainConcept?: string;
	maintainKeyword?: string;
	maintainActivity?: string;
	reconcileConcept?: string;
	reconcileKeyword?: string;
	reconcileActivity?: string;
};

export function PrescriptionSteps({ challengeConcept, challengeKeyword, challengeActivity, maintainConcept, maintainKeyword, maintainActivity, reconcileConcept, reconcileKeyword, reconcileActivity }: PrescriptionStepsProps) {
	// 탭 데이터 구성
	const tabs: Tab[] = [
		{
			id: "challenge",
			label: "도전",
			content: {
				concept: challengeConcept,
				keyword: challengeKeyword,
				activity: challengeActivity,
			},
		},
		{
			id: "maintain",
			label: "유지",
			content: {
				concept: maintainConcept,
				keyword: maintainKeyword,
				activity: maintainActivity,
			},
		},
		{
			id: "reconcile",
			label: "화해",
			content: {
				concept: reconcileConcept,
				keyword: reconcileKeyword,
				activity: reconcileActivity,
			},
		},
	];

	// 내용이 있는 탭만 필터링
	const availableTabs = tabs.filter((tab) => tab.content.concept || tab.content.keyword || tab.content.activity);

	// 탭이 하나도 없으면 렌더링하지 않음
	if (availableTabs.length === 0) {
		return null;
	}

	// 첫 번째 탭을 기본 선택
	const [activeTab, setActiveTab] = useState(availableTabs[0].id);

	// 현재 활성화된 탭의 내용
	const currentTab = availableTabs.find((tab) => tab.id === activeTab);

	return (
		<div className="border-t pt-6">
			{/* 탭 헤더 */}
			<div className="flex gap-2 border-b mb-6">
				{availableTabs.map((tab) => (
					<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-6 py-3 font-semibold transition-colors ${activeTab === tab.id ? "border-b-2 border-black text-black" : "text-gray-500 hover:text-gray-700"}`}>
						{tab.label}
					</button>
				))}
			</div>

			{/* 탭 내용 */}
			{currentTab && (
				<div className="space-y-4">
					{currentTab.content.concept && (
						<div>
							<h4 className="font-semibold text-gray-700 mb-1">개념</h4>
							<p className="text-gray-800 whitespace-pre-wrap">{currentTab.content.concept}</p>
						</div>
					)}
					{currentTab.content.keyword && (
						<div>
							<h4 className="font-semibold text-gray-700 mb-1">키워드</h4>
							<p className="text-gray-800 whitespace-pre-wrap">{currentTab.content.keyword}</p>
						</div>
					)}
					{currentTab.content.activity && (
						<div>
							<h4 className="font-semibold text-gray-700 mb-1">활동</h4>
							<p className="text-gray-800 whitespace-pre-wrap">{currentTab.content.activity}</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
