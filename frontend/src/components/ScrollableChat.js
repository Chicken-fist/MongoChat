
import ScrollableFeed from "react-scrollable-feed";

import BoxMessage from "./miscellaneous/BoxMessage";


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


 