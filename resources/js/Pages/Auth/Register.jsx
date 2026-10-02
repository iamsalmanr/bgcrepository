import ApplicationLogo from '@/Components/ApplicationLogo';
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            {/* Brand Logo & Name */}
            <div className="flex items-center justify-center gap-2.5 mb-5">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <ApplicationLogo className="w-8 h-8 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform" />
                    <span className="font-extrabold text-xl text-gray-900 tracking-tight">Bogura Golf Club</span>
                </Link>
            </div>

            {/* Main Heading */}
            <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                    Create an account
                </h1>
                <p className="text-gray-500 text-sm sm:text-base mt-2 font-normal">
                    Sign up to access member features
                </p>
            </div>

            <form onSubmit={submit} className="space-y-3.5">
                {/* Full Name */}
                <div>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={data.name}
                        className="w-full px-5 py-3.5 bg-[#f4f4f5] focus:bg-gray-100/90 border-0 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-black/10 text-base font-normal transition-all"
                        autoComplete="name"
                        placeholder="Full name"
                        autoFocus={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-1.5 px-2 text-left" />
                </div>

                {/* Email Address */}
                <div>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="w-full px-5 py-3.5 bg-[#f4f4f5] focus:bg-gray-100/90 border-0 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-black/10 text-base font-normal transition-all"
                        autoComplete="username"
                        placeholder="Email address"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-1.5 px-2 text-left" />
                </div>

                {/* Password */}
                <div className="relative">
                    <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={data.password}
                        className="w-full px-5 py-3.5 pr-12 bg-[#f4f4f5] focus:bg-gray-100/90 border-0 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-black/10 text-base font-normal transition-all"
                        autoComplete="new-password"
                        placeholder="Password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
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

                {/* Confirm Password */}
                <div className="relative">
                    <input
                        id="password_confirmation"
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="w-full px-5 py-3.5 pr-12 bg-[#f4f4f5] focus:bg-gray-100/90 border-0 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-black/10 text-base font-normal transition-all"
                        autoComplete="new-password"
                        placeholder="Confirm password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    <InputError message={errors.password_confirmation} className="mt-1.5 px-2 text-left" />
                </div>

                {/* Register Button */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-full bg-black hover:bg-gray-800 text-white font-semibold py-3.5 text-base shadow-md hover:shadow-lg active:scale-[0.99] transition-all duration-200 disabled:opacity-50"
                    >
                        Create Account
                    </button>
                </div>
            </form>

            {/* OR Divider */}
            <div className="my-5 flex items-center justify-center">
                <span className="text-xs uppercase font-medium text-gray-400 tracking-wider">
                    OR
                </span>
            </div>

            {/* Continue with Google */}
            <a
                href={route('auth.google')}
                className="w-full rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-4 flex items-center justify-center gap-3 transition-all shadow-sm text-sm group active:scale-[0.99]"
            >
                <svg className="w-5 h-5 shrink-0 group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
            </a>

            {/* Footer Sign in link */}
            <div className="mt-8 text-center">
                <p className="text-sm text-gray-500 font-medium">
                    Already registered?{' '}
                    <Link
                        href={route('login')}
                        className="text-gray-900 font-semibold hover:underline transition-all"
                    >
                        Log in
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}


