export const EmptyState = ({ onReset }: { onReset: () => void }) => {
  return (
    <div className="text-center py-16 bg-white border border-border rounded-xl">
      <div className="text-5xl mb-4">🔍</div>
      <h3 className="text-lg font-bold text-text-main mb-2">Không tìm thấy dự án phù hợp</h3>
      <p className="text-sm text-text-sub mb-6">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
      <button
        onClick={onReset}
        className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
      >
        Xóa bộ lọc
      </button>
    </div>
  )
}
