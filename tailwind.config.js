/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    './pages/**/*.{html,js}',
    './components/**/*.{html,js}',
  ],
  theme: {
    extend: {
      fontFamily: {
        "Inter": ['Inter', 'sans-serif'],
      },
      colors: {
        "morado": '#D9CEFF',
        "morad0-50": '#faf8fc',
        "morad0-100": '#f4eef9',
        "morad0-200": '#ece0f4',
        "morad0-300": '#dcc7eb',
        "morado-400": '#CDAEE2',
        "morado-500": '#af7ece',
        "morado-600": '#9a61bc',
        "morado-700": '#834da3',
        "morado-800": '#6e4386',
        "morado-900": '#5a376c',
        "verde": '#A4E550',
        "verde-correct": '#B7FF90',
        "rojo-mal": '#FF9494',
        "azul-op": '#2B40FE',
        "azul-op-rell": '#448FFF',
      },
    },
    plugins: [],
  }
}

