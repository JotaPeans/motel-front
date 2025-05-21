"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dispatch, SetStateAction, useCallback } from "react";
import { Button } from "./ui/button";

interface SimplePaginatorProps {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  disableNext?: boolean;
}

const SimplePaginator = ({
  currentPage,
  setCurrentPage,
  disableNext,
}: SimplePaginatorProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        size="icon"
        variant="secondary"
        className="rounded-lg"
        onClick={() => setCurrentPage((prev) => --prev)}
        disabled={currentPage <= 1}
      >
        <ChevronLeft />
      </Button>
      <span className="size-9 min-w-9 select-none rounded-lg border flex items-center justify-center dark:bg-input/30">
        {currentPage}
      </span>
      <Button
        size="icon"
        variant="secondary"
        className="rounded-lg"
        onClick={() => setCurrentPage((prev) => ++prev)}
        disabled={disableNext}
      >
        <ChevronRight />
      </Button>
    </div>
  );
};

export default SimplePaginator;
