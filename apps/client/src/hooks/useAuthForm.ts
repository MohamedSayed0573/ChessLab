import { useNavigate } from "react-router";
import useAuth from "./useAuth";
import { useApi } from "./useApi";
import { useState } from "react";
import type { LoginResponse, RegisterResponse } from "@chesslab/shared/types";
import { toErrorMessage } from "@chesslab/shared/errors";

export default function useAuthForm(endpoint: "/auth/login" | "/auth/register") {
	const [error, setError] = useState<string | undefined>(undefined);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { setAccessToken } = useAuth();
	const fetchApi = useApi();
	const navigate = useNavigate();

	async function submitForm(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsSubmitting(true);

		let timeout: NodeJS.Timeout | undefined;
		try {
			const abortController = new AbortController();

			timeout = setTimeout(() => {
				setIsSubmitting(false);
				setError("Server took too long to respond");
				abortController.abort();
				return;
			}, 5000);

			const formData = new FormData(e.currentTarget);
			const payload = Object.fromEntries(formData.entries());

			const res = await fetchApi(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
				signal: abortController.signal,
			});

			if (!res.ok) {
				setError(`Request failed, ${res.statusText}`);
				return;
			}

			const data: LoginResponse | RegisterResponse = await res.json();
			if (!data.success) {
				setError(data.message);
				return;
			}

			setAccessToken(data.accessToken);

			navigate("/");
		} catch (err) {
			setError(`Unable to reach the server. ${toErrorMessage(err)}`);
		} finally {
			setIsSubmitting(false);
			clearTimeout(timeout);
		}
	}

	return { submitForm, error, isSubmitting };
}
