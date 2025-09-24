import React, { useState } from 'react';
import api from '../utils/api.js';
import { useAuth } from '../utils/authContext.jsx';

const CreateNote = ({ onNoteCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/notes', { title, content });
      onNoteCreated(response.data);
      setTitle('');
      setContent('');
      setError('');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter note title..."
          required
          disabled={loading}
        />
      </div>
      
      <div className="form-group">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note content here..."
          required
          rows="5"
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '1rem',
            border: '2px solid #e1e5e9',
            borderRadius: '10px',
            fontFamily: 'inherit',
            resize: 'vertical',
            fontSize: '1rem',
            background: '#f8f9fa',
            transition: 'all 0.3s ease'
          }}
        />
      </div>

      {error && (
        <div className="error">
          ⚠️ {error}
        </div>
      )}

      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={loading}
        style={{ minWidth: '150px' }}
      >
        {loading ? (
          <>
            <span>⏳</span>
            Creating...
          </>
        ) : (
          <>
            <span>📄</span>
            Create Note
          </>
        )}
      </button>
    </form>
  );
};

export default CreateNote;