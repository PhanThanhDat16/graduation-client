interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  // Create an array of page numbers: [1, 2, 3, ...]
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="mt-8 flex justify-center gap-2 flex-wrap">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-xl text-sm font-bold border transition-colors ${
            currentPage === page
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-text-sub hover:bg-page border-border'
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  )
}
