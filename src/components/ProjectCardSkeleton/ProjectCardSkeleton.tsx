export const ProjectCardSkeleton = () => {
  return (
    <div className="bg-white border border-border rounded-xl p-6 relative overflow-hidden">
      <div className="animate-pulse">
        <div className="flex gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
          <div className="flex flex-col gap-2">
            <div className="w-32 h-3 bg-gray-200 rounded"></div>
            <div className="w-20 h-2 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="w-3/4 h-5 bg-gray-200 rounded mb-4"></div>
        <div className="flex gap-2 mb-4">
          <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
          <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded mb-2"></div>
        <div className="w-2/3 h-3 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
}
