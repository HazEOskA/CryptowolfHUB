// CryptoWolf OS — Generic Data Table

import { cn } from '../../utils/cn';

interface Column<T> {
  key: string;
  header: string;
  render: (item: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  rowClassName?: (item: T, index: number) => string;
  onRowClick?: (item: T) => void;
  skeletonRows?: number;
}

export function DataTable<T>({
  columns,
  data,
  loading,
  emptyMessage = 'No data available',
  rowClassName,
  onRowClick,
  skeletonRows = 5,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#1E2130]">
            {columns.map(col => (
              <th
                key={col.key}
                className={cn(
                  'text-left text-xs text-gray-500 font-medium uppercase tracking-wider py-3 px-4',
                  col.headerClassName
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: skeletonRows }).map((_, i) => (
              <tr key={i} className="border-b border-[#1A1D2B]">
                {columns.map(col => (
                  <td key={col.key} className="py-3 px-4">
                    <div className="h-4 bg-white/5 rounded animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center text-gray-600">
                <div className="text-2xl mb-2">📭</div>
                <p>{emptyMessage}</p>
              </td>
            </tr>
          ) : (
            data.map((item, i) => (
              <tr
                key={i}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  'border-b border-[#1A1D2B] transition-colors',
                  onRowClick && 'cursor-pointer',
                  'hover:bg-white/[0.02]',
                  rowClassName?.(item, i)
                )}
              >
                {columns.map(col => (
                  <td key={col.key} className={cn('py-3 px-4', col.className)}>
                    {col.render(item, i)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
