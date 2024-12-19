import React from "react";

interface TableProps<T> {
  columns: { key: keyof T; label: string }[];
  data: T[];
}

function Table<T>({ columns, data }: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key as string}
                className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="even:bg-gray-50">
                {columns.map((column) => (
                  <td
                    key={`${rowIndex}-${column.key as string}`}
                    className="border border-gray-300 px-4 py-2 text-sm text-gray-700"
                  >
                    {typeof row[column.key] === "object" &&
                    row[column.key] !== null
                      ? JSON.stringify(row[column.key])
                      : (row[column.key] as React.ReactNode) || "-"}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
