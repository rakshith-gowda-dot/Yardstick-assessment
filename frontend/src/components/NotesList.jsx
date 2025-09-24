import React, { useState, useEffect } from 'react';
import api from '../utils/api.js';

const NotesList = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await api.get('/notes');
      setNotes(response.data);
    } catch (error) {
      setError('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    
    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter(note => note.id !== id));
    } catch (error) {
      setError('Failed to delete note');
    }
  };

  if (loading) return <div className="loading">Loading notes...</div>;

  return (
    <div>
      <h2>Notes ({notes.length})</h2>
      {error && <div className="alert alert-warning">{error}</div>}
      
      <div className="notes-grid">
        {notes.map((note) => (
          <div key={note.id} className="note-card">
            <div className="note-header">
              <h3 className="note-title">{note.title}</h3>
              <button
                onClick={() => deleteNote(note.id)}
                className="btn btn-danger"
                style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
              >
                Delete
              </button>
            </div>
            <p className="note-content">{note.content}</p>
            <div className="note-meta">
              By {note.author.email} on {new Date(note.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
        
        {notes.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
            No notes yet. Create your first note!
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesList;