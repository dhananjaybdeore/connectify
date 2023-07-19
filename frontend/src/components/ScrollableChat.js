import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import { Text } from "@chakra-ui/react";
import cryptoJS from "crypto-js";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const convertUTCtoIST = (utcTimestamp) => {
    const utcDate = new Date(utcTimestamp);
    var hours = utcDate.getHours();
    var minutes = utcDate.getMinutes();
    if (minutes < 10) minutes = "0" + minutes;
    if (hours < 10) hours = "0" + hours;
    return hours + ":" + minutes;
  };
  const decryptMessage = (encryptedMessage) => {
    const decryptedBytes = cryptoJS.AES.decrypt(
      encryptedMessage,
      `${process.env.REACT_APP_ENCRYPTION_KEY}`
    ).toString(cryptoJS.enc.Utf8);
    return JSON.parse(decryptedBytes).newMessage;
  };
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex", alignItems: "end" }} key={m._id}>
            {(isSameSender(messages, m, i, user.data._id) ||
              isLastMessage(messages, i, user.data._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user.data._id),
                marginTop: isSameUser(messages, m, i, user.data._id) ? 3 : 15,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {decryptMessage(m.content)}

              <Text
                width="100%"
                alignSelf="right"
                fontSize="10px"
                textAlign="right"
                mt={-1}
                // ml={1.5}
              >
                {convertUTCtoIST(m.createdAt)}
              </Text>
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
