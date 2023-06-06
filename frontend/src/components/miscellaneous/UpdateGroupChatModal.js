import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  IconButton,
  useToast,
  Box,
  Input,
  FormControl,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { SettingsIcon, ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import axios from "axios";
import UserListItem from "../userAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const toast = useToast();
  useEffect(() => {
    setGroupChatName(selectedChat.chatName);
  }, [selectedChat]);
  const handleRemove = async (userToBeRemoved) => {
    if (selectedChat.groupAdmin._id !== user.data._id) {
      toast({
        title: "Only admin can remove someone",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: userToBeRemoved._id,
        },
        config
      );
      toast({
        title: "User removed successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages(); //! don't know the significance, should be removed and test the app
      setLoading(false);
    } catch (error) {
      toast({
        title: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }
  };
  const handleExit = async (userToBeExited) => {
    if (selectedChat.groupAdmin._id === user.data._id) {
      toast({
        title: "You are admin, you can't leave the group",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: user.data._id,
        },
        config
      );
      toast({
        title: "User removed successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setSelectedChat();
      fetchMessages();
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }
  };
  const handleAddUser = async (userToBeAdded) => {
    if (selectedChat.groupAdmin._id !== user.data._id) {
      toast({
        title: "Only admins can add someone",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (selectedChat.users.find((u) => u._id === userToBeAdded._id)) {
      toast({
        title: "Users Already Added in the group",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: userToBeAdded._id,
        },
        config
      );
      toast({
        title: "User added successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }
  };
  const handleRename = async () => {
    if (!groupChatName) {
      return;
    }
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      toast({
        title: "Updated",
        description: "Group Chat name updated successfully!!!",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      //   setGroupChatName("");
    } catch (error) {}
  };
  //   const handleSearch = () => {};
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };

      const { data } = await axios.get(`/api/user/?search=${search}`, config);
      // console.log(data.length);
      setLoading(false);
      if (data.length == 0) {
        toast({
          title: "Users not found",
          description: "Try entering different keyword",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      }
      setSearchResult(data);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error Occured!",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };
  //   const handleRemove = () => {};
  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<SettingsIcon />}
        onClick={onOpen}
      />

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        fontFamily="Work sans"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {/* {selectedChat.users.map((u) => (
                <UserBadgeItem key={u._id} user={u}></UserBadgeItem>
              ))} */}
              <Box width="100%" mb="10px">
                Admin:
                <Text
                  backgroundColor="green"
                  px={2}
                  py={1.5}
                  borderRadius="lg"
                  m={1}
                  mb={2}
                  variant="solid"
                  fontSize={12}
                  color="white"
                  cursor="pointer"
                  display="inline"
                  width="fit-content"
                  p="auto"
                >
                  {selectedChat.groupAdmin.name}
                </Text>
              </Box>
              <Box
                width="100%"
                display="flex"
                flexWrap="wrap"
                alignItems="center"
              >
                Members:
                {selectedChat.users.map((user) => (
                  <Box width="fit-content" key={user._id}>
                    {user._id !== selectedChat.groupAdmin._id && (
                      <UserBadgeItem
                        // key={user._id}
                        user={user}
                        handleFunction={() => handleRemove(user)}
                      />
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
            <FormControl display="flex">
              <Input
                // placeholder={selectedChat.chatName}
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />

              <Button
                variant="solid"
                backgroundColor="teal"
                color="white"
                ml={1}
                _hover={{
                  backgroundColor: "teal",
                  color: "white",
                }}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add users to group"
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Box display="flex" justifyContent="center">
                <Spinner size="lg" align="center"></Spinner>
              </Box>
            ) : (
              <>
                {searchResult?.slice(0, 4).map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  ></UserListItem>
                ))}
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => {
                handleExit(user);
              }}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
