const adminAccess = (req, res) => {
  res.json({ message: `Only admin can access this` });
};
const managerAccess = (req, res) => {
  res.json({ message: `Manager and Admin can access this` });
};
const userAccess = (req, res) => {
  res.json({ message: `All can access this` });
};

module.exports = {
  adminAccess,
  managerAccess,
  userAccess,
};
