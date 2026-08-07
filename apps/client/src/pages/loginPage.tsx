import AuthLayout from "@layouts/AuthLayout";
import useAuthForm from "@hooks/useAuthForm";
import { AuthFormContainer } from "@components/AuthFormContainer";
import { AuthFormItem } from "@components/AuthFormItem";

export default function LoginPage() {
	return (
		<AuthLayout
			title="Log In"
			subtitle="Sign in to your account."
			footerText="Don't have an account?"
			footerActionText="Sign Up"
			footerActionTo="/signup"
		>
			<LoginForm />
		</AuthLayout>
	);
}

function LoginForm() {
	const { submitForm, error, isSubmitting } = useAuthForm("/auth/login");

	return (
		<AuthFormContainer
			onSubmit={submitForm}
			isSubmitting={isSubmitting}
			submitLabel="Log In"
			submittingLabel="Logging in…"
			error={error}
		>
			<AuthFormItem label="Email" type="email" name="email" placeholder="Enter your email" />
			<AuthFormItem
				label="Password"
				type="password"
				name="password"
				placeholder="Enter your password"
			/>
		</AuthFormContainer>
	);
}
