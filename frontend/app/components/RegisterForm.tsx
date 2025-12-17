'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LockClosedIcon, PersonIcon, EnvelopeClosedIcon } from '@radix-ui/react-icons';

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
    <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#5c7a54]">
          Registrasi Akun SPPD
        </h1>
        <p className="text-sm text-neutral-500 mt-2">
          Daftar untuk membuat surat tugas
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <div className="w-1 h-8 bg-red-500 rounded-full"></div>
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700">
            Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeClosedIcon className="h-5 w-5 text-neutral-400" />
            </div>
            <input
                type="email"
                name="email"
                placeholder="contoh@email.com"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] transition-all duration-200 text-neutral-900 placeholder-neutral-400"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700">
            Username <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PersonIcon className="h-5 w-5 text-neutral-400" />
            </div>
            <input
                type="text"
                name="username"
                required
                placeholder="Masukkan username"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] transition-all duration-200 text-neutral-900 placeholder-neutral-400"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-neutral-400" />
            </div>
            <input
                type="password"
                name="password"
                required
                minLength={6}
                placeholder="Buat password"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] transition-all duration-200 text-neutral-900 placeholder-neutral-400"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700">
            Konfirmasi Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-neutral-400" />
            </div>
            <input
                type="password"
                name="confirmPassword"
                required
                minLength={6}
                placeholder="Ulangi password"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] transition-all duration-200 text-neutral-900 placeholder-neutral-400"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-8 py-3 bg-[#5c7a54] hover:bg-[#4a6344] text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5c7a54] focus:ring-offset-2 disabled:bg-[#7b9674] transition-all duration-200 flex items-center justify-center gap-2 font-medium mt-2"
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

      <div className="mt-8 text-center border-t border-neutral-100 pt-6">
        <p className="text-sm text-neutral-600">
          Sudah punya akun?{' '}
          <Link
            href="/login"
            className="font-medium text-[#5c7a54] hover:text-[#485f41] transition-colors duration-200"
          >
            Login sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}