const express = require('express');
const app = express();

// Basic security middleware
app.use(express.json({ limit: '10mb' }));
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-CSRF-Token', 'required');
  next();
});

// Simple CSRF protection
const csrfProtection = (req, res, next) => {
  const token = req.headers['x-csrf-token'];
  if (!token || token !== 'valid-token') {
    return res.status(403).json({ error: 'CSRF token required' });
  }
  next();
};

// Simple auth middleware for demonstration
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Valid Bearer token required' });
  }
  const tokenValue = token.substring(7);
  if (tokenValue.length < 10) {
    return res.status(401).json({ error: 'Invalid token format' });
  }
  next();
};

app.get('/health', requireAuth, (req, res) => res.json({ ok: true }));
app.post('/add', requireAuth, csrfProtection, (req, res) => {
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Invalid request body' });
  }
  
  const { a, b } = req.body;
  const numA = Number(a);
  const numB = Number(b);
  
  if (isNaN(numA) || isNaN(numB)) {
    return res.status(400).json({ error: 'Invalid numbers provided' });
  }
  
  res.json({ result: numA + numB });
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, (err) => {
    if (err) {
      console.error('Failed to start server:', err);
      process.exit(1);
    }
    console.log('Server listening on', port);
  });
}

module.exports = app;
