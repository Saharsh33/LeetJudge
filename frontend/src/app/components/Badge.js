import React from 'react';

export default function Badge({ children, color = 'var(--text-secondary)', bg = 'transparent', border = 'var(--border-color)' }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.2rem 0.6rem',
      borderRadius: 'var(--radius)',
      fontSize: '0.75rem',
      fontWeight: '600',
      letterSpacing: '0.02em',
      color: color,
      backgroundColor: bg,
      border: `1px solid ${border === 'transparent' ? 'transparent' : border}`,
      whiteSpace: 'nowrap'
    }}>
      {children}
    </span>
  );
}
