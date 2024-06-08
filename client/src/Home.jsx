const WS_URL = "ws://localhost:8000";
import { useEffect, useRef } from "react";
import useWebSocket from "react-use-websocket";
import throttle from "lodash.throttle";
import { Cursor } from "./components/Cursor";

const THROTTLE = 100;

const renderCursors = (users, currentUserName) => {
  return Object.keys(users).map((uuid) => {
    const user = users[uuid];
    return (
      <Cursor
        key={uuid}
        point={[user.state.x, user.state.y]}
        username={user.username}
        currentUserName={currentUserName}
      />
    );
  });
};

const renderUsers = (users, currentUserName) => {
  return (
    <div style={{ display: "flex", justifyContent: "end", width: "100%" }}>
      <div
        id="users"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "end",
          alignItems: "start",
          border: "1px solid black",
          padding: 10,
        }}
      >
        <h4>Current Users</h4>
        {Object.keys(users).map((uuid) => {
          const user = users[uuid];
          return (
            <span key={uuid} style={{ color: user.username === currentUserName ? "blue" : "black" }}>
              {user.username === currentUserName ? `You(${currentUserName})` : `${user.username}`}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// eslint-disable-next-line react/prop-types
export function Home({ username }) {
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, { queryParams: { username } });

  const sendJsonMessageThrottled = useRef(throttle(sendJsonMessage, THROTTLE));

  useEffect(() => {
    sendJsonMessage({ x: 0, y: 0 });
    window.addEventListener("mousemove", (event) => {
      sendJsonMessageThrottled.current({ x: event.clientX, y: event.clientY });
    });
  }, []);

  if (lastJsonMessage) {
    // console.log("lastJsonMessage:", lastJsonMessage);
    return (
      <>
        {renderCursors(lastJsonMessage, username)}
        {renderUsers(lastJsonMessage, username)}
      </>
    );
  }
  return <h1>Hello, {username}</h1>;
}
