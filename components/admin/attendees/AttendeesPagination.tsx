'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

interface AttendeesPaginationProps {
  currentPage: number;
  totalPages: number;
  items: Array<number | 'ellipsis-left' | 'ellipsis-right'>;
  onPageChange: (page: number) => void;
}

export default function AttendeesPagination({
  currentPage,
  totalPages,
  items,
  onPageChange,
}: AttendeesPaginationProps) {
  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(1)}
              className={
                currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'
              }
            >
              <ChevronsLeft className="h-4 w-4" />
            </PaginationPrevious>
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              className={
                currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'
              }
            >
              <ChevronLeft className="h-4 w-4" />
            </PaginationPrevious>
          </PaginationItem>

          {items.map((item, index) => {
            if (item === 'ellipsis-left' || item === 'ellipsis-right') {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            return (
              <PaginationItem key={item}>
                <PaginationLink
                  onClick={() => onPageChange(item as number)}
                  isActive={currentPage === item}
                  className="cursor-pointer"
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              className={
                currentPage === totalPages
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            >
              <ChevronRight className="h-4 w-4" />
            </PaginationNext>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(totalPages)}
              className={
                currentPage === totalPages
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            >
              <ChevronsRight className="h-4 w-4" />
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
