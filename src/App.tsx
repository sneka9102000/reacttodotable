import React, { useMemo } from "react";
import { Accessor, Cell, Column, useSortBy, useTable } from "react-table";
import todos from "./todos.json";

export default function Todos() {
  type TodosTable = {
    user_id: number;
    id: number;
    title: string;
    completed: boolean;
  };
  const data = useMemo<TodosTable[]>(() => todos.todos, []);
  const columns: Column<TodosTable>[] = useMemo(() => {
    return Object.keys(data[0]).map((d) => {
      // get cell type from data set
      const cellType = typeof data[0][d as keyof TodosTable];
      return {
        Header: () => {
          // set base style for header
          const base =
            "block py-3 px-3 uppercase font-medium text-md bg-blue-900 text-white";
          // align text depending on whether the data type is number or not
          return (
            <th
              className={
                cellType === "number"
                  ? `${base} text-right`
                  : `${base} text-center`
              }
            >
              {d}
            </th>
          );
        },
        accessor: d as keyof TodosTable,
        Cell: (props: Cell<TodosTable>) => {
          // set base style for cell
          const base = "py-2 px-2";
          // align text depending on whether the data type is number or not
          return (
            <div
              className={cellType === "number" ? `${base} text-right` : base}
            >
              {cellType === "boolean" ? props.value.toString() : props.value}
            </div>
          );
        }
      };
    });
  }, [data]);

  const tableInstance = useTable({ columns, data }, useSortBy);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = tableInstance;
  return (
    // columns={columns} data={data}
    <table {...getTableProps()} className="text-left w-full border-collapse">
      <thead>
        {
          // Loop over the header rows
          headerGroups.map((headerGroup) => (
            // Apply the header row props
            <tr {...headerGroup.getHeaderGroupProps()}>
              {
                // Loop over the headers in each row
                headerGroup.headers.map((column) => (
                  // Apply the header cell props
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {
                      // Render the header
                      column.render("Header")
                    }
                  </th>
                ))
              }
            </tr>
          ))
        }
      </thead>
      <tbody {...getTableBodyProps()}>
        {
          // Loop over the table rows
          rows.map((row) => {
            // Prepare the row for display
            prepareRow(row);
            return (
              // Apply the row props
              <tr {...row.getRowProps()} className="hover:bg-gray-200 border-b">
                {
                  // Loop over the rows cells
                  row.cells.map((cell) => {
                    // Apply the cell props
                    return (
                      <td {...cell.getCellProps()}>
                        {
                          // Render the cell contents
                          cell.render("Cell")
                        }
                      </td>
                    );
                  })
                }
              </tr>
            );
          })
        }
      </tbody>
    </table>
  );
}
