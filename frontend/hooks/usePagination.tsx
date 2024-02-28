import { useState } from "react";

export function usePagination({ products }: { products: any[] }) {
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);

  const handlePrevious = () => {
    if (offset > 1) {
      const newOffset = offset - 10;
      const newLimit = limit - 10;
      setOffset(newOffset);
      setLimit(newLimit);
    }
  };

  const handleNext = () => {
    if (limit < products.length) {
      const newOffset = offset + 10;
      const newLimit = limit + 10;
      setOffset(newOffset);
      setLimit(newLimit);
    }
  };

  return { offset, limit, handlePrevious, handleNext };
}
