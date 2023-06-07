import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//? Creating a Context
const ChatContext = createContext();

//! ChatProvider is going to wrap our whole app
//? Children is the function argument . When we call this ChatProvider function with parameter of any component, that component will be wrapped by <ChatContext.Provider>
const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("UserInfo"));
    setUser(userInfo);

    if (!userInfo) navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return (
    //* Passing all the states through props of ChatContext.Provider
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

//? All of the states are now inside ChatState variable
export const ChatState = () => {
  //? Usecontext hook is used to make a state accessible in other parts of app
  return useContext(ChatContext);
};

export default ChatProvider;
