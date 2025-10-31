'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (password !== confirmPassword) {
      setError('Password tidak sama');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registrasi gagal');
      }

      // Wait for 1 second before redirecting
      setTimeout(() => {
        router.push('/login');
      }, 1000);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Gagal melakukan registrasi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-neutral-200">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#5c7a54] to-[#6b8c62] bg-clip-text text-transparent">
          Registrasi Akun SPPD
        </h1>
        <p className="text-sm text-neutral-600 mt-2">
          Daftar untuk membuat surat tugas
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-[#c66756]/10 border border-[#c66756]/20 rounded-lg">
          <p className="text-sm text-[#c66756]">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-600">
            Email <span className="text-[#c66756]">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="contoh@email.com"
            required
            className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] transition-all duration-200 text-neutral-900"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-600">
            Username <span className="text-[#c66756]">*</span>
          </label>
          <input
            type="text"
            name="username"
            required
            className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] transition-all duration-200 text-neutral-900"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-600">
            Password <span className="text-[#c66756]">*</span>
          </label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] transition-all duration-200 text-neutral-900"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-600">
            Konfirmasi Password <span className="text-[#c66756]">*</span>
          </label>
          <input
            type="password"
            name="confirmPassword"
            required
            minLength={6}
            className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] transition-all duration-200 text-neutral-900"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-8 py-3 bg-gradient-to-r from-[#5c7a54] to-[#6b8c62] text-white rounded-lg shadow-lg hover:from-[#485f41] hover:to-[#5c7a54] focus:outline-none focus:ring-2 focus:ring-[#5c7a54] disabled:from-[#7b9674] disabled:to-[#6b8563] transition-all duration-200 flex items-center justify-center gap-2 font-medium"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Memproses...</span>
            </>
          ) : (
            'Daftar'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-neutral-600">
          Sudah punya akun?{' '}
          <Link
            href="/login"
            className="font-medium text-[#5c7a54] hover:text-[#485f41] transition-colors duration-200"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}