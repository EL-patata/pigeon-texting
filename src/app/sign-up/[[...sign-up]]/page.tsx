import { SignUp } from '@clerk/nextjs';

const SignUpPage = () => {
	return (
		<>
			<div className="fixed z-[150] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mx-auto backdrop:blur-3xl">
				<SignUp />
			</div>
			<span className="fixed z-[100] top-0 left-0 w-screen h-screen bg-white/10 dark:bg-slate-900/50 backdrop-blur-lg" />
			;
		</>
	);
};
export default SignUpPage;
