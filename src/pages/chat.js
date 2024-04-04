import React, { useState, useEffect } from "react";
import { useAppContext } from "../AppContext";
import { getProfileInfo, getMessages } from "../functions";
import { useParams } from "react-router-dom";

export default function Chat() {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { user, setUser, hobbies, setHobbies, supabase } = useAppContext();
  const { id } = useParams();

  useEffect(() => {
    document.title = "Chat | Hobby Hub";

    setLoading(true);
    // Attempt to get user and redirect if failed
    getProfileInfo(supabase, user, setUser, hobbies, setHobbies).then((res) => {
      if (!res) {
        window.location.href = "/login";
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchMessages().then(() => setLoading(false));
  }, [user]);

  async function fetchMessages() {
    if (!user) {
      return;
    }

    const { data, error } = await supabase
      .from("chats")
      .select()
      .eq("sender", user.id)
      .eq("receiver_id", id)
      .or(`sender_id.eq.${id}.receiver_id.eq.${user.id}`);

    if (error) {
      console.log(error);
      return;
    }

    setMessages(data);
  }

  async function sendMessage(event) {
    event.preventDefault();

    if (!user) {
      return;
    }

    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          sender_id: user.id,
          receiver_id: id,
          message: newMessage,
        },
      ])
      .select();

    if (error) {
      console.log(error);
      return;
    }

    setMessages([...messages, data[0]]);
    setNewMessage("");
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold text-center my-12">Chat</h1>
      {loading && <p>Loading...</p>}
      <div className="flex flex-col gap-y-6 justify-center items-center">
        {messages &&
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex flex-row justify-between items-center w-1/3 px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl shadow ${
                message.sender_id === user.id ? "bg-blue-200" : ""
              }`}
            >
              <p>{message.message}</p>
            </div>
          ))}
        <form
          onSubmit={sendMessage}
          className="flex flex-row justify-between items-center w-1/3 px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl shadow"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-3/4"
          />
          <button
            type="submit"
            className="bg-blue-200 border border-blue-400 font-semibold px-3 py-2 rounded-lg shadow"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
