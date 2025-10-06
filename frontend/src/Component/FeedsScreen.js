import React, { useState, useEffect, useCallback } from 'react';
import CreatePostScreen from './CreatePostScreen.js';

const styles = {
  container: {
    minHeight: '100vh',
    padding: '50px 20px',
    background:
      'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    fontFamily: "'Poppins', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#222',
  },
  header: {
    width: '100%',
    maxWidth: 1000,
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 25,
    padding: '40px 50px',
    marginBottom: 60,
    boxShadow:
      '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    userSelect: 'none',
  },
  heading: {
    fontSize: 40,
    fontWeight: 900,
    color: '#0d1b2a',
    margin: 0,
    flex: '1 1 300px',
    textShadow: '0 2px 6px rgba(13, 27, 42, 0.2)',
  },
  buttonGroup: {
    display: 'flex',
    gap: 25,
    flexWrap: 'wrap',
    justifyContent: 'center',
    flex: '1 1 300px',
  },
  baseButton: {
    padding: '15px 40px',
    borderRadius: 35,
    border: 'none',
    fontSize: 18,
    fontWeight: 700,
    cursor: 'pointer',
    userSelect: 'none',
    boxShadow:
      '8px 8px 15px #a3b1c6, -8px -8px 15px #ffffff',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
  },
  createPostButton: {
    background:
      'linear-gradient(145deg, #6a11cb, #2575fc)',
    color: '#fff',
    boxShadow:
      '4px 4px 8px #1e39a7, -4px -4px 8px #6a11cb',
  },
  createPostHover: {
    background:
      'linear-gradient(145deg, #5c0ec9, #1e63fc)',
    transform: 'scale(1.05)',
    boxShadow:
      '6px 6px 12px #15307b, -6px -6px 12px #5c0ec9',
  },
  logoutButton: {
    background:
      'linear-gradient(145deg, #ff4e50, #f9d423)',
    color: '#fff',
    boxShadow:
      '4px 4px 8px #a13334, -4px -4px 8px #f9d423',
  },
  logoutHover: {
    background:
      'linear-gradient(145deg, #e03f41, #f0c71e)',
    transform: 'scale(1.05)',
    boxShadow:
      '6px 6px 12px #701e1f, -6px -6px 12px #f0c71e',
  },
  postList: {
    width: '100%',
    maxWidth: 1000,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 40,
  },
  postCard: {
    background: 'rgba(255, 255, 255, 0.28)',
    borderRadius: 25,
    padding: 30,
    boxShadow:
      '8px 8px 24px rgba(0, 0, 0, 0.1), -8px -8px 24px rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    userSelect: 'none',
  },
  postCardHover: {
    transform: 'translateY(-12px)',
    boxShadow:
      '12px 12px 40px rgba(0, 0, 0, 0.15), -12px -12px 40px rgba(255, 255, 255, 0.85)',
  },
  postTitle: {
    fontSize: 22,
    fontWeight: 800,
    marginBottom: 18,
    color: '#1a1a1a',
    textShadow: '0 1px 4px rgba(255, 255, 255, 0.7)',
  },
  postDescription: {
    fontSize: 16,
    lineHeight: 1.65,
    color: '#444',
    marginBottom: 25,
    whiteSpace: 'pre-wrap',
  },
  postAuthor: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'right',
  },
  message: {
    fontSize: 22,
    color: '#555',
    textAlign: 'center',
    marginTop: 70,
    padding: 30,
    background: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 18,
    boxShadow:
      '10px 10px 30px rgba(0, 0, 0, 0.12), -10px -10px 30px rgba(255, 255, 255, 0.5)',
  },
  errorMessage: {
    color: '#e63946',
    fontWeight: 'bold',
  },
};

const FeedsScreen = ({ onLogout }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreatePostForm, setShowCreatePostForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [isCreateHovered, setIsCreateHovered] = useState(false);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);
  const [hoveredPostId, setHoveredPostId] = useState(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('userToken');
      if (!token) {
        setError('Not authenticated. Please log in.');
        setLoading(false);
        onLogout();
        return;
      }

      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setError('Session expired or unauthorized. Please log in again.');
          onLogout();
          return;
        }
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(
        'Failed to load posts. Please ensure the backend is running and you are logged in.'
      );
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, refreshTrigger]);

  const handlePostSuccess = () => {
    setShowCreatePostForm(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleCancelCreatePost = () => {
    setShowCreatePostForm(false);
  };

  if (showCreatePostForm) {
    return (
      <CreatePostScreen
        onPostSuccess={handlePostSuccess}
        onCancel={handleCancelCreatePost}
      />
    );
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.message}>Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <p style={{ ...styles.message, ...styles.errorMessage }}>{error}</p>
        <button
          style={{
            ...styles.baseButton,
            ...styles.logoutButton,
            ...(isLogoutHovered ? styles.logoutHover : {}),
            marginTop: 30,
          }}
          onClick={onLogout}
          onMouseEnter={() => setIsLogoutHovered(true)}
          onMouseLeave={() => setIsLogoutHovered(false)}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.heading}>Welcome to the Feeds!</h1>
        <div style={styles.buttonGroup}>
          <button
            style={{
              ...styles.baseButton,
              ...styles.createPostButton,
              ...(isCreateHovered ? styles.createPostHover : {}),
            }}
            onMouseEnter={() => setIsCreateHovered(true)}
            onMouseLeave={() => setIsCreateHovered(false)}
            onClick={() => setShowCreatePostForm(true)}
          >
            Create Post
          </button>
          <button
            style={{
              ...styles.baseButton,
              ...styles.logoutButton,
              ...(isLogoutHovered ? styles.logoutHover : {}),
            }}
            onMouseEnter={() => setIsLogoutHovered(true)}
            onMouseLeave={() => setIsLogoutHovered(false)}
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <section style={styles.postList}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <article
              key={post._id}
              style={{
                ...styles.postCard,
                ...(hoveredPostId === post._id ? styles.postCardHover : {}),
              }}
              onMouseEnter={() => setHoveredPostId(post._id)}
              onMouseLeave={() => setHoveredPostId(null)}
            >
              <h2 style={styles.postTitle}>{post.title}</h2>
              <p style={styles.postDescription}>{post.description}</p>
              <p style={styles.postAuthor}>— {post.author}</p>
            </article>
          ))
        ) : (
          <p style={{ ...styles.message, gridColumn: '1 / -1' }}>
            No posts found. Create the first one!
          </p>
        )}
      </section>
    </div>
  );
};

export default FeedsScreen;