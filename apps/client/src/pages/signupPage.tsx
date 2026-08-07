import AuthLayout from "@layouts/AuthLayout";
import useAuthForm from "@hooks/useAuthForm";
import { AuthFormContainer } from "@components/AuthFormContainer";
import { AuthFormItem } from "@components/AuthFormItem";

export default function SignUpPage() {
	return (
		<AuthLayout
			title="Create Account"
			subtitle="Sign up to start playing and learning."
			footerText="Already have an account?"
			footerActionText="Sign In"
			footerActionTo="/login"
		>
			<SignupForm />
		</AuthLayout>
	);
}

function SignupForm() {
	const { submitForm, error, isSubmitting } = useAuthForm("/auth/register");

	return (
		<AuthFormContainer
			onSubmit={submitForm}
			isSubmitting={isSubmitting}
			submitLabel="Register"
			submittingLabel="Creating account…"
			error={error}
		>
			<AuthFormItem label="Name" type="text" name="name" placeholder="Enter your name" />
			<AuthFormItem
				label="Username"
				type="text"
				name="username"
				placeholder="Enter your username"
			/>
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
