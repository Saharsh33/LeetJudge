import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';

export default function MarkdownRenderer({ content }) {
  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          img: ({node, src, ...props}) => {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
            const baseUrl = apiUrl.replace(/\/api$/, '');
            const finalSrc = src?.startsWith('/uploads') ? `${baseUrl}${src}` : src;
            return <img src={finalSrc} style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }} {...props} />;
          },
          table: ({node, ...props}) => (
            <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }} {...props} />
            </div>
          ),
          th: ({node, ...props}) => (
            <th style={{ padding: '0.5rem 0.75rem', borderBottom: '2px solid var(--border-color)', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }} {...props} />
          ),
          td: ({node, ...props}) => (
            <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-color)' }} {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
