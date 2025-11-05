'use client';

import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100">
      <div className="max-w-md w-full mx-auto">
        <LoginForm />
      </div>
    </div>
  );
}