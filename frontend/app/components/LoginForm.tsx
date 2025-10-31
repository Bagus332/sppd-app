'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username');
    const password = formData.get('password');

    try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
        });

        if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch {
            throw new Error('Server mengembalikan respons tidak valid.');
        }
        throw new Error(errorData.message || 'Login gagal');
        }

        const data = await response.json();

        // Simpan token di localStorage dan cookie
        localStorage.setItem('token', data.token);
        document.cookie = `token=${data.token}; path=/; max-age=86400; secure; samesite=strict`;

        router.push('/');
    } catch (err: any) {
        console.error('Login error:', err);
        setError(err.message || 'Gagal terhubung ke server. Pastikan server berjalan.');
    } finally {
        setIsLoading(false);
    }
    };


  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-neutral-200">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#5c7a54] to-[#6b8c62] bg-clip-text text-transparent">
          Login SPPD
        </h1>
        <p className="text-sm text-neutral-600 mt-2">
          Masuk ke sistem untuk membuat surat tugas
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
            Username
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
            Password
          </label>
          <input
            type="password"
            name="password"
            required
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
            'Masuk'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-neutral-600">
          Belum punya akun?{' '}
          <Link
            href="/register"
            className="font-medium text-[#5c7a54] hover:text-[#485f41] transition-colors duration-200 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              console.log('Navigating to register page...');
              router.push('/register');
            }}
          >
            Registrasi
          </Link>
        </p>
      </div>
    </div>
  );
}