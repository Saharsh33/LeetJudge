import React from 'react';

export default function Badge({ children, color = 'var(--text-secondary)', bg = 'transparent', border = 'var(--border-color)' }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.15rem 0.5rem',
      borderRadius: 'var(--radius)',
      fontSize: '0.75rem',
      fontWeight: '500',
      color: color,
      backgroundColor: bg,
      border: `1px solid ${border}`,
      whiteSpace: 'nowrap'
    }}>
      {children}
    </span>
  );
}
