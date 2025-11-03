export default function ThanksPage() {
	return (
		<main className="min-h-screen flex items-center justify-center p-6">
			<div className="text-center space-y-6">
				<h1 className="text-3xl font-bold">감사합니다!</h1>
				<p className="text-gray-600">소중한 소감을 남겨주셔서 고맙습니다.</p>
				<div className="flex items-center justify-center gap-3">
					<a href="/" className="inline-flex items-center rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800">
						홈으로 가기
					</a>
					<a href="/start" className="inline-flex items-center rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50">
						테스트 다시 시작
					</a>
				</div>
			</div>
		</main>
	);
}
