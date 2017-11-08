// chk:emit("validate", "user")
// chk:end

function getUser() {
  const user = fetchUser();
  const errors = validateUser(user);
  if (errors !== undefined) {
    throw new Error("Invalid user");
  }
  return user;
}
