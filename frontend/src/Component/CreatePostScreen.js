import React, { useState } from 'react';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: 'Inter, sans-serif',
    padding: '20px',
  },
  postBox: {
    width: '100%',
    maxWidth: '600px', // Adjusted max-width for content creation
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333',
    fontSize: '2em',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxSizing: 'border-box',
    fontSize: '16px',
    transition: 'border-color 0.3s ease',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    marginBottom: '20px',
    border: '1px solid #ddd',
    // Increase height for description, allow vertical resize
    minHeight: '120px',
    resize: 'vertical',
    borderRadius: '8px',
    boxSizing: 'border-box',
    fontSize: '16px',
    fontFamily: 'Inter, sans-serif', // Ensure font consistency
    transition: 'border-color 0.3s ease',
  },
  authorText: {
    fontSize: '0.9em',
    color: '#777',
    marginBottom: '20px',
    textAlign: 'left',
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px', // Space between buttons
    marginTop: '10px',
  },
  button: {
    flex: 1, // Make buttons take equal width
    padding: '14px',
    backgroundColor: '#28a745', // Green for Create
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '17px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    boxShadow: '0 4px 8px rgba(40, 167, 69, 0.2)',
  },
  cancelButton: {
    flex: 1,
    padding: '14px',
    backgroundColor: '#6c757d', // Gray for Cancel
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '17px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    boxShadow: '0 4px 8px rgba(108, 117, 125, 0.2)',
  },
  buttonHover: {
    transform: 'translateY(-2px)',
  },
  createButtonHover: {
    backgroundColor: '#218838',
  },
  cancelButtonHover: {
    backgroundColor: '#5a6268',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '15px',
    fontSize: '14px',
  },
  success: {
    color: 'green',
    textAlign: 'center',
    marginBottom: '15px',
    fontSize: '14px',
  }
};

// Props: onPostSuccess (called after successful post), onCancel (called when user cancels)
const CreatePostScreen = ({ onPostSuccess, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Get author name from localStorage (set during login)
  const author = localStorage.getItem('userName') || 'Anonymous';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    if (!title || !description) {
      setError('Title and Description are required.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setError('Not authenticated. Please log in again.');
        setLoading(false);
        // Maybe redirect to login if no token? App.js will handle this generally
        return;
      }

      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Send the JWT token for authorization
        },
        body: JSON.stringify({ title, description, author }), // Send author name from localStorage
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Post created successfully:', data);
        setSuccessMsg('Post created successfully!');
        // Call the onPostSuccess prop to signal parent (FeedsScreen) to refresh
        setTimeout(() => {
          onPostSuccess(); // This should trigger a refresh and navigate back to feeds
        }, 1500); // Show success message for a bit then navigate
      } else {
        setError(data.msg || 'Failed to create post. Please try again.');
      }
    } catch (err) {
        console.error('Network error creating post:', err);
        setError('Could not connect to the server. Please ensure the backend is running.');
    } finally {
         setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.postBox}>
        <h2 style={styles.heading}>Create New Post</h2>
        {error && <p style={styles.error}>{error}</p>}
        {successMsg && <p style={styles.success}>{successMsg}</p>}
        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            required
            disabled={loading}
          />
          <textarea
            placeholder="Post Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
            required
            disabled={loading}
          ></textarea>
          <p style={styles.authorText}>Author: {author}</p> {/* Display author from local storage */}
          
          <div style={styles.buttonGroup}>
            <button
              type="submit"
              style={{ ...styles.button, ...(loading ? {} : styles.createButtonHover) }} // Apply hover only if not loading
              onMouseEnter={() => !loading && (styles.buttonHover = styles.createButtonHover)}
              onMouseLeave={() => styles.buttonHover = {}}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Post'}
            </button>
            <button
              type="button" // Important: type="button" to prevent form submission
              style={{ ...styles.cancelButton, ...(loading ? {} : styles.cancelButtonHover) }} // Apply hover only if not loading
              onMouseEnter={() => !loading && (styles.buttonHover = styles.cancelButtonHover)}
              onMouseLeave={() => styles.buttonHover = {}}
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostScreen;