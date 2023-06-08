import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";

import {
  Box,
  Button,
  FormControl,
  Icon,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { BiSend } from "react-icons/bi";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";
import { io } from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
//! To be changed
const ENDPOINT = "http://localhost:8000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const [messages, setMessages] = useState([]);
  const [sendButtonLoading, setSendButtonLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIstyping] = useState(false);
  const toast = useToast();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRation: "xMidYMid slice",
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    // console.log(selectedChat._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      // console.log(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: error.message,
        description: "Failed to load the messages",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => {
      setIstyping(true);
    });
    socket.on("stop typing", () => {
      setIstyping(false);
    });
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  console.log(notification);
  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // ?give notification
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const sendMessage = async (event) => {
    if ((event.key === "Enter" || event.key === undefined) && newMessage) {
      setSendButtonLoading(true);
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.data.token}`,
          },
        };
        setNewMessage("");

        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        setSendButtonLoading(false);
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        console.log(error);
        toast({
          title: error.message,
          description: "Failed to send the message",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        setSendButtonLoading(false);
      }
    }
  };

  //   // Typing indicator logic here
  let typingTimeout = null;

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    clearTimeout(typingTimeout);

    if (e.target.value === "") {
      if (typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    } else {
      if (!typing) {
        setTyping(true);
        socket.emit("typing", selectedChat._id);
      }

      typingTimeout = setTimeout(() => {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }, 3000);
    }
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "18px", md: "20px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            ></IconButton>
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user.data, selectedChat.users)}
                <ProfileModal
                  user={getSenderFull(user.data, selectedChat.users)}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            bgImage="url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')"
            // bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            borderTopLeftRadius="0"
            borderTopRightRadius={0}
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
                {istyping ? (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "start",
                      justifyContent: "start",
                      width: "fit-content",
                      marginLeft: "30px",
                    }}
                  >
                    <Lottie
                      options={defaultOptions}
                      style={{
                        padding: "0",
                        margin: "5px",
                      }}
                      height="40px"
                    />
                  </span>
                ) : (
                  <></>
                )}
              </div>
            )}
            <FormControl
              onKeyDown={sendMessage}
              isRequired
              p={3}
              bg="#E8E8E8"
              display="flex"
            >
              <Input
                type="text"
                variant="filled"
                _hover={{
                  backgroundcolor: "white",
                }}
                _focus={{
                  backgroundColor: "white",
                }}
                backgroundColor="white"
                placeholder="Type a message"
                value={newMessage}
                onChange={typingHandler}
              />
              <Button onClick={sendMessage} isLoading={sendButtonLoading}>
                <Icon as={BiSend}></Icon>
              </Button>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
