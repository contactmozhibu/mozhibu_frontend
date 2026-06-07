import "./AdminTable.css";

const AdminTable = ({ columns, data, actions, loading = false }) => {
  if (loading) {
    return <div className="table-loading">Loading...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="table-empty">No data available</div>;
  }

  return (
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={`col-${col.key}`}>
                {col.label}
              </th>
            ))}
            {actions && <th className="col-actions">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              {columns.map((col) => (
                <td key={col.key} className={`col-${col.key}`}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              {actions && (
                <td className="col-actions">
                  <div className="action-buttons">
                    {actions.map((action, i) => (
                      <button
                        key={i}
                        className={`action-btn action-${action.type}`}
                        onClick={() => action.handler(row)}
                        title={action.label}
                      >
                        {action.icon || action.label}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
