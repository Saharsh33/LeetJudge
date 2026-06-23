import React from 'react';

export default function Input({ label, id, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
      {label && (
        <label htmlFor={id} style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-main)' }}>
          {label}
        </label>
      )}
      <input
        id={id}
        style={{
          padding: '0.5rem',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border-color)',
          fontSize: '0.875rem',
          outline: 'none',
          transition: 'border-color 0.15s ease',
          backgroundColor: 'var(--surface)',
          color: 'var(--text-main)'
        }}
        onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
        onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
        {...props}
      />
    </div>
  );
}
