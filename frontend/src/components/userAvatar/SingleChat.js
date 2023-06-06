import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";

import {
  Box,
  Button,
  FormControl,
  Icon,
  IconButton,
  Input,
  Spinner,
  StepIndicator,
  Text,
  useToast,
} from "@chakra-ui/react";
// import { BiSend } from "react-icons/Bi";
import { BiSend } from "react-icons/bi";

import { ArrowBackIcon, ArrowRightIcon, CheckIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import ProfileModal from "../miscellaneous/ProfileModal";
import UpdateGroupChatModal from "../miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import "../styles.css";
import ScrollableChat from "../ScrollableChat";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [messages, setMessages] = useState([]);
  const [sendButtonLoading, setSendButtonLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const toast = useToast();

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
    fetchMessages();
  }, [selectedChat]);

  const sendMessage = async (event) => {
    if ((event.key === "Enter" || event.key === undefined) && newMessage) {
      setSendButtonLoading(true);
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
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // Typing indicator logic here
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
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
            // p={3}
            // backgroudUrl="https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png"
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
              </div>
            )}
            <FormControl
              onKeyDown={sendMessage}
              isRequired
              p={3}
              bg="#E8E8E8"
              display="flex"

              // mt={3}
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
