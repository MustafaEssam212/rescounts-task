import React, { useState, useRef, useEffect } from "react";

interface Column {
  key: string;
  label: string;
  width: number;
  visible: boolean;
}

interface Row {
  [key: string]: any;
}

interface DataGridProps {
  columns: Column[];
  data: Row[];
}

const DataGrid: React.FC<DataGridProps> = ({ columns, data }) => {
  const [visibleColumns, setVisibleColumns] = useState<Column[]>(columns);
  const [rows, setRows] = useState<Row[]>(data);
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);
  const [tempValue, setTempValue] = useState<string | number>("");
  const filterRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(rows.length / rowsPerPage);
  const paginatedRows = rows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  // Toggle column visibility
  const toggleColumnVisibility = (key: string) => {
    setVisibleColumns((prev) =>
      prev.map((col) => (col.key === key ? { ...col, visible: !col.visible } : col))
    );
  };

  // Resize column
  const handleColumnResize = (key: string, newWidth: number) => {
    setVisibleColumns((prev) =>
      prev.map((col) => (col.key === key ? { ...col, width: Math.max(newWidth, 50) } : col))
    );
  };

  // Start editing a cell
  const startEditing = (rowIndex: number, colKey: string, value: any) => {
    setEditingCell({ row: rowIndex, col: colKey });
    setTempValue(value);
  };

  // Save edited value
  const saveEdit = () => {
    if (editingCell) {
      const { row, col } = editingCell;
      setRows((prev) =>
        prev.map((r, i) => (i === row ? { ...r, [col]: tempValue } : r))
      );
      setEditingCell(null);
    }
  };


    // Toggle filter menu
    const toggleFilterMenu = () => {
        setFilterMenuOpen((prev) => !prev);
      };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", padding: "10px" }}>
      {/* Column Filter */}
      <div style={{ marginBottom: "10px", position: "relative" }}>
        <button
            onClick={toggleFilterMenu}
          style={{
            padding: "8px 12px",
            borderRadius: "4px",
            background: "#3498db",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Customize Columns ▼
        </button>
        <div
          style={{
            position: "absolute",
            background: "#fff",
            border: "1px solid #ddd",
            padding: "8px",
            boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
            borderRadius: "4px",
            display: "flex",
            flexDirection: "column",
            zIndex: 10,
            marginTop: "5px",
          }}
        >
        {filterMenuOpen && (
          <div
            ref={filterRef}
            style={{
              position: "absolute",
              background: "#fff",
              border: "1px solid #ddd",
              padding: "8px",
              boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
              borderRadius: "4px",
              display: "flex",
              flexDirection: "column",
              zIndex: 10,
              marginTop: "5px",
            }}
          >
            {columns.map((col) => (
              <label key={col.key} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="checkbox"
                  checked={col.visible}
                  onChange={() => toggleColumnVisibility(col.key)}
                />
                {col.label}
              </label>
            ))}
          </div>
        )}
        </div>
      </div>

      {/* Data Grid */}
      <div
        style={{
          overflowY: "auto",
          border: "1px solid #ddd",
          flex: 1,
          position: "relative",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", position: "sticky", top: 0, background: "#fff" }}>
          {visibleColumns.filter((col) => col.visible).map((col) => (
            <div
              key={col.key}
              style={{
                width: col.width,
                borderBottom: "1px solid #ddd",
                padding: "10px",
                fontWeight: "bold",
                position: "relative",
                userSelect: "none",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {col.label}
              {/* Resize Handle */}
              <span
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: "5px",
                  cursor: "ew-resize",
                  background: "#ccc",
                }}
                onMouseDown={(e) => {
                  const startX = e.clientX;
                  const startWidth = col.width;
                  const onMouseMove = (event: MouseEvent) => {
                    handleColumnResize(col.key, startWidth + (event.clientX - startX));
                  };
                  const onMouseUp = () => {
                    document.removeEventListener("mousemove", onMouseMove);
                    document.removeEventListener("mouseup", onMouseUp);
                  };
                  document.addEventListener("mousemove", onMouseMove);
                  document.addEventListener("mouseup", onMouseUp);
                }}
              />
            </div>
          ))}
        </div>

        {/* Rows */}
        {paginatedRows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            style={{
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid #ddd",
            }}
          >
            {visibleColumns.filter((col) => col.visible).map((col) => (
              <div
                key={col.key}
                style={{
                  width: col.width,
                  padding: "10px",
                  borderRight: "1px solid #ddd",
                  cursor: "pointer",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                onDoubleClick={() => startEditing(rowIndex, col.key, row[col.key])}
              >
                {editingCell?.row === rowIndex && editingCell?.col === col.key ? (
                  <input
                    type="text"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    onBlur={saveEdit}
                    autoFocus
                  />
                ) : (
                  row[col.key]
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={{ marginTop: "10px", display: "flex", justifyContent: "center", gap: "10px" }}>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          style={{
            padding: "8px 12px",
            background: currentPage === 1 ? "#ddd" : "#2ecc71",
            border: "none",
            color: "#fff",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            borderRadius: "4px",
          }}
        >
          Previous
        </button>
        <span style={{ padding: "8px 12px", fontSize: "16px" }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          style={{
            padding: "8px 12px",
            background: currentPage === totalPages ? "#ddd" : "#2ecc71",
            border: "none",
            color: "#fff",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            borderRadius: "4px",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataGrid;
