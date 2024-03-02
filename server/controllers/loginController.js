const jwt = require('jsonwebtoken');
const secretKey = '12345';
const loginController = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [results] = await req.db.query(
      'SELECT * FROM Admin_Login WHERE username = ? AND password = ?',
      [username, password]
    );
    if (results.length > 0) {
      const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
      res.json({ token, username });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = loginController;
