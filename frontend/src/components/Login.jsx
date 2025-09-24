import React, { useState } from 'react';
import { useAuth } from '../utils/authContext.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const { login } = useAuth();

  const testAccounts = [
    {
      type: 'Acme Admin',
      email: 'admin@acme.test',
      password: 'password',
      tenant: 'Acme',
      role: 'Admin'
    },
    {
      type: 'Acme Member', 
      email: 'user@acme.test',
      password: 'password',
      tenant: 'Acme',
      role: 'Member'
    },
    {
      type: 'Globex Admin',
      email: 'admin@globex.test', 
      password: 'password',
      tenant: 'Globex',
      role: 'Admin'
    },
    {
      type: 'Globex Member',
      email: 'user@globex.test',
      password: 'password', 
      tenant: 'Globex',
      role: 'Member'
    }
  ];

  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
    setEmail(account.email);
    setPassword(account.password);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleManualInput = () => {
    setSelectedAccount(null);
    setPassword('password'); // Still pre-fill password for convenience
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h2>📝 Yardstick Notes</h2>
        <p>Multi-tenant SaaS Application</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              handleManualInput();
            }}
            required
            placeholder="Enter your email..."
          />
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              handleManualInput();
            }}
            required
            placeholder="Enter your password..."
          />
        </div>

        {error && (
          <div className="error" style={{marginBottom: '1rem'}}>
            ⚠️ {error}
          </div>
        )}

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
          style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}
        >
          {loading ? (
            <>
              <span className="loading-spinner">⏳</span>
              Logging in...
            </>
          ) : (
            <>
              <span>🔑</span>
              Login to Dashboard
            </>
          )}
        </button>
      </form>

      <div className="quick-login-section">
        <h4>🚀 Quick Login (Test Accounts)</h4>
        <p style={{textAlign: 'center', color: '#666', marginBottom: '1rem', fontSize: '0.9rem'}}>
          Click any account below to auto-fill credentials
        </p>
        
        <div className="quick-login-grid">
          {testAccounts.map((account, index) => (
            <button
              key={index}
              type="button"
              className={`quick-login-btn ${selectedAccount?.email === account.email ? 'active' : ''}`}
              onClick={() => handleAccountSelect(account)}
            >
              <span className="account-type">
                {account.tenant} {account.role}
              </span>
              <span className="account-email">
                {account.email}
              </span>
            </button>
          ))}
        </div>
        
        <div style={{textAlign: 'center', fontSize: '0.8rem', color: '#888'}}>
          All accounts use password: <strong>password</strong>
        </div>
      </div>

      <div style={{marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '10px', textAlign: 'center'}}>
        <h4 style={{marginBottom: '0.5rem', color: '#333'}}>🧪 Testing Features</h4>
        <div style={{fontSize: '0.8rem', color: '#666', lineHeight: '1.4'}}>
          • <strong>Tenant Isolation:</strong> Acme and Globex data separated<br/>
          • <strong>Free Plan:</strong> Limited to 3 notes per tenant<br/>
          • <strong>Pro Plan:</strong> Unlimited notes (Admin can upgrade)<br/>
          • <strong>Role-based Access:</strong> Admin vs Member permissions
        </div>
      </div>
    </div>
  );
};

export default Login;