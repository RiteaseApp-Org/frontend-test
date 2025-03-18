import { useState, useEffect } from 'react';

export const useCommentAnnotation = (currentPage, zoomLevel, file) => {
  // Generate a unique identifier for the file
  const getFileId = () => {
    if (!file) return null;
    if (file instanceof File) {
      // For uploaded files, use name and last modified date
      return `${file.name}-${file.lastModified}`;
    }
    // For URLs, use the URL itself
    return file.toString();
  };

  const fileId = getFileId();

  const [commentAnnotations, setCommentAnnotations] = useState(() => {
    // Load comments from localStorage on initial render
    const savedComments = localStorage.getItem('pdfComments');
    const allComments = savedComments ? JSON.parse(savedComments) : {};
    // Only return comments for current file
    return fileId ? (allComments[fileId] || []) : [];
  });
  const [activeComment, setActiveComment] = useState(null);

  // Save to localStorage whenever comments change
  useEffect(() => {
    if (fileId) {
      const savedComments = localStorage.getItem('pdfComments');
      const allComments = savedComments ? JSON.parse(savedComments) : {};
      
      // Update comments for current file
      allComments[fileId] = commentAnnotations;
      
      localStorage.setItem('pdfComments', JSON.stringify(allComments));
    }
  }, [commentAnnotations, fileId]);

  const handleComment = (e, containerRef) => {
    if (!containerRef.current || !fileId) return; // Don't allow comments if no file is loaded

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (zoomLevel / 100);
    const y = (e.clientY - rect.top) / (zoomLevel / 100);

    const newComment = {
      id: Date.now(),
      type: "comment",
      x,
      y,
      comment: "",
      page: currentPage,
      timestamp: new Date().toLocaleString(),
      fileId, // Store fileId with the comment
    };

    setCommentAnnotations(prev => [...prev, newComment]);
    setActiveComment(newComment.id);
  };

  const updateComment = (id, comment) => {
    setCommentAnnotations(prev =>
      prev.map(annotation =>
        annotation.id === id
          ? { 
              ...annotation, 
              comment,
              lastEdited: new Date().toLocaleString()
            }
          : annotation
      )
    );
  };

  const saveComment = () => {
    setActiveComment(null);
  };

  const deleteComment = (id) => {
    setCommentAnnotations(prev => prev.filter(annotation => annotation.id !== id));
    setActiveComment(null);
  };

  return {
    commentAnnotations: fileId ? commentAnnotations : [], // Only return comments if file is loaded
    activeComment,
    handleComment,
    updateComment,
    saveComment,
    setActiveComment,
    deleteComment,
  };
}; 