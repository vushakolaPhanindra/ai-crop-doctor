import { Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
function MenuBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ username: string; photoURL?: string } | null>(null);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Detects route changes

  // ✅ Load user info on route change
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log('Parsed user from localStorage:', parsedUser);

          let name = 'User';
          if (parsedUser) {
            if (parsedUser.username && parsedUser.username.trim()) {
              name = parsedUser.username.trim();
            } else if (parsedUser.name && parsedUser.name.trim()) {
              name = parsedUser.name.trim();
            } else if (parsedUser.displayName && parsedUser.displayName.trim()) {
              name = parsedUser.displayName.trim();
            } else if (parsedUser.email && typeof parsedUser.email === 'string') {
              name = parsedUser.email.split('@')[0];
            }
          }

          const photo = parsedUser.photoURL?.trim()
            ? parsedUser.photoURL
            : 'https://i.pravatar.cc/40?img=4';

          setUser({ username: name, photoURL: photo });
        } catch (e) {
          console.error('Failed to parse user from localStorage:', e);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    loadUser();
  }, [location]); // ✅ Triggers re-check on every route change

  const handleSignOut = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsOpen(false);
    navigate('/signin');
  };

  return (
    <div className="relative z-50">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="m-4 p-2 rounded-md bg-white shadow-md hover:bg-gray-100"
      >
        <Menu className="h-6 w-6 text-green-600" />
      </motion.button>
  
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-14 left-4 w-64 bg-white shadow-xl rounded-xl border border-gray-200"
          >
            <motion.ul
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.08,
                  },
                },
              }}
              className="flex flex-col gap-3 p-4"
            >
              {user && (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: -10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="flex items-center gap-3 border-b pb-3 mb-3"
                >
                  <img
                    src={user.photoURL}
                    alt="User"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="font-semibold text-gray-800">{user.username}</span>
                </motion.div>
              )}
  
              {[
                { to: "/Home", label: "Home" },
                { to: "/image-analysis", label: "Image Analysis" },
                { to: "/voice-assistant", label: "Voice Assistant" },
                { to: "/data-visualizer", label: "Data Visualizer" },
                { to: "/community", label: "Community" },
              ].map(({ to, label }) => (
                <motion.li
                  key={to}
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <Link
                    to={to}
                    onClick={() => setIsOpen(false)}
                    className="block px-2 py-1 rounded hover:bg-green-100 hover:text-green-700 transition"
                  >
                    {label}
                  </Link>
                </motion.li>
              ))}
  
              {user ? (
                <motion.li
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <button
                    onClick={handleSignOut}
                    className="text-left w-full text-red-600 hover:underline"
                  >
                    Sign Out
                  </button>
                </motion.li>
              ) : (
                <motion.li
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <Link
                    to="/signin"
                    onClick={() => setIsOpen(false)}
                    className="block px-2 py-1 rounded hover:bg-green-100 hover:text-green-700 transition"
                  >
                    Sign In
                  </Link>
                </motion.li>
              )}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MenuBar;
