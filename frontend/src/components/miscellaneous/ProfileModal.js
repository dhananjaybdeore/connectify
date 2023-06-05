import { ViewIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  IconButton,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}
      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          // height="410px"
          p="10px"
        >
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            {/* <Image
              src={user .pic}
              alt={user .name}
              name={user .name}
              borderRadius="full"
              boxSize="150px"
              objectFit="scale-down"
              // backgroundSize="cover"
              bgSize="cover"
              border="2px"
            /> */}
            <Link href={user.pic} isExternal>
              <Avatar
                size="xl"
                cursor="pointer"
                name={user.name}
                alt={user.name}
                src={user.pic}
                objectFit="scale-down"
                borderRadius="full"
                border="2px"
                boxSize="150px"
              ></Avatar>
            </Link>

            <Text
              fontFamily="Work sans"
              fontSize={{ base: "28px", md: "30px" }}
            >
              Email:<span style={{ color: "gray" }}> {user.email}</span>
            </Text>
          </ModalBody>

          <ModalFooter display="flex" justifyContent="center">
            <Button
              colorScheme="blue"
              // mr={3}
              onClick={onClose}
            >
              Close
            </Button>
            {/* <Button variant="ghost">Secondary Action</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
