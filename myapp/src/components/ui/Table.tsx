import { useState } from "react";

export type TableProps<T> = {
    columns: { key: keyof T; label: string }[]; // Array of columns with keys and labels
    data: T[]; // Array of data
};

function Table<T>({ columns, data }: TableProps<T>) {
    // State to store the toggle values for each row (if applicable)
    const [switchStates, setSwitchStates] = useState<{ [key: number]: boolean }>({});

    const handleSwitchChange = (rowIndex: number) => {
        setSwitchStates((prevState: { [key: number]: boolean }) => ({
            ...prevState,
            [rowIndex]: !prevState[rowIndex],
        }));
    }
    return (
        <div className="overflow-x-auto">
            {data?.length > 0 ? (
                <>
                    <table className="table-auto w-full border-collapse border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                {columns.map((column: { key: keyof T; label: string }) => (
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
                                data.map((row: T, rowIndex: number) => (
                                    <tr key={rowIndex} className="even:bg-gray-50">
                                        {columns.map((column: { key: keyof T; label: string; render?: (row: T) => React.ReactNode }) => (
                                            <td
                                                key={`${rowIndex}-${column.key as string}`}
                                                className="border border-gray-300 px-4 py-2 text-sm text-gray-700"
                                            >
                                                {column.key === 'action' && column.render
                                                    ? column.render(row)
                                                    : typeof row[column.key] === "object" &&
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
                </>
            ) : (
                <h1>No data Available</h1>
            )}
        </div>
    );
}
