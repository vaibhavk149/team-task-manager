const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Serve React frontend in production
// We now look in the 'dist' folder inside the server directory (moved there by build-client)
let clientBuildPath = path.resolve(__dirname, 'dist');

// Fallback for safety
if (!require('fs').existsSync(clientBuildPath)) {
  clientBuildPath = path.resolve(__dirname, '..', 'client', 'dist');
}

console.log('Serving static files from:', clientBuildPath);
app.use(express.static(clientBuildPath));

// Any route that is not an API route → serve React's index.html
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientBuildPath, 'index.html'), (err) => {
    if (err) {
      console.error('Error sending index.html:', err);
      res.status(500).send(`Frontend build not found at ${clientBuildPath}. Make sure you ran the build script.`);
    }
  });
});

const connectDB = require('./config/db');
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

