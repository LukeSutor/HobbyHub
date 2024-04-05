import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "../AppContext";
import { useParams, Link } from "react-router-dom";

export default function Chat() {
  const [newMessage, setNewMessage] = useState("");
  const { user, matches, loading, chats, setChats, supabase } = useAppContext();
  const { id } = useParams();
  const match = matches.find((match) => match.user.id === id);
  const newMessageRef = useRef(null);

  useEffect(() => {
    document.title = "Chat | Hobby Hub";
    // Redirect user if not logged in
    if (!loading && !user) {
      window.location.href = "/login";
    }
  }, [loading]);

  useEffect(() => {
    newMessageRef.current?.scrollIntoView();
  }, [match, loading]);

  async function sendMessage(event) {
    event.preventDefault();

    if (!user) {
      return;
    }

    const { data, error } = await supabase
      .from("chats")
      .insert([
        {
          sender: user.id,
          receiver: id,
          message: newMessage,
        },
      ])
      .select();

    if (error) {
      console.log(error);
      return;
    }

    setChats([...chats, data[0]]);
    setNewMessage("");
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-semibold text-center my-12">Chat</h1>
      <div className="relative flex flex-row border border-gray-200 w-[100rem] max-w-[90vw] h-[50rem] shadow overflow-hidden rounded-xl">
        <div
          className="relative w-[24rem] bg-blue-400 border-r-[3px] border-blue-400 shadow-lg overflow-y-scroll overflow-x-hidden"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#fff rgb(96, 165, 250)",
          }}
        >
          <div className="w-full flex flex-col items-start px-8">
            <p className="text-white text-lg w-full font-semibold p-4">
              Direct Messages
            </p>
            {matches &&
              matches.map((match, index) => (
                <Link
                  to={`/chat/${match.user.id}`}
                  key={index}
                  className={`w-fit max-w-80 overflow-hidden p-4 rounded-lg border ${match.user.id === id ? "bg-blue-600 border-blue-700" : "hover:bg-blue-500 border-blue-400"}`}
                >
                  <p className="text-white text-xl font-semibold whitespace-nowrap text-ellipsis overflow-hidden">
                    {match.user.email}
                  </p>
                  <p className="text-blue-100 whitespace-nowrap text-ellipsis overflow-hidden">
                    {chats.findLast(
                      (chat) =>
                        chat.sender === match.user.id ||
                        chat.receiver === match.user.id,
                    )?.message || "Start chatting!"}
                  </p>
                </Link>
              ))}
          </div>
        </div>
        <div
          className="h-[50rem] overflow-y-scroll w-full"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#888 #fff",
          }}
        >
          {match?.user?.email === undefined ? (
            <div className="flex flex-col gap-y-6 justify-center items-center w-full h-full p-8">
              <h1 className="text-2xl font-semibold text-center bg-gray-50 border border-gray-200 rounded-lg shadow p-8">
                Select a match from the left to start chatting
              </h1>
            </div>
          ) : (
            <div className="flex flex-col gap-y-6 justify-end items-center w-full p-8 min-h-full h-fit flex-grow">
              {chats &&
                chats
                  .filter(
                    (message) =>
                      message.sender === id || message.receiver === id,
                  )
                  .map((message, index, arr) => {
                    const prevMessage = arr[index - 1];
                    const showDateSeparator =
                      !prevMessage ||
                      new Date(prevMessage.created_at).toDateString() !==
                        new Date(message.created_at).toDateString();
                    // Show time separator if the previous message was sent by a different user or if the time difference is greater than a minute
                    let showTimeSeparator = false;
                    if (!prevMessage) {
                      showTimeSeparator = true;
                    } else {
                      const deltaTime =
                        new Date(message.created_at) -
                        new Date(prevMessage.created_at);
                      showTimeSeparator =
                        prevMessage.sender !== message.sender ||
                        deltaTime > 60000;
                    }

                    return (
                      <div key={index} className="w-full">
                        {showDateSeparator && (
                          <p className="text-gray-500 text-sm text-center my-8">
                            {new Date(message.created_at).toDateString()}
                          </p>
                        )}

                        <div
                          className={`relative flex flex-row justify-between items-center w-fit max-w-[60%] px-6 py-4  border border-gray-200 rounded-xl shadow ${
                            message.sender === user.id
                              ? "bg-blue-500 text-white ml-auto"
                              : "bg-gray-50 mr-auto"
                          } ${showTimeSeparator ? "" : "-mt-5"}`}
                        >
                          <p>{message.message}</p>
                          {/* Show timestamp only if deltatime is greater than a minute */}
                          {showTimeSeparator && (
                            <p
                              className={`text-gray-500 text-sm absolute -top-5 whitespace-nowrap ${
                                message.sender === user.id
                                  ? "right-0"
                                  : "left-0"
                              }`}
                            >
                              {new Date(message.created_at)
                                .toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                                .toLowerCase()}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
              <form
                ref={newMessageRef}
                onSubmit={sendMessage}
                className="flex flex-row justify-between items-center w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl shadow"
              >
                <input
                  type="text"
                  value={newMessage}
                  placeholder={`Send a message to ${match?.user?.email}`}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-3/4 bg-gray-50 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-blue-200 border border-blue-400 font-semibold px-3 py-2 rounded-lg shadow"
                >
                  Send
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
