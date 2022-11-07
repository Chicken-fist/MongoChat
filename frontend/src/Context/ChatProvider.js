import React, { createContext, useContext, useEffect, useState } from "react";
// import {useState} from "react-usestateref"
import { useHistory } from "react-router-dom";

export const ChatContext = createContext({});
// contextAPI: qly state of our app -> fetch state directly from 1 place
// truy cập accessAPI mọi nơi
const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();

  const [user, setuser] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);
  const [socket, setsocket] = useState();
  const [input, setInput] = useState([]);
  const history = useHistory();


  useEffect(() => {
    if (user) {
      history.push("/chats");
    } else {
      history.push("/");
    }
  }, [history]);
  return (
    <ChatContext.Provider
      value={{
        user,
        setuser,
        selectedChat,
        setSelectedChat,
        notification,
        setNotification,
        chats,
        setChats,
        socket,
        setsocket,
        input,
        setInput,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
