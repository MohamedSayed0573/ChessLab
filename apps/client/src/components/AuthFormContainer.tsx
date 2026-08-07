export function AuthFormContainer({
	onSubmit,
	isSubmitting,
	submitLabel,
	submittingLabel,
	error,
	children,
}: {
	onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
	isSubmitting: boolean;
	submitLabel: string;
	submittingLabel: string;
	error: string | undefined;
	children: React.ReactNode;
}) {
	return (
		<div>
			<form className="flex flex-col gap-5 font-mono text-sm font-medium" onSubmit={onSubmit}>
				{children}
				<button
					type="submit"
					disabled={isSubmitting}
					className="rounded-md bg-[#81B64C] py-3 text-sm font-medium text-white hover:cursor-pointer hover:bg-[#5A6150] disabled:cursor-wait disabled:opacity-60"
				>
					{isSubmitting ? submittingLabel : submitLabel}
				</button>
			</form>
			{error && (
				<div className="mt-4 rounded-md bg-[#221F1C] px-4 py-3 text-sm text-red-500">
					{error}
				</div>
			)}
		</div>
	);
}
