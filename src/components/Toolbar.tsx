import React from 'react';
import { 
  CursorArrowRaysIcon, 
  PencilIcon, 
  ArrowUpTrayIcon,
  ChatBubbleLeftRightIcon,
  PencilSquareIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { PdfViewerState } from '../types';

interface ToolbarProps {
  currentTool: PdfViewerState['currentTool'];
  currentColor: string;
  setCurrentTool: (tool: PdfViewerState['currentTool']) => void;
  setCurrentColor: (color: string) => void;
  onExport: () => void;
  onImport: () => void;
  scale: number;
  setScale: (scale: number) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  currentTool,
  currentColor,
  setCurrentTool,
  setCurrentColor,
  onExport,
  onImport,
  scale,
  setScale,
}) => {
  const tools = [
    { id: 'cursor', name: 'Select', icon: CursorArrowRaysIcon },
    { id: 'highlight', name: 'Highlight', icon: PencilIcon },
    { id: 'underline', name: 'Underline', icon: PencilSquareIcon },
    { id: 'comment', name: 'Comment', icon: ChatBubbleLeftRightIcon },
    { id: 'signature', name: 'Signature', icon: PencilSquareIcon },
  ];

  const colors = [
    { id: 'yellow', value: '#FFEB3B' },
    { id: 'green', value: '#4CAF50' },
    { id: 'blue', value: '#2196F3' },
    { id: 'red', value: '#F44336' },
    { id: 'purple', value: '#9C27B0' },
  ];

  const zoomOptions = [
    { value: 0.5, label: '50%' },
    { value: 0.75, label: '75%' },
    { value: 1, label: '100%' },
    { value: 1.25, label: '125%' },
    { value: 1.5, label: '150%' },
    { value: 2, label: '200%' },
  ];

  return (
    <div className="flex flex-wrap bg-white shadow-sm border border-gray-200 rounded-md p-2 mb-4">
      {/* Tools Section */}
      <div className="flex mr-4 border-r border-gray-200 pr-4">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className={`p-2 rounded-md mr-1 ${
              currentTool === tool.id 
                ? 'bg-blue-100 text-blue-600' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
            onClick={() => setCurrentTool(tool.id as PdfViewerState['currentTool'])}
            title={tool.name}
          >
            <tool.icon className="h-5 w-5" />
          </button>
        ))}
      </div>

      {/* Colors Section - Only show when highlight or underline is selected */}
      {(currentTool === 'highlight' || currentTool === 'underline' || currentTool === 'comment') && (
        <div className="flex items-center mr-4 border-r border-gray-200 pr-4">
          <span className="text-sm text-gray-600 mr-2">Color:</span>
          {colors.map((color) => (
            <div
              key={color.id}
              className={`h-5 w-5 rounded-full mr-1 cursor-pointer ${
                currentColor === color.value ? 'ring-2 ring-offset-1 ring-blue-500' : ''
              }`}
              style={{ backgroundColor: color.value }}
              onClick={() => setCurrentColor(color.value)}
              title={color.id}
            />
          ))}
        </div>
      )}

 
      <div className="flex items-center mr-4 border-r border-gray-200 pr-4">
        <span className="text-sm text-gray-600 mr-2">Zoom:</span>
        <select
          className="text-sm border border-gray-300 rounded px-2 py-1"
          value={scale.toString()}
          onChange={(e) => setScale(parseFloat(e.target.value))}
        >
          {zoomOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

     
      <div className="flex">
        <button
          className="flex items-center p-2 rounded-md mr-1 hover:bg-gray-100 text-gray-700"
          onClick={onImport}
          title="Upload PDF"
        >
          <ArrowUpTrayIcon className="h-5 w-5 mr-1" />
          <span className="text-sm">Upload</span>
        </button>
        
        <button
          className="flex items-center p-2 rounded-md hover:bg-gray-100 text-gray-700"
          onClick={onExport}
          title="Export PDF"
        >
          <DocumentArrowDownIcon className="h-5 w-5 mr-1" />
          <span className="text-sm">Export</span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar; 