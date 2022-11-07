import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender, getSenderPic } from "../../config/ChatLogics";
import ChatLoading from "../ChatLoading";
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    IconButton,
    AccordionIcon,
  } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import { useHistory } from "react-router-dom";
import { Avatar } from "@chakra-ui/avatar";
import ScrollableFeed from "react-scrollable-feed";
import { Divider } from "@chakra-ui/react";

const MyFriends = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );

  const { user, setuser, selectedChat, setSelectedChat, chats, setChats } =
    ChatState();

  const toast = useToast();

  const history = useHistory();

  const handleTimeSend = (timeSend) => {
    const date = new Date(timeSend);

    return date.toLocaleString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    setuser(loggedUser);
    if (loggedUser === null) {
      history.go(0);
    }
    fetchChats();
  }, [fetchAgain]);

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${loggedUser.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      // console.log("XXX", user.token);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  return (
    <>
      <Box
        d="flex"
        flexDir="column"
        alignItems="left"
        pt={3}
        bg="white"
        w={{ base: "100%", md: "25%" }}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Box
          fontSize={{ base: "28px", md: "50px" }}
          w="100%"
          bg="white"
          alignItems="center"
        >
          <ScrollableFeed bg="white">
            <Box
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
              d="block"
              w="100%"
              justifyContent="space-between"
              alignItems="initial"
            >
              <Button
                d="flex"
                w="100%"
                leftIcon={<AddIcon />}
                bg="white"
                fontSize="15px"
                justifyContent="initial"
              >
                Add New Friend By Email
              </Button>
              <Button
                d="flex"
                w="100%"
                leftIcon={<AddIcon />}
                bg="white"
                justifyContent="initial"
                fontSize="17px"
              >
                List Friends
              </Button>
              <Button
                d="flex"
                w="100%"
                leftIcon={<AddIcon />}
                bg="white"
                justifyContent="initial"
                fontSize="17px"
              >
                List Groups
              </Button>
            </Box>
            <Divider orientation="horizontal" bg="gray.200" h="2px" />
            <Box
              d="flex"
              flexDir="column"
              p={3}
              bg="white"
              w="100%"
              h="100%"
              borderRadius="lg"
              overflowY="hidden"
            >
              <Accordion defaultIndex={[0]} allowMultiple>
              
                  <AccordionItem>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        Friends 
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                      {/* {searchResult?.map((user, i) => (
                        <UserListItem
                          key={user._id}
                          user={user}
                          handleFunction={() => accessChat(user._id)}
                        />
                      ))} */}
                    </AccordionPanel>
                  </AccordionItem>
                

              </Accordion>
            </Box>
          </ScrollableFeed>
        </Box>
      </Box>
    </>
  );
};

export default MyFriends;
