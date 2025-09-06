const express = require('express');
const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true }));
app.post('/add', (req, res) => {
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
  app.listen(port, () => console.log('Server listening on', port));
}

module.exports = app;
