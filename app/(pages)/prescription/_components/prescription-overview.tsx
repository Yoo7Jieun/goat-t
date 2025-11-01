type PrescriptionOverviewProps = {
	dear?: string;
	letter?: string;
	concept?: string;
	movie?: string;
};

export function PrescriptionOverview({ dear, letter, concept, movie }: PrescriptionOverviewProps) {
	return (
		<>
			{dear && (
				<div>
					<h3 className="text-lg font-semibold text-gray-700 mb-2">Dear</h3>
					<p className="text-gray-800 whitespace-pre-wrap">{dear}</p>
				</div>
			)}

			{letter && (
				<div>
					<h3 className="text-lg font-semibold text-gray-700 mb-2">Letter</h3>
					<p className="text-gray-800 whitespace-pre-wrap">{letter}</p>
				</div>
			)}

			{concept && (
				<div>
					<h3 className="text-lg font-semibold text-gray-700 mb-2">Concept</h3>
					<p className="text-gray-800 whitespace-pre-wrap">{concept}</p>
				</div>
			)}

			{movie && (
				<div>
					<h3 className="text-lg font-semibold text-gray-700 mb-2">추천 영화</h3>
					<p className="text-gray-800 whitespace-pre-wrap">{movie}</p>
				</div>
			)}
		</>
	);
}
