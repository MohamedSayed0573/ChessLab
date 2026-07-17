import { Chessboard, type ChessboardOptions } from "react-chessboard";

export default function ChessBoard({
	chessboardOptions,
}: {
	chessboardOptions: ChessboardOptions;
}) {
	return (
		<div className="flex h-full min-h-0 items-center justify-center p-1">
			<div className="aspect-square h-full max-w-full">
				<Chessboard options={chessboardOptions} />
			</div>
		</div>
	);
}
