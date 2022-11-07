
import {
  Image,
  // useToast,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  // Spinner,
} from "@chakra-ui/react";
// import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";

const BoxInfoFile = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  // const [groupChatName, setGroupChatName] = useState();
  // const [search, setSearch] = useState("");
  // const [searchResult, setSearchResult] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [renameloading, setRenameLoading] = useState(false);
  // const toast = useToast();

  const { selectedChat, setSelectedChat, user } = ChatState();
  


  return (
    
    <Box background="white" w="113%" ml="-25px" borderRadius={5}>

        <Accordion defaultIndex={[0]} allowMultiple>
        <AccordionItem>
        <h2>
      <AccordionButton>
        <Box flex='1' textAlign='left' fontWeight="bold">
          File
        </Box>
        <AccordionIcon />
      </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
      <Box   d="flex" flexWrap="wrap" pb={3} >
              {selectedChat.users.map((u) => (
                <Image src={u.avartar}></Image>
                
              ))}
        </Box>
        </AccordionPanel>
        </AccordionItem>
        </Accordion>

        
    </Box>
   
  );
};

export default BoxInfoFile;
