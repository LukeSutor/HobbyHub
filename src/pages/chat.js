import React, { useState, useEffect } from "react";
import { useAppContext } from "../AppContext";
import { useParams, Link } from "react-router-dom";

export default function Chat() {
  const [newMessage, setNewMessage] = useState("");
  const { user, matches, loading, chats, setChats, supabase } = useAppContext();
  const { id } = useParams();
  const match = matches.find((match) => match.user.id === id);

  useEffect(() => {
    document.title = "Chat | Hobby Hub";
    // Redirect user if not logged in
    if (!loading && !user) {
      window.location.href = "/login";
    }
  }, [loading]);

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
      <div className="flex flex-row border border-gray-200 min-w-fit h-[60vh] shadow rounded-xl overflow-hidden">
        <div className="flex flex-col items-center min-w-fit bg-blue-400 border-r-[3px] border-blue-500 shadow-lg px-8">
          <p className="text-white text-lg w-full font-semibold p-4">
            Direct Messages
          </p>
          {matches &&
            matches.map((match, index) => (
              <Link
                to={`/chat/${match.user.id}`}
                key={index}
                className={`w-full max-w-80 overflow-hidden p-4 rounded-lg border ${match.user.id === id ? "bg-blue-600 border-blue-700" : "hover:bg-blue-500 border-blue-400"}`}
              >
                <p className="text-white text-xl font-semibold whitespace-nowrap text-ellipsis overflow-hidden">{match.user.email}</p>
                <p className="text-blue-100 whitespace-nowrap text-ellipsis overflow-hidden">{chats.findLast((chat) => chat.sender === match.user.id || chat.receiver === match.user.id)?.message || "Start chatting!"}</p>

              </Link>
            ))}
        </div>
        {match?.user?.email === undefined ? (
          <div className="flex flex-col gap-y-6 justify-center items-center w-[64rem] p-8">
            <h1 className="text-2xl font-semibold text-center bg-gray-50 border border-gray-200 rounded-lg shadow p-8">
              Select a match from the left to start chatting
            </h1>
          </div>
        ) : (
          <div className="flex flex-col gap-y-6 justify-end items-center w-[64rem] p-8">
            {chats &&
              chats
                .filter(
                  (message) => message.sender === id || message.receiver === id,
                )
                .map((message, index) => (
                  <div
                    key={index}
                    className={`flex flex-row justify-between items-center w-fit max-w-[90%] px-6 py-4  border border-gray-200 rounded-xl shadow ${
                      message.sender === user.id
                        ? "bg-blue-500 text-white ml-auto"
                        : "bg-gray-50 mr-auto"
                    }`}
                  >
                    <p>{message.message}</p>
                  </div>
                ))}
            <form
              onSubmit={sendMessage}
              className="flex flex-row justify-between items-center w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl shadow"
            >
              <input
                type="text"
                value={newMessage}
                placeholder={`Send a message to ${match?.user?.email}`}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-3/4 bg-gray-50"
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
  );
}
