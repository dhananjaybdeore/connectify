import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";

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
      backgroundColor="purple"
      color="white"
      cursor="pointer"
    >
      {user.name}
      <CloseIcon
        p={0.5}
        ml={1}
        borderRadius="50%"
        onClick={handleFunction}
        _hover={{
          backgroundColor: "#9e32a8",
        }}
      />
    </Box>
  );
};

export default UserBadgeItem;
