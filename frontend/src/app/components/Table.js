import React from 'react';

export default function Table({ columns, data, onRowClick }) {
  return (
    <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
        <thead style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
          <tr>
            {columns.map((col, index) => (
              <th key={index} style={{ padding: '1rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              style={{
                borderBottom: rowIndex === data.length - 1 ? 'none' : '1px solid var(--border-color)',
                cursor: onRowClick ? 'pointer' : 'default',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (onRowClick) e.currentTarget.style.backgroundColor = 'var(--bg-color)';
              }}
              onMouseLeave={(e) => {
                if (onRowClick) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex} style={{ padding: '1rem', color: 'var(--text-main)' }}>
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
