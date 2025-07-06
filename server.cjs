const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'ai_hack_day',
});

db.connect((err) => {
  if (err) {
    console.error('❌ Error connecting to MySQL:', err);
    return;
  }
  console.log('✅ Connected to MySQL database');
});

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aicropdoctor@gmail.com',          // 🔁 Replace with your Gmail
    pass: 'gpyfjbzsijduccpc',       // 🔁 Replace with your Gmail App Password
  },
});

// Test route
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// Sign Up Route
app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;

  const checkQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkQuery, [email], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (result.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(insertQuery, [username, email, password], (err, result) => {
      if (err) return res.status(500).json({ message: 'Sign up failed' });

      const user = { id: result.insertId, username, email };

      // Send welcome email
      const mailOptions = {
        from: 'aicropdoctor@gmail.com', // Same Gmail as in transporter
        to: email,
        subject: 'Welcome to AI Crop Disease Detector 🌿',
        text: `Hi ${username},\n\nThank you for signing up to our AI Crop Disease Detection app! 🌾\n\nStay tuned for more updates.\n\n– Team AI Crop Doctor`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('❌ Error sending email:', error);
        } else {
          console.log('📧 Email sent:', info.response);
        }
      });

      res.json({ message: 'User signed up successfully', user });
    });
  });
});

// Sign In Route
app.post('/signin', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (result.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const user = result[0];
    res.json({ message: 'Sign in successful', user: { id: user.id, username: user.username, email: user.email } });
    
  });
});
// Create a new post
app.post('/posts', (req, res) => {
  const { user_id, caption, image } = req.body;

  const query = 'INSERT INTO posts (user_id, caption, image) VALUES (?, ?, ?)';
  db.query(query, [user_id, caption, image], (err, result) => {
    if (err) {
      console.error('❌ Error creating post:', err);
      return res.status(500).json({ message: 'Failed to create post' });
    }
    res.json({ message: 'Post created successfully', postId: result.insertId });
  });
});

// Get all posts with user info and comments
app.get('/posts', (req, res) => {
  const postsQuery = `
    SELECT p.id AS post_id, p.caption, p.image, p.created_at, u.username 
    FROM posts p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC
  `;

  db.query(postsQuery, (err, posts) => {
    if (err) {
      console.error('❌ Error fetching posts:', err);
      return res.status(500).json({ message: 'Failed to fetch posts' });
    }

    const postIds = posts.map(post => post.post_id);
    if (postIds.length === 0) return res.json({ posts: [] });

    const commentsQuery = `
      SELECT c.post_id, c.comment, c.created_at, u.username
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id IN (?)
      ORDER BY c.created_at ASC
    `;

    db.query(commentsQuery, [postIds], (err, comments) => {
      if (err) {
        console.error('❌ Error fetching comments:', err);
        return res.status(500).json({ message: 'Failed to fetch comments' });
      }

      const postsWithComments = posts.map(post => {
        return {
          ...post,
          comments: comments.filter(c => c.post_id === post.post_id),
        };
      });

      res.json({ posts: postsWithComments });
    });
  });
});

// Add a comment
app.post('/comments', (req, res) => {
  const { post_id, user_id, comment } = req.body;

  const query = 'INSERT INTO comments (post_id, user_id, comment) VALUES (?, ?, ?)';
  db.query(query, [post_id, user_id, comment], (err, result) => {
    if (err) {
      console.error('❌ Error adding comment:', err);
      return res.status(500).json({ message: 'Failed to add comment' });
    }
    res.json({ message: 'Comment added successfully' });
  });
});
// Example endpoint: POST /signin
app.post('/signin', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = results[0];
    res.json({
      username: user.username,
      email: user.email,
      photoURL: `https://i.pravatar.cc/40?u=${user.email}` // optional gravatar-like
    });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
