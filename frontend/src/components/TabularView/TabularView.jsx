import "./TabularView.css";
import { useState, useMemo } from "react";

const TabularView = ({ data = [], onUpdate }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editIdx, setEditIdx] = useState(null);
  const [editRow, setEditRow] = useState({});

  // Initialize internal table data only once
  // const [data, setdata] = useState(() => [...data]);

  const rowsPerPage = 10;

  // Dynamically get columns from data
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter(row =>
      Object.values(row)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Edit handlers
  const handleEdit = (idx) => {
    setEditIdx(idx);
    setEditRow({ ...paginatedData[idx] });
  };

  const handleEditChange = (e, col) => {
    setEditRow({ ...editRow, [col]: e.target.value });
  };

  const handleEditSave = (idx) => {
  const globalIdx = (page - 1) * rowsPerPage + idx;
  const updated = [...data]; // Clone the prop data
  updated[globalIdx] = editRow;
  setEditIdx(null);
  if (onUpdate) onUpdate(updated);  // Send updated data to the parent
};

  const handleEditCancel = () => {
    setEditIdx(null);
    setEditRow({});
  };

  // Delete handler
  const handleDelete = (idx) => {
  if (!window.confirm("Are you sure you want to delete this record?")) return;
  const globalIdx = (page - 1) * rowsPerPage + idx;
  const updated = data.filter((_, i) => i !== globalIdx);
  if (onUpdate) onUpdate(updated);  // Notify parent about deletion
};

  // Pagination controls
  const renderPagination = () => (
    <div className="tabularview-pagination">
      <button onClick={() => setPage(1)} disabled={page === 1}>{"<<"}</button>
      <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
      <button onClick={() => setPage(totalPages)} disabled={page === totalPages}>{">>"}</button>
    </div>
  );

  return (
    <div className="tabularview-container">
      <div className="tabularview-toolbar">
        <div>
          <button className="tabularview-btn">Copy</button>
          <button className="tabularview-btn">CSV</button>
          <button className="tabularview-btn">Excel</button>
          <button className="tabularview-btn">PDF</button>
          <button className="tabularview-btn">Print</button>
        </div>
        <div>
          <label className="tabularview-search-label">Search:</label>
          <input
            type="text"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="tabularview-search-input"
            placeholder="Search..."
          />
        </div>
      </div>
      <table className="tabularview-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col} className="tabularview-th">{col}</th>
            ))}
            <th className="tabularview-th">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="tabularview-no-data">
                No data found.
              </td>
            </tr>
          ) : (
            paginatedData.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "tabularview-tr-even" : "tabularview-tr-odd"}>
                {editIdx === idx ? (
                  <>
                    {columns.map(col => (
                      <td key={col} className="tabularview-td">
                        <input
                          type="text"
                          value={editRow[col] || ""}
                          onChange={e => handleEditChange(e, col)}
                          style={{ width: "100%" }}
                        />
                      </td>
                    ))}
                    <td className="tabularview-td">
                      <button className="tabularview-btn" onClick={() => handleEditSave(idx)}>Save</button>
                      <button className="tabularview-btn" onClick={handleEditCancel}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    {columns.map(col => (
                      <td key={col} className="tabularview-td">{row[col]}</td>
                    ))}
                    <td className="tabularview-td">
                      <button className="tabularview-btn" onClick={() => handleEdit(idx)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(idx)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="tabularview-footer">
        <span>
          Showing {filteredData.length === 0 ? 0 : (page - 1) * rowsPerPage + 1} to{" "}
          {Math.min(page * rowsPerPage, filteredData.length)} of {filteredData.length} entries
        </span>
        {renderPagination()}
      </div>
    </div>
  );
}

export default TabularView;