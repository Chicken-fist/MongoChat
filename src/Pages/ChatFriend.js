import { Box } from "@chakra-ui/layout";
import { useEffect, useState, useContext } from "react";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState, ChatContext } from "../Context/ChatProvider";
import { useHistory } from "react-router-dom";
const Friendpage = () => {
  // dùng trong ChatBox
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const [fetchAgain, setFetchAgain] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (user == null) {
      history.go(0);
    }
  }, [history]);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        d="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      ></Box>
    </div>
  );
};

export default Friendpage;
