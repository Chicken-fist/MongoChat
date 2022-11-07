import {
  Image,
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useToast,
  Text,
} from "@chakra-ui/react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
  showMenu,
} from "../../config/ChatLogics";
import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useState, useRef } from "react";
import { DragHandleIcon, RepeatIcon } from "@chakra-ui/icons";
import axios from "axios";

var displayText = "block";

const BoxMessage = ({ messages, m, i, socket }) => {
  const [isShown, setIsShown] = useState("none");
  const [mess, setmess] = useState();
  const toast = useToast();
  const ref = useRef(null);
  // const {socket} = ChatState();

  const handlePic = (pic) => {
    if (pic) {
      displayText = "none";
      return pic;
    }
  };

  const handleContent = (content) => {
    if (content !== "image") {
      displayText = "block";
      // console.log("content", content);
      return content;
    }
  };

  const handleTimeSend = (timeSend) => {
    const date = new Date(timeSend);

    return date.toLocaleString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const { user } = ChatState();

  const handleSelected = () => {};

  //hien nut ban menu
  const handleShowMenu = () => {
    setIsShown("flex");
    setmess(m);

    return ref.current.offsetWidth;
  };

  const handleMessageClick = async (event) => {
    event.preventDefault();
    if (!mess) {
      return;
    } else {
      try {
        console.log("AXIOS");
        console.log("MESS ID:", mess);
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          "/api/message/recallMessage",
          {
            id: mess._id,
          },
          config
        );
        console.log("BOX MESSAGE: ", data);
        socket.emit("recall message", data);
        xuLyMess(messages, data);
      } catch (e) {
        toast({
          title: "Error Occured!",
          description: "Box Message - Recall Message error",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
  };

  const xuLyMess = (messages, data) => {
    messages.forEach((messa) => {
      if (messa._id === data._id) {
        messa.content = "BOX MESSAGE";
        mess.recallMessage = 1;
      }
    });
  };

  return (
    <>
      <Box style={{ display: "flex" }} key={m._id}>
        {(isSameSender(messages, m, i, user._id) ||
          isLastMessage(messages, i, user._id)) && (
          <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
            <ProfileModal user={m.sender}>
              <Avatar
                mt="7px"
                mr={1}
                size="sm"
                cursor="pointer"
                name={m.sender.name}
                src={m.sender.pic}
                onClick={() => handleSelected()}
              />
            </ProfileModal>
          </Tooltip>
        )}
        {!m.recallMessage && (
          <>
            {/* - bên gửi, bên nhận -> nhận margin khác nhau
            - 2 tin nhắn của cùng 1 user thì sẽ có cùng margin top */}
            <Box
              w="100%"
              h="25%"
              d="flex"
              onMouseEnter={handleShowMenu}
              onMouseLeave={() => {
                setIsShown("none");
                setmess(null);
              }}
              bg="gray"
            >
              {m.content === "image" ? (
                <>
                <Box
                    display="flex"
                    bg="red"
                    width="100%"
                    justifyContent={"space-between"}
                  >
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        fontSize="15px"
                        size="xs"
                        style={{
                          backgroundColor: "white",
                          position: "relative",
                          mr: "0px",
                          display: `${isShown}`,
                          // zIndex: "1",
                        }}
                        icon={<DragHandleIcon />}
                        onClick={() => setIsShown("flex")}
                      />
                      <MenuList
                        mt="-20px"
                        // position={"fixed"}
                        // zIndex={2}
                        style={{
                          // margin: showMenu(messages, m, i, user._id),
                          right: showMenu(m, i, user._id) ? 0 : -240,
                          zIndex: "2",
                          d: "flex",
                          position: "absolute",
                          // top: "200px",
                        }}
                      >
                        <MenuItem color="red" onClick={handleMessageClick}>
                          <RepeatIcon colorScheme="red" mr="10px" />
                          Recall Message
                        </MenuItem>
                        <MenuDivider />
                      </MenuList>
                    </Menu>
                  <Box
                    style={{
                      margin: isSameSenderMargin(messages, m, i, user._id),
                      marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                      minWidth: "0px",
                      maxWidth: "500px",
                      zIndex: "2",
                      position: "relative",
                    }}
                    ref={ref}
                  >
                    <Image borderRadius={5} src={handlePic(m.pic)} />
                  </Box>
                  
                  </Box>
                </>
              ) : (
                <Box
                  // onMouseOver={() => setIsShown("flex")}
                  style={{
                    backgroundColor: `${
                      m.sender._id === user._id ? "#B9F5D0" : "#ffffff"
                    }`,
                    margin: isSameSenderMargin(messages, m, i, user._id),
                    marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                    borderRadius: "8px",
                    padding: "5px 15px",
                    minWidth: "140px",
                    maxWidth: "80%",
                    height: "70",
                  }}
                  ref={ref}
                >
                  <Text>{handleContent(m.content)}</Text>

                  <Box
                    display="flex"
                    // bg="red"
                    mt={3}
                    justifyContent={"space-between"}
                  >
                    <Text
                      fontSize="15px"
                      color="gray"
                      paddingRight="0px"
                      display="flex"
                    >
                      {handleTimeSend(m.createdAt)}
                    </Text>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        fontSize="15px"
                        size="xs"
                        style={{
                          backgroundColor: "white",
                          position: "relative",
                          mr: "0px",
                          display: `${isShown}`,
                          // zIndex: "1",
                        }}
                        icon={<DragHandleIcon />}
                        onClick={() => setIsShown("flex")}
                      />
                      <MenuList
                        mt="-20px"
                        // position={"fixed"}
                        // zIndex={2}
                        style={{
                          // margin: showMenu(messages, m, i, user._id),
                          right: showMenu(m, i, user._id) ? 0 : -240,
                          zIndex: "2",
                          d: "flex",
                          position: "absolute",
                          // top: "200px",
                        }}
                      >
                        <MenuItem color="red" onClick={handleMessageClick}>
                          <RepeatIcon colorScheme="red" mr="10px" />
                          Recall Message
                        </MenuItem>
                        <MenuDivider />
                      </MenuList>
                    </Menu>
                  </Box>
                </Box>
              )}
            </Box>
          </>
        )}
        {/* <IconMenu></IconMenu> */}

        {m.recallMessage && (
          // onMouseOver={() => setIsShown("flex")}

          <Box
            style={{
              backgroundColor: `${
                m.sender._id === user._id ? "#B9F5D0" : "#ffffff"
              }`,
              margin: isSameSenderMargin(messages, m, i, user._id),
              marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
              borderRadius: "8px",
              padding: "5px 15px",
              maxWidth: "80%",
              height: "70",
              display: `${displayText}`,
            }}
          >
            <Text color="gray">Message Recall</Text>
            <Text
              fontSize="15px"
              color="gray"
              paddingRight="0px"
              display="flex"
            >
              {handleTimeSend(m.createdAt)}
            </Text>
          </Box>
        )}
      </Box>
    </>
  );
};

export default BoxMessage;
