'use client';

import RegisterForm from '../components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100">
      <div className="max-w-md w-full px-4 sm:px-0">
        <RegisterForm />
      </div>
    </div>
  );
}