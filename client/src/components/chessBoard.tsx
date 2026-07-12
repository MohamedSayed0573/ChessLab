import { Chessboard, type ChessboardOptions } from "react-chessboard";

export default function ChessBoard({
  chessboardOptions,
}: {
  chessboardOptions: ChessboardOptions;
}) {
  return (
    <div className="flex flex-1">
      <div className="flex-1 flex items-center justify-center p-4">
        <div
          className="aspect-square"
          style={{
            maxHeight: "calc(100vh - 36px)",
            maxWidth: "calc(100vh - 36px)",
          }}
        >
          <Chessboard options={chessboardOptions} />
        </div>
      </div>
    </div>
  );
}
