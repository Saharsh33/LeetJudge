export default function ProblemGuidelines() {
  return (
    <div style={{
      backgroundColor: 'var(--bg-color)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius)',
      padding: '1.5rem',
      marginBottom: '2rem',
      fontSize: '0.875rem',
      color: 'var(--text-secondary)'
    }}>
      <h3 style={{ color: 'var(--text-main)', marginTop: 0, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        Guidelines for Problem Setters
      </h3>
      <ul style={{ margin: 0, paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <li><strong>Formatting:</strong> Use Markdown for structure (headings, lists, code blocks).</li>
        <li><strong>Math/Formulas:</strong> Only <code>$...$</code> and <code>$$...$$</code> are supported for LaTeX.</li>
        <li><strong>Images:</strong> Upload only relevant photos to save server space!</li>
        <li><strong>Examples:</strong> Add sample test cases for better clarity.</li>
        <li><strong>Constraints:</strong> Provide clear constraints.</li>
      </ul>
    </div>
  );
}
