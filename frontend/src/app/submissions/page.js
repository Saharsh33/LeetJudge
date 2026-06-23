"use client";

import { useEffect, useState } from 'react';
import api from '../lib/api';
import Table from '../components/Table';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LANG_MAP = {
  54: 'C++',
  62: 'Java',
  71: 'Python 3',
  93: 'Node.js',
};

export default function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchSubmissions = async () => {
      try {
        const res = await api.get('/submissions/mySubmissions');
        // Backend returns { submissions: [...] }
        const data = res.data.submissions || res.data;
        setSubmissions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load submissions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [user, authLoading, router]);

  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case 'ACCEPTED': return 'var(--status-accepted)';
      case 'WRONG_ANSWER': return 'var(--status-wrong)';
      case 'TIME_LIMIT_EXCEEDED': case 'MEMORY_LIMIT_EXCEEDED': return 'var(--status-tle)';
      case 'PENDING': case 'COMPILING': case 'RUNNING': return 'var(--text-secondary)';
      default: return 'var(--status-wrong)';
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id', render: (row) => (
      <span style={{ fontFamily: 'var(--font-code)', fontSize: '0.8rem' }}>
        {row.id.substring(0, 8)}
      </span>
    )},
    { header: 'Problem', accessor: 'problem_title', render: (row) => (
      <Link href={`/problems/${row.problem_id}`} style={{ color: 'var(--primary)', fontWeight: '500', textDecoration: 'none' }} onClick={(e) => e.stopPropagation()}>
        {row.problem_title || row.problem_id.substring(0, 8)}
      </Link>
    )},
    { header: 'Verdict', accessor: 'verdict', render: (row) => (
      <span style={{ color: getVerdictColor(row.verdict), fontWeight: '600', fontSize: '0.8rem' }}>
        {row.verdict?.replace(/_/g, ' ')}
      </span>
    )},
    { header: 'Language', accessor: 'lang', render: (row) => LANG_MAP[row.lang] || `Lang ${row.lang}` },
    { header: 'Runtime', accessor: 'execution_time_ms', render: (row) => row.execution_time_ms != null ? `${row.execution_time_ms} ms` : '—' },
    { header: 'Submitted', accessor: 'timestamp', render: (row) => {
      const d = row.timestamp || row.createdAt;
      return d ? new Date(d).toLocaleString() : '—';
    }},
  ];

  if (authLoading || loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading submissions...</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>My Submissions</h1>
      {submissions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', color: 'var(--text-secondary)' }}>
          You haven't made any submissions yet.
        </div>
      ) : (
        <Table 
          columns={columns} 
          data={submissions} 
          onRowClick={(row) => router.push(`/submissions/${row.id}`)}
        />
      )}
    </div>
  );
}
