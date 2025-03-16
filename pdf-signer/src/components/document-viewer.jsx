export const DocumentViewer = ({ zoomLevel, currentPage, selectedTool }) => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div 
        style={{ transform: `scale(${zoomLevel / 100})` }}
        className="transition-transform duration-200"
      >
        {/* Placeholder for PDF viewer implementation */}
        <div className="w-[800px] h-[1000px] bg-white shadow-lg">
          <p className="text-center pt-4">Page {currentPage}</p>
          {/* Add your PDF viewer implementation here */}
        </div>
      </div>
    </div>
  )
} 