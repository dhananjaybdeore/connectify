import { CloseIcon } from "@chakra-ui/icons";
import { Avatar, Box } from "@chakra-ui/react";
import React from "react";
import ProfileModal from "../miscellaneous/ProfileModal";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      backgroundColor="#d2cdd4"
      color="black"
      // cursor="pointer"
      display="flex"
      alignItems="center"
    >
      <Avatar
        src={user.pic}
        boxSize="23px"
        size="m"
        background="purple"
        fontSize="10px"
        name={user.name}
        alt={user.name}
      ></Avatar>
      {user.name}
      <ProfileModal user={user} boxSize="0px" />
      <CloseIcon
        p={0.5}
        ml={1}
        borderRadius="50%"
        cursor="pointer"
        onClick={handleFunction}
        _hover={{
          backgroundColor: "white",
        }}
      />
    </Box>
  );
};

export default UserBadgeItem;
