import React, { useState } from 'react';
import Header from '../components/Header.jsx';
import NotesList from '../components/NotesList.jsx';
import CreateNote from '../components/CreateNote.jsx';
import { useAuth } from '../utils/authContext.jsx';

const Dashboard = () => {
  const { user } = useAuth();
  const [refreshNotes, setRefreshNotes] = useState(0);

  const handleNoteCreated = () => {
    setRefreshNotes(prev => prev + 1);
  };

  return (
    <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'}}>
      <Header />
      
      <div className="container">
        <div className="notes-section">
          {user.tenant.plan === 'FREE' && (
            <div className="alert alert-warning">
              <strong>📊 Free Plan Active</strong> - You can create up to 3 notes. 
              {user.role === 'ADMIN' && (
                <span> Upgrade to <strong>Pro Plan</strong> for unlimited notes! 🚀</span>
              )}
            </div>
          )}

          {user.tenant.plan === 'PRO' && (
            <div className="alert alert-success">
              <strong>⭐ Pro Plan Active</strong> - Enjoy unlimited notes and all premium features! 🎉
            </div>
          )}

          <div className="create-note-form">
            <h3>📝 Create New Note</h3>
            <CreateNote onNoteCreated={handleNoteCreated} />
          </div>

          <div className="notes-stats">
            <h2>Your Notes</h2>
            <p>Manage your notes below. {user.tenant.plan === 'FREE' && `(${user.tenant.plan} Plan - 3 note limit)`}</p>
          </div>

          <NotesList key={refreshNotes} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;