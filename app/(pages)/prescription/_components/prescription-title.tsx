type PrescriptionTitleProps = {
	nickname: string;
	name: string;
};

export function PrescriptionTitle({ nickname, name }: PrescriptionTitleProps) {
	return (
		<div>
			<h2 className="text-2xl font-bold mb-2 text-black">
				<span className="text-blue-400">{nickname}</span>님은 {name}입니다.
			</h2>
		</div>
	);
}
