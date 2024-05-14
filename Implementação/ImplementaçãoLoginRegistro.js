let registeredUsers = [];

function registerUser(newUser) {
  const existingUser = registeredUsers.find(user => user.username === newUser.username);
  if (existingUser) {
    return false; 
  }

  registeredUsers.push(newUser);
  return true; 
}

function loginUser(username, password) {
  const user = registeredUsers.find(user => user.username === username && user.password === password);
  return !!user; 
}

module.exports = { registerUser, loginUser };
