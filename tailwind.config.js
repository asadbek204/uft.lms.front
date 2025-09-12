/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html", "./src/**/*.tsx"
    ],
    theme: {
        extend: {
            backgroundImage: () => ({
                'gradient-light': "linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.98)), url('https://png.pngtree.com/background/20220718/original/pngtree-waving-red-and-blue-picture-image_1660147.jpg')",
                'gradient-dark': "linear-gradient(to bottom, rgba(0, 0, 40, 0.9), rgba(0, 0, 20, 0.9)), url('https://png.pngtree.com/background/20220718/original/pngtree-waving-red-and-blue-picture-image_1660147.jpg')",
            }),
            backgroundSize: {
                'full': 'cover',
            },
            backgroundPosition: {
                'center-center': 'left',
            },
            colors: {
                customText: '#a5a5a5',
                customDark: '#121212',
                customDarkInside: '#1e1e1e',
            },
        },
    },
    plugins: [],
}

