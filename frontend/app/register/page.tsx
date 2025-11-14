// frontend/app/register/page.tsx

import RegisterForm from '../components/auth/RegisterForm';

export default function RegisterPageWrapper() {
  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center py-12">
      <RegisterForm />
    </div>
  );
}