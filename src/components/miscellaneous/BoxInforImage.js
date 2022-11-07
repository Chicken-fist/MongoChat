import { InfoOutlineIcon } from "@chakra-ui/icons";
import {
  Button,
  Image,
  FormControl,
  Input,
  useToast,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { ChatState } from "../../Context/ChatProvider";

const BoxInfoIamge = ({  }) => {
  const [loading, setLoading] = useState(false);
  const [pics, setPics] = useState([]);
  const toast = useToast();

  const { selectedChat, setSelectedChat, user } = ChatState();

  useEffect(() => {
    fetchImage();
  }, []);

  const fetchImage = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/image/${selectedChat._id}`,
        config
      );
      // setMessages(data);
      setPics(data);
      setLoading(false);

      
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <Box background="white" w="113%" ml="-25px" borderRadius={5}>
      <Accordion defaultIndex={[0]} allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="bold">
                Image/Video
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Box d="flex" flexWrap="wrap" pb={3}>
              {pics.map((u) => (
                <Image src={u.pic} width="25%"/>
                // <UserListItemGroup
                //   key={u._id}
                //   user={u}
                //   handleFunction={() => handleRemove(u)}
                //   admin={selectedChat.groupAdmin}
                // />
              ))}
            </Box>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default BoxInfoIamge;
