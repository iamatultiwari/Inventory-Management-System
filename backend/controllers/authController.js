export const loginUser = (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    return res.status(200).json({
      success: true,
      token: 'mock-jwt-token-xyz123',
      user: { username }
    });
  }
  return res.status(400).json({ message: 'Username and password are required' });
};