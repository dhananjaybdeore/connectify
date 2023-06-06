export const getSender = (loggedUser, users) => {
  //   // ths function returns the name of the user in the chat which is other than logged in user
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
  //   // this function returns the  user in the chat which is other than logged in user

  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

//? Returns true if sender of the message is different from the logged in user
export const isSameSender = (messages, message, index, loggedInUserId) => {
  return (
    index < messages.length - 1 &&
    (messages[index + 1].sender._id !== message.sender._id ||
      messages[index + 1].sender._id === undefined) &&
    messages[index].sender._id !== loggedInUserId
  );
};

//? Returns true if -  a given index corresponds to the last message in an array of messages and if the sender of that last message is different from the currently logged-in user.
export const isLastMessage = (messages, index, loggedInUserId) => {
  return (
    index === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== loggedInUserId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameSenderMargin = (messages, message, i, loggedInUserId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === message.sender._id &&
    messages[i].sender._id !== loggedInUserId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== message.sender._id &&
      messages[i].sender._id !== loggedInUserId) ||
    (i === messages.length - 1 && messages[i].sender._id !== loggedInUserId)
  )
    return 0;
  else return "auto";
};

export const isSameUser = (messages, message, i) => {
  return i > 0 && messages[i - 1].sender._id === message.sender._id;
};
