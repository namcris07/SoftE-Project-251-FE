import { useState, useMemo } from 'react';

// Đã loại bỏ TypeScript Interfaces

export function usePagination({
  data,
  itemsPerPage = 10,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  
  // Sử dụng useMemo để tính toán dữ liệu phân trang, đảm bảo chỉ chạy lại khi
  // data, currentPage hoặc itemsPerPage thay đổi.
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  const goToPage = (page) => {
    // Đảm bảo số trang nằm trong khoảng [1, totalPages]
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Chỉ mục bắt đầu và kết thúc để hiển thị thông tin "Showing X of Y"
  const totalItems = data.length;
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  return {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    nextPage,
    previousPage,
    canGoNext: currentPage < totalPages,
    canGoPrevious: currentPage > 1,
    startIndex,
    endIndex,
    totalItems,
  };
}