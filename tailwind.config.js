/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")], // dùng preset của NativeWind
  theme: {
    extend: {
      // nếu muốn custom màu, font, v.v. thì thêm ở đây
    },
  },
  plugins: [],
}

