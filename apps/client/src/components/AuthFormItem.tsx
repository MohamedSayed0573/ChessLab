export function AuthFormItem({
	label,
	placeholder,
	type,
	name,
}: {
	label: string;
	placeholder: string;
	type: string;
	name: string;
}) {
	return (
		<div className="flex flex-col gap-2">
			<label className="text-[#C2C9B6]" htmlFor={name}>
				{label}
			</label>
			<input
				id={name}
				type={type}
				name={name}
				className="rounded-md border border-[#42493A] bg-[#221F1C] px-4 py-3 text-[#6B7280]"
				placeholder={placeholder}
				required
			/>
		</div>
	);
}
