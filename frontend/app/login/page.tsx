// frontend/app/login/page.tsx

import LoginForm from '../components/auth/LoginForm';

export default function LoginPageWrapper() {
  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center py-12">
      <LoginForm />
    </div>
  );
}