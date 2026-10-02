import ApplicationLogo from '@/Components/ApplicationLogo';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function Login({ status, canResetPassword, googleLoginEnabled = false }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {/* Brand Logo & Name */}
            <div className="flex items-center justify-center gap-2.5 mb-5">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <ApplicationLogo className="w-8 h-8 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform" />
                    <span className="font-extrabold text-xl text-gray-900 tracking-tight">Bogura Golf Club</span>
                </Link>
            </div>

            {/* Main Welcome Heading */}
            <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                    Welcome back
                </h1>
                <p className="text-gray-500 text-sm sm:text-base mt-2 font-normal">
                    Log in to your BGC account
                </p>
            </div>

            {status && (
                <div className="mb-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-sm font-medium text-emerald-800 text-center">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-3.5">
                {/* Email Field */}
                <div>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="w-full px-5 py-3.5 bg-[#f4f4f5] focus:bg-gray-100/90 border-0 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-black/10 text-base font-normal transition-all"
                        autoComplete="username"
                        placeholder="Email or username"
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-1.5 px-2 text-left" />
                </div>

                {/* Password Field */}
                <div className="relative">
                    <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={data.password}
                        className="w-full px-5 py-3.5 pr-12 bg-[#f4f4f5] focus:bg-gray-100/90 border-0 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-black/10 text-base font-normal transition-all"
                        autoComplete="current-password"
                        placeholder="Password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    <InputError message={errors.password} className="mt-1.5 px-2 text-left" />
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1 px-1">
                    <label className="flex items-center cursor-pointer select-none">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            className="rounded-md border-gray-300 text-black shadow-sm focus:ring-black"
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-xs text-gray-500 font-medium">
                            Remember me
                        </span>
                    </label>
                </div>

                {/* Continue Button */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-full bg-black hover:bg-gray-800 text-white font-semibold py-3.5 text-base shadow-md hover:shadow-lg active:scale-[0.99] transition-all duration-200 disabled:opacity-50"
                    >
                        {processing ? 'Signing in…' : 'Continue'}
                    </button>
                </div>
            </form>

            {/* Google SSO Button */}
            {googleLoginEnabled && (
                <>
                    {/* Divider */}
                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-3 text-gray-400 font-medium tracking-wider">or</span>
                        </div>
                    </div>

                    <a
                        href={route('auth.google')}
                        className="w-full rounded-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-4 border border-gray-300 shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-3 text-sm group active:scale-[0.99]"
                    >
                        <svg className="w-4 h-4 shrink-0 group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                        </svg>
                        <span>Continue with Google</span>
                    </a>
                </>
            )}

            {/* Links & Register Prompt */}
            <div className="mt-6 text-center space-y-3">
                {canResetPassword && (
                    <div>
                        <Link
                            href={route('password.request')}
                            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>
                )}

                <p className="text-sm text-gray-500 font-medium">
                    Don't have an account?{' '}
                    <Link
                        href={route('register')}
                        className="text-gray-900 font-bold hover:underline transition-all"
                    >
                        Sign up
                    </Link>
                </p>
            </div>


        </GuestLayout>
    );
}
