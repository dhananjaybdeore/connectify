import { Box } from "@chakra-ui/layout";
import ChatBox from "../components/ChatBox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";
import { useEffect, useState } from "react";

const Chatpage = () => {
  const { user } = ChatState();
  const [renderComponent, setRenderComponent] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setRenderComponent(true);
    }, 1000);
  }, []);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};

export default Chatpage;
