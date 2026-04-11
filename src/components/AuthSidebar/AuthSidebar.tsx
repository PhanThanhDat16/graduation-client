export default function AuthSidebar() {
  return (
    <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-950 via-[#2A3B8C] to-[#4B3B8C] fixed top-0 right-0 bottom-0 items-center justify-center overflow-hidden">
      {/* Pattern lưới mờ đằng sau */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>

      <div className="relative z-10 text-center px-12">
        {/* Hình ảnh/Icon minh họa */}
        <div className="mb-12 flex justify-center relative">
          <div className="w-64 h-64 bg-white/10 rounded-full blur-xl absolute"></div>
          <svg
            className="w-64 h-64 text-amber-500/80 drop-shadow-2xl relative z-10"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>

        {/* Text quotes */}
        <h2 className="font-heading text-3xl text-white font-bold mb-4 leading-tight">
          Tự do trong công việc — <br />
          <span className="text-amber-500">An toàn trong thanh toán</span>
        </h2>
        <p className="text-indigo-200 text-lg">
          Nền tảng Escrow đảm bảo quyền lợi tuyệt đối cho cả Freelancer và Contractor.
        </p>
      </div>
    </div>
  )
}
