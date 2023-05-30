import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Homepage from "./Pages/Homepage";
import Chatpage from "./Pages/Chatpage";
import ChatProvider from "./Context/ChatProvider";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <ChatProvider>
          <Routes>
            <Route path="/" element=<Homepage className="Chakra" /> />
            <Route path="/chats" element=<Chatpage /> />
          </Routes>
        </ChatProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
