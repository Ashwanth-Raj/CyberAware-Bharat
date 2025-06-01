const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'law_enforcement') {
      return res.status(403).json({ message: 'Unauthorized to access user list' });
    }

    const users = await User.find().select('email role createdAt');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error.message);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'law_enforcement') {
      return res.status(403).json({ message: 'Unauthorized to delete users' });
    }

    if (id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error.message);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};