import "./App.css";
import Homepage from "./Pages/Homepage";
import { Route } from "react-router-dom";
import Chatpage from "./Pages/Chatpage";
import ChatProvider from "./Context/ChatProvider";
import Friendpage from "./Pages/ChatFriend";

function App() {
  return (
    <ChatProvider>
      <div className="App">
        {/* exact: 2 route sẽ đụng nhau, do cùng path nên thêm keyword -> khỏi đụn */}
        <Route path="/" component={Homepage} exact />
        <Route path="/provider" component={ChatProvider} />
        <Route path="/chats" component={Chatpage} />
        <Route path="/friend" component={Friendpage} />
      </div>
    </ChatProvider>
  );
}

export default App;
