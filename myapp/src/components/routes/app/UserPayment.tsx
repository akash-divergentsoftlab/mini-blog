import { CircleDollarSign } from 'lucide-react';
import React, { useState } from 'react';

interface RowData {
  name: string;
  age: number;
  occupation: string;
  email?: string;
  phone?: string;
}

const data: RowData[] = [
  { name: 'John Doe', age: 30, occupation: 'Software Developer', email: 'john@example.com', phone: '123-456-7890' },
  { name: 'Jane Smith', age: 25, occupation: 'Designer', email: 'jane@example.com', phone: '987-654-3210' },
  { name: 'Sam Johnson', age: 35, occupation: 'Manager', email: 'sam@example.com', phone: '555-555-5555' }
];

const columns: (keyof RowData)[] = ['name', 'age', 'occupation', 'email', 'phone'];

const UserPayment: React.FC = () => {

  const [switchStates, setSwitchStates] = useState<boolean[]>(data.map(() => false));

  // Function to handle switch toggle
  const handleSwitchToggle = (rowIndex: number) => {
    const updatedSwitchStates = [...switchStates];
    updatedSwitchStates[rowIndex] = !updatedSwitchStates[rowIndex]; // Toggle the state
    setSwitchStates(updatedSwitchStates);
  };

  return (
    <div className="flex flex-col w-full gap-4">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="border-b border-gray-300">
            {columns.map((column, index) => (
              <th key={index} className="px-4 py-2 text-left border-r border-gray-300">
                {column.charAt(0).toUpperCase() + column.slice(1)}
              </th>
            ))}
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`border-b border-gray-300 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`} // Odd/Even row background
            >
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-4 py-2 border-r border-gray-300">
                  {row[column]}
                </td>
              ))}
              <td className="px-4 py-2 text-center">
                 <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={switchStates[rowIndex]} // Bind checkbox to state
                    onChange={() => handleSwitchToggle(rowIndex)} // Toggle switch state on change
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserPayment;
