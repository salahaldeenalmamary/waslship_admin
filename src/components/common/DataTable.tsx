import React, { useState } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronsUpDown, 
  ChevronLeft, 
  ChevronRight,
  Search,
  Loader2
} from 'lucide-react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '../ui/Table';

export interface Column<T> {
  id: string;
  header: React.ReactNode;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
  sortKey?: string;
  className?: string;
}

interface PaginationState {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

interface SortingState {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (key: string, order: 'asc' | 'desc') => void;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  pagination?: PaginationState;
  sorting?: SortingState;
  emptyState?: React.ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  pagination,
  sorting,
  emptyState
}: DataTableProps<T>) {
  
  const handleSortClick = (column: Column<T>) => {
    if (!sorting || !column.sortable) return;
    
    const sortKey = column.sortKey || String(column.id);
    const isCurrentSort = sorting.sortBy === sortKey;
    const newOrder = isCurrentSort && sorting.sortOrder === 'asc' ? 'desc' : 'asc';
    
    sorting.onSort(sortKey, newOrder);
  };

  const renderSortIcon = (column: Column<T>) => {
    if (!sorting || !column.sortable) return null;
    
    const sortKey = column.sortKey || String(column.id);
    if (sorting.sortBy !== sortKey) {
      return <ChevronsUpDown className="w-3.5 h-3.5 ml-1.5 text-slate-400 opacity-60 group-hover:opacity-100 transition-opacity" />;
    }
    
    return sorting.sortOrder === 'asc' 
      ? <ChevronUp className="w-3.5 h-3.5 ml-1.5 text-indigo-600 font-bold" />
      : <ChevronDown className="w-3.5 h-3.5 ml-1.5 text-indigo-600 font-bold" />;
  };

  const renderCellContent = (row: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    const val = row[column.accessor];
    return val !== undefined && val !== null ? String(val) : '';
  };

  // Pagination Helper Calculations
  const startItemIndex = pagination 
    ? (pagination.page - 1) * pagination.pageSize + 1 
    : 1;
  const endItemIndex = pagination 
    ? Math.min(pagination.page * pagination.pageSize, pagination.totalCount) 
    : data.length;
  const totalPages = pagination 
    ? Math.max(1, Math.ceil(pagination.totalCount / pagination.pageSize)) 
    : 1;

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead 
                    key={column.id}
                    className={`
                      ${column.sortable ? 'cursor-pointer select-none group hover:bg-slate-100/50 transition-colors' : ''}
                      ${column.className || ''}
                    `}
                    onClick={() => handleSortClick(column)}
                  >
                    <div className="flex items-center">
                      <span>{column.header}</span>
                      {renderSortIcon(column)}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Skeleton loading state
                Array.from({ length: pagination?.pageSize || 5 }).map((_, rIdx) => (
                  <TableRow key={`skeleton-row-${rIdx}`} className="animate-pulse">
                    {columns.map((col) => (
                      <TableCell key={`skeleton-cell-${col.id}`}>
                        <div className="h-4 bg-slate-100 rounded w-4/5 my-1"></div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="py-12 text-center text-slate-400">
                    {emptyState || (
                      <div className="flex flex-col items-center justify-center">
                        <Search className="w-10 h-10 mb-3 text-slate-300 stroke-[1.5]" />
                        <p className="text-base font-semibold text-slate-700">No results found</p>
                        <p className="text-xs text-slate-500 mt-1">We couldn't find any records matching the criteria.</p>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, rowIdx) => (
                  <TableRow key={`row-${rowIdx}`}>
                    {columns.map((column) => (
                      <TableCell key={`cell-${column.id}`} className={column.className}>
                        {renderCellContent(row, column)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Elegant Pagination Footer */}
        {pagination && pagination.totalCount > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-500">
              Showing <span className="font-medium text-slate-700">{startItemIndex}</span> to{' '}
              <span className="font-medium text-slate-700">{endItemIndex}</span> of{' '}
              <span className="font-medium text-slate-700">{pagination.totalCount}</span> results
            </div>

            <div className="flex items-center gap-4">
              {pagination.onPageSizeChange && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Show</span>
                  <select
                    className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                    value={pagination.pageSize}
                    onChange={(e) => pagination.onPageSizeChange?.(Number(e.target.value))}
                  >
                    {[10, 20, 50, 100].map((size) => (
                      <option key={size} value={size}>
                        {size} rows
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={pagination.page <= 1 || isLoading}
                  onClick={() => pagination.onPageChange(pagination.page - 1)}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-all active:scale-95 cursor-pointer"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="text-xs font-semibold text-slate-600 px-2 select-none">
                  Page {pagination.page} of {totalPages}
                </div>

                <button
                  type="button"
                  disabled={pagination.page >= totalPages || isLoading}
                  onClick={() => pagination.onPageChange(pagination.page + 1)}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-all active:scale-95 cursor-pointer"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
