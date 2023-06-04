export const getSender = (loggedUser, users) => {
  // this function returns the name of the user in the chat which is other than logged in user

  return users[0]._id === loggedUser._id ? users[0].name : users[1].name;
};
