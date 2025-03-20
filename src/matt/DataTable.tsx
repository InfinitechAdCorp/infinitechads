"use client"

import type React from "react"
import { useState } from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"

interface Column {
    key: string
    header: string
    renderCell?: (row: any) => React.ReactNode
}

interface DataTableProps {
    columns: Column[]
    data: any[];
}

const DataTable = ({ columns, data }: DataTableProps) => {
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [visibleColumns, setVisibleColumns] = useState(columns.map(col => col.key))

    const toggleColumn = (key: string) => {
        setVisibleColumns(prev =>
            prev.includes(key) ? prev.filter(col => col !== key) : [...prev, key]
        )
    }

    const filteredData = data.filter((item) =>
        columns.some((column) =>
            visibleColumns.includes(column.key) &&
            String(item[column.key]).toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    const totalPages = Math.ceil(filteredData.length / rowsPerPage)
    const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

    return (
        <div className="w-full max-w-7xl mx-auto p-4 space-y-4">
            <div className="flex flex-col sm:flex-col justify-between gap-4">
                <input
                    type="search"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border px-3 py-2 rounded-md text-sm w-full sm:max-w-sm sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Columns</h3> */}
            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex ">
                {columns.map((column) => (
                    <label
                        key={column.key}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium transition-colors cursor-pointer"
                    >
                        <input
                            type="checkbox"
                            checked={visibleColumns.includes(column.key)}
                            onChange={() => toggleColumn(column.key)}
                            className="sr-only peer"
                        />
                        <span className="ml-3 text-gray-700 peer-checked:text-blue-600 transition-colors duration-300 ease-in-out">
                            {column.header}
                        </span>
                    </label>
                ))}
            </ul>

            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-2">
                    <small className="text-sm text-gray-500">Rows per page:</small>
                    <select
                        value={rowsPerPage}
                        onChange={(e) => setRowsPerPage(Number(e.target.value))}
                        className="text-sm text-gray-500"
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                        <option value="25">25</option>
                    </select>
                </div>
                <small className="text-sm text-gray-500">Total: {filteredData.length}</small>
            </div>

            <div className="overflow-x-auto rounded-lg shadow">
                <table className="w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.filter(col => visibleColumns.includes(col.key)).map((column) => (
                                <th
                                    key={column.key}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {paginatedData.map((item, index) => (
                            <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                {columns.filter(col => visibleColumns.includes(col.key)).map((column) => (
                                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {column.renderCell ? column.renderCell(item) : item[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FaChevronLeft className="h-5 w-5 mr-2" />
                    Previous
                </button>
                <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                    <FaChevronRight className="h-5 w-5 ml-2" />
                </button>
            </div>
        </div >
    )
}

export default DataTable