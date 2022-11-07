import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";

import ProfileModal from "../components/miscellaneous/ProfileModal";
import MessageModal from "./miscellaneous/MessageModal";

import { useState } from "react";
import BoxMessage from "./miscellaneous/BoxMessage";


var displayPic = "flex";
var displayText = "flex";
var displayBox = "none";


const ScrollableChat = ({ messages, socket }) => {
  // const [displayText, setDisplayText] = useState("flex");
  // const [displayPic, setDisplayPic] = useState("flex");
  
 
  return (

    
    <>
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <BoxMessage messages={messages} m={m} i={i} socket={socket}/>
        ))}
    </ScrollableFeed>
    
    </>
  );
};

export default ScrollableChat;


 