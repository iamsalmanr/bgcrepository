import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'Inter', '"Hind Siliguri"', '"Noto Sans Bengali"', 'Figtree', ...defaultTheme.fontFamily.sans],
                heading: ['"Outfit"', '"Plus Jakarta Sans"', '"Hind Siliguri"', 'sans-serif'],
                display: ['"Outfit"', '"Plus Jakarta Sans"', '"Hind Siliguri"', 'sans-serif'],
                bangla: ['"Hind Siliguri"', '"Noto Sans Bengali"', '"SolaimanLipi"', '"Kalpurush"', 'sans-serif'],
                tiro: ['"Tiro Bangla"', '"Hind Siliguri"', '"Noto Sans Bengali"', 'sans-serif'],
                anton: ['"Anton"', 'sans-serif'],
            },
            colors: {
                military: {
                    50: '#f4f6ec',
                    100: '#e5eace',
                    200: '#cedaa1',
                    300: '#b1c36b',
                    400: '#95a840',
                    500: '#75882b',
                    600: '#5a6b1f',
                    700: '#45531a',
                    800: '#384318',
                    900: '#303916',
                    950: '#181e09',
                }
            }
        },
    },

    plugins: [forms],
};
