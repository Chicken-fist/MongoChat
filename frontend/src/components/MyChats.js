import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender, getSenderPic } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import { useHistory } from "react-router-dom";
import { Avatar } from "@chakra-ui/avatar";
import io from "socket.io-client";


const ENDPOINT = "http://localhost:5000"; // socket den
var socket;
const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );

  const { user, setuser, selectedChat, setSelectedChat, chats,  setChats } =
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

  useEffect(() => {
    if(!socket){
      socket = io(ENDPOINT);
      socket.emit("setup", user); // client nhận được rồi mơi save dô client
     
    }
    // setsocket(socket)
  }, []);

  console.log("socket mychat", socket);

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
        d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
        p={3}
        bg="white"
        w={{ base: "100%", md: "31%" }}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Box
          pb={3}
          px={3}
          fontSize={{ base: "28px", md: "30px" }}
          fontFamily="Work sans"
          d="flex"
          w="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          My Chats
          <GroupChatModal>
            <Button
              d="flex"
              fontSize={{ base: "17px", md: "10px", lg: "17px" }}
              rightIcon={<AddIcon />}
            >
              New Group Chat
            </Button>
          </GroupChatModal>
        </Box>
        <Box
          d="flex"
          flexDir="column"
          p={3}
          bg="#F8F8F8"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="hidden"
        >
          {chats ? (
            <Stack overflowY="scroll">
              {chats.map((chat) => (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#ABEBC6" : "white"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  display="flex"
                  borderRadius="lg"
                  key={chat._id}
                >
                  <Avatar
                    mt={3}
                    mr={2}
                    size="sm"
                    cursor="pointer"
                    src={
                      chat.isGroupChat == true
                        ? chat.pic
                        : // "https://cdn-icons-png.flaticon.com/64/1911/1911087.png"
                          getSenderPic(loggedUser, chat.users)
                    }
                  />
                  <Box width="100%">
                    <Box justifyContent="space-between" d="flex">
                      <Text
                        fontSize="lg"
                        fontWeight="400"
                        color="black"
                        d="flex"
                        alignContent="end"
                      >
                        {!chat.isGroupChat
                          ? getSender(loggedUser, chat.users)
                          : chat.chatName}
                      </Text>
                      {chat.latestMessage && (
                        <Text color="gray.500">
                          {handleTimeSend(chat.latestMessage.createdAt)}
                        </Text>
                      )}
                    </Box>

                    {chat.latestMessage && (
                      <>
                        <Text fontSize="md" color="gray.500">
                          {chat.latestMessage.sender.name === loggedUser.name
                            ? "You"
                            : chat.latestMessage.sender.name}
                          :{" "}
                          {chat.latestMessage.content.length > 50
                            ? chat.latestMessage.content.substring(0, 51) +
                              "..."
                            : chat.latestMessage.content}
                        </Text>
                      </>
                    )}
                  </Box>
                </Box>
              ))}
            </Stack>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Box>
    </>
  );
};

export default MyChats;
