import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Avatar, Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import cryptoJS from "crypto-js";

import ChatLoading from "./ChatLoading";
import { getSender, getSenderFull } from "../config/ChatLogics";
import GroupChatModal from "./miscellaneous/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();
  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };

      const { data } = await axios.get(
        "https://connectify-ht7d.onrender.com/api/chat",
        config
      );
      // console.log(data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    fetchChats();
    setLoggedUser(JSON.parse(localStorage.getItem("UserInfo")));
  }, [fetchAgain]);

  const decryptMessage = (encryptedMessage) => {
    const decryptedBytes = cryptoJS.AES.decrypt(
      encryptedMessage,
      `${process.env.REACT_APP_ENCRYPTION_KEY}`
    ).toString(cryptoJS.enc.Utf8);
    return JSON.parse(decryptedBytes).newMessage;
  };

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#E8E8E8" : "#E8E8E8"}
                color="black"
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text fontWeight="bold" fontSize={{ base: "17px", lg: "18px" }}>
                  {!chat.isGroupChat ? (
                    <Box display="flex" flexDir="row" columnGap={2}>
                      <Avatar
                        size="m"
                        background="purple"
                        name={getSenderFull(loggedUser.data, chat.users).name}
                        alt={getSenderFull(loggedUser.data, chat.users).name}
                        src={getSenderFull(loggedUser.data, chat.users).pic}
                        objectFit="scale-down"
                        borderRadius="full"
                        boxSize="55px"
                      ></Avatar>
                      <div>
                        {getSender(loggedUser.data, chat.users)}
                        <br></br>
                        <span
                          style={{
                            color: "gray",
                            fontSize: "15px",
                          }}
                        >
                          {chat.latestMessage ? (
                            <>
                              <span
                                style={{
                                  fontWeight: "bold",
                                }}
                              >
                                {chat.latestMessage.sender.name}:{" "}
                              </span>
                              {decryptMessage(chat.latestMessage.content)}
                            </>
                          ) : (
                            "No messages here yet"
                          )}
                        </span>
                      </div>
                    </Box>
                  ) : (
                    <Box display="flex" flexDir="row" columnGap={2}>
                      <Avatar
                        size="m"
                        background="gray"
                        name={chat.chatName}
                        alt={chat.chatName}
                        src="https://cdn-icons-png.flaticon.com/512/2352/2352167.png"
                        objectFit="scale-down"
                        borderRadius="full"
                        boxSize="55px"
                      ></Avatar>
                      <div>
                        {chat.chatName}
                        <br></br>
                        <span
                          style={{
                            color: "gray",
                            fontSize: "15px",
                          }}
                        >
                          {chat.latestMessage ? (
                            <>
                              <span
                                style={{
                                  fontWeight: "bold",
                                }}
                              >
                                {chat.latestMessage.sender.name}:{" "}
                              </span>
                              {decryptMessage(chat.latestMessage.content)}
                            </>
                          ) : (
                            "No messages here yet"
                          )}
                        </span>
                      </div>
                    </Box>
                  )}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
