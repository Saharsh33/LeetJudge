import React from 'react';

export default function Button({ children, variant = 'primary', style, ...props }) {
  const baseStyle = {
    padding: '0.5rem 1rem',
    borderRadius: 'var(--radius)',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'background-color 0.15s ease',
    border: '1px solid transparent',
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--primary)',
      color: '#fff',
    },
    secondary: {
      backgroundColor: 'var(--bg-color)',
      color: 'var(--text-main)',
      border: '1px solid var(--border-color)',
    },
    danger: {
      backgroundColor: 'var(--status-wrong)',
      color: '#fff',
    }
  };

  const combinedStyle = { ...baseStyle, ...variants[variant], ...style };

  return (
    <button style={combinedStyle} {...props}>
      {children}
    </button>
  );
}
