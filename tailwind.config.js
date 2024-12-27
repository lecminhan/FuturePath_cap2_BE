/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Thêm dòng này để Tailwind quét tất cả các tệp trong thư mục src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
