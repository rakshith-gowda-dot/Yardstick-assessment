import React, { useState } from 'react';
import { useAuth } from '../utils/authContext.jsx';

const Header = () => {
  const { user, logout, upgradeToPro } = useAuth();
  const [upgrading, setUpgrading] = useState(false);

  // Debug info - remove this in production
  const debugInfo = `Role: ${user.role}, Plan: ${user.tenant.plan}, CanUpgrade: ${user.role === 'ADMIN' && user.tenant.plan === 'FREE'}`;

  const handleUpgrade = async () => {
    if (!window.confirm('Upgrade to Pro plan? This will remove the 3-note limit and provide unlimited notes.')) return;
    
    setUpgrading(true);
    const result = await upgradeToPro(user.tenant.slug);
    if (!result.success) {
      alert(`Upgrade failed: ${result.error}`);
    } else {
      alert('🎉 Successfully upgraded to Pro Plan! You can now create unlimited notes.');
    }
    setUpgrading(false);
  };

  console.log('Header Debug:', { 
    email: user.email, 
    role: user.role, 
    plan: user.tenant.plan,
    canUpgrade: user.role === 'ADMIN' && user.tenant.plan === 'FREE'
  });

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <div className="logo">
            Yardstick Notes
          </div>
          
          <div className="user-info">
            <div className="tenant-badge">
              🏢 {user.tenant.name} • {user.tenant.plan} PLAN
            </div>
            
            <div className="user-badge">
              👤 {user.email} ({user.role})
              {/* Debug info - remove in production */}
              <small style={{display: 'block', fontSize: '0.7rem', color: '#666'}}>
                {debugInfo}
              </small>
            </div>

            {user.role === 'ADMIN' && user.tenant.plan === 'FREE' && (
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="btn btn-success btn-sm"
              >
                {upgrading ? '⏳ Upgrading...' : '⭐ Upgrade to Pro'}
              </button>
            )}

            {user.role === 'ADMIN' && user.tenant.plan === 'PRO' && (
              <span style={{color: '#28a745', fontWeight: 'bold'}}>⭐ Pro Plan Active</span>
            )}

            <button onClick={logout} className="btn btn-danger btn-sm">
              🚪 Logout
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;