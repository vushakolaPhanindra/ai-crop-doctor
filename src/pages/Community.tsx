import { motion } from "framer-motion";
import { useEffect, useState } from 'react';
import axios from 'axios';
import bgImage from '../assets/bg-welcome.jpg';
// Types
interface Comment {
  username: string;
  comment: string;
}

interface Post {
  post_id: number;
  username: string;
  caption: string;
  image?: string;
  created_at: string;
  comments: Comment[];
  likes?: number; // optional like count
}

function Community() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState('');
  const [commentText, setCommentText] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const userId = 1; // Replace with actual user ID

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:5000/posts');
      setPosts(res.data.posts || []);
    } catch (err) {
      setError('Failed to load posts.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!caption.trim()) return alert('Caption cannot be empty!');
    try {
      await axios.post('http://localhost:5000/posts', {
        user_id: userId,
        caption: caption.slice(0, 200),
        image,
      });
      setCaption('');
      setImage('');
      fetchPosts();
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  const handleAddComment = async (postId: number) => {
    const comment = commentText[postId]?.trim();
    if (!comment) return;

    try {
      await axios.post('http://localhost:5000/comments', {
        post_id: postId,
        user_id: userId,
        comment: comment.slice(0, 150),
      });
      setCommentText({ ...commentText, [postId]: '' });
      fetchPosts();
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-start justify-center py-12 px-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-md bg-white/80 max-w-2xl w-full rounded-2xl shadow-xl p-6"
      >
        <motion.h2
          className="text-3xl font-bold mb-6 text-green-700 text-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          🌿 Community Hub
        </motion.h2>
  
        {/* Create Post */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6 p-4 border border-green-300 rounded-xl shadow-sm bg-white"
        >
          <h3 className="font-semibold mb-2 text-lg text-green-800">Create a Post</h3>
          <input
            type="text"
            placeholder="Caption (max 200 chars)"
            maxLength={200}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="text"
            placeholder="Image URL (optional)"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          {image && (
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              src={image}
              alt="Preview"
              className="w-full h-48 object-cover rounded mb-2 border"
            />
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreatePost}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
          >
            🚀 Post
          </motion.button>
        </motion.div>
  
        {/* Posts Section */}
        {loading ? (
          <p className="text-center text-gray-600">Loading posts...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts yet. Be the first to share something!</p>
        ) : (
          posts.map((post, i) => (
            <motion.div
              key={post.post_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="mb-6 p-4 border border-gray-300 rounded-xl shadow-sm bg-white"
            >
              <div className="mb-2 flex justify-between items-center">
                <span className="font-semibold text-blue-600">{post.username}</span>
                <span className="text-xs text-gray-500">
                  {new Date(post.created_at).toLocaleString()}
                </span>
              </div>
              <p className="mb-2">{post.caption}</p>
              {post.image && (
                <motion.img
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={post.image}
                  alt="Post"
                  className="w-full max-h-60 object-cover rounded mb-2"
                />
              )}
  
              {/* Like Feature */}
              <div className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => ""}
                  className="text-red-500 hover:text-red-600 transition"
                >
                  ❤️
                </motion.button>
                <span>{post.likes ?? 0} Likes</span>
              </div>
  
              {/* Comments */}
              <div className="ml-2">
                {post.comments.map((c, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="text-sm mb-1"
                  >
                    <span className="font-semibold">{c.username}:</span> {c.comment}
                  </motion.div>
                ))}
  
                {/* Add Comment */}
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={commentText[post.post_id] || ''}
                    maxLength={150}
                    onChange={(e) =>
                      setCommentText({ ...commentText, [post.post_id]: e.target.value })
                    }
                    placeholder="Write a comment..."
                    className="flex-1 p-2 border rounded text-sm"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddComment(post.post_id)}
                    className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Comment
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );

}

export default Community;
