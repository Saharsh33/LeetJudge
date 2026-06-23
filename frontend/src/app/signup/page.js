"use client";

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Input from '../components/Input';
import Button from '../components/Button';
import Link from 'next/link';

export default function Signup() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(name, username, email, password);
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to sign up');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 60px)' }}>
      <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius)', width: '100%', maxWidth: '400px', border: '1px solid var(--border-color)' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>Join LeetJudge</h1>
        {error && <div style={{ color: 'var(--status-wrong)', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <Input label="Name" id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Username" id="username" type="text" required value={username} onChange={(e) => setUsername(e.target.value)} />
          <Input label="Email Address" id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Password" id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '1rem' }}>Create Account</Button>
        </form>
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: '500' }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
