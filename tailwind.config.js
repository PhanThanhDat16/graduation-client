/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '375px',
      sm: '768px',
      md: '1024px',
      lg: '1280px',
      xl: '1650px'
    },
    extend: {
      colors: {
        primaryColor: 'var(--Oxford-Blue)',
        indigo: {
          950: '#1B2A6B'
        },
        amber: {
          500: '#F59E0B'
        },

        primary: '#1B2A6B', // Deep Indigo
        accent: '#F59E0B', // Amber Accent
        success: '#16A34A', // Màu thành công (Xanh lá)
        danger: '#DC2626', // Màu cảnh báo (Đỏ)
        page: '#F8FAFC', // Nền trang web (Xám siêu nhạt)
        card: '#FFFFFF', // Nền các thẻ Card (Trắng)
        border: '#E5E7EB', // Màu viền tiêu chuẩn
        'text-main': '#1E293B', // Text chính
        'text-sub': '#64748B', // Text phụ
        'text-muted': '#94A3B8' // Text mờ
      },
      fontFamily: {
        // 4. Gộp tất cả các Font chữ
        rubik: ['rubik', 'sans-serif'],
        publish: ['Public Sans', 'sans-serif'],
        heading: ['"Be Vietnam Pro"', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
}
