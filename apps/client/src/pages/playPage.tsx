import useUser from "../hooks/useUser";

export default function HomePage() {
	const { user } = useUser();

	return (
		<div>
			{user && (
				<div>
					{Object.entries(user).map(([key, value]) => (
						<div key={key}>
							<strong>{key}:</strong> {String(value)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
