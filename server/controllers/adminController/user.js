const User = require("../../model/userSchema");

//fetch all users
const users = async (req, res) => {
  try {
    const users = await User.find({}, "username email role");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//delete user
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//edit user
const editUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { username, email },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { users, deleteUser, editUser };
