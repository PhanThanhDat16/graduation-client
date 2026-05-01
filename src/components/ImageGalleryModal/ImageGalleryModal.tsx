import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageGalleryModalProps {
  images: string[]
  initialIndex: number
  onClose: () => void
}

export default function ImageGalleryModal({ images, initialIndex, onClose }: ImageGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  // Xử lý chuyển ảnh
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  // Xử lý phím tắt (Trái, Phải, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
      if (e.key === 'ArrowRight') setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [images.length, onClose])

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center animate-in fade-in backdrop-blur-md"
      onClick={onClose}
    >
      {/* Header: Số thứ tự ảnh & Nút đóng */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/60 to-transparent">
        <span className="text-white/80 font-medium text-sm px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </span>
        <button
          className="text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-full transition-all"
          onClick={onClose}
          title="Đóng (Esc)"
        >
          <X size={28} />
        </button>
      </div>

      {/* Vùng chứa ảnh chính */}
      <div className="relative w-full h-full flex items-center justify-center px-12 sm:px-20">
        <img
          key={currentIndex} // Đổi key để trigger animation khi chuyển ảnh
          src={images[currentIndex]}
          alt={`Gallery image ${currentIndex + 1}`}
          className="max-w-full max-h-[85vh] object-contain select-none animate-in fade-in duration-300"
          onClick={(e) => e.stopPropagation()} // Chặn tắt modal khi bấm vào hình
        />
      </div>

      {/* Nút điều hướng Trái / Phải (Chỉ hiện khi có nhiều hơn 1 ảnh) */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white bg-black/20 hover:bg-white/10 backdrop-blur-sm rounded-full transition-all z-50"
            title="Ảnh trước (Mũi tên trái)"
          >
            <ChevronLeft size={36} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white bg-black/20 hover:bg-white/10 backdrop-blur-sm rounded-full transition-all z-50"
            title="Ảnh tiếp theo (Mũi tên phải)"
          >
            <ChevronRight size={36} />
          </button>
        </>
      )}

      {/* Thumbnail list ở dưới cùng (Tùy chọn cho sinh động) */}
      {images.length > 1 && (
        <div
          className="absolute bottom-6 max-w-full px-6 flex items-center justify-center gap-2 overflow-x-auto z-50"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                currentIndex === idx
                  ? 'border-indigo-500 scale-110 opacity-100'
                  : 'border-transparent opacity-40 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
