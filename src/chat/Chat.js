import React, { useEffect, useState } from 'react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { getDatabase, ref, onValue, push, serverTimestamp, query, orderByChild, equalTo } from 'firebase/database';
import './Chat.css';
import { auth } from '../Firebase/Firebase';

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const db = getDatabase();
    
    // Fetching users data from Firebase Realtime Database
    const usersRef = ref(db, 'profile/');
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersList = Object.values(data);
        setUsers(usersList);
      }
    });

    // Fetch the current user's profile data
    const uid = localStorage.getItem('login-uid');
    if (uid) {
      const currentUserRef = ref(db, `profile/${uid}`);
      onValue(currentUserRef, (snapshot) => {
        const userData = snapshot.val();
        setCurrentUser(userData);
        console.log("Current User Data:", userData);  // Debugging statement
      });
    }
  }, []);

  useEffect(() => {
    if (selectedUser) {
      const db = getDatabase();
      const uid = localStorage.getItem('login-uid');
      const chatId = generateChatId(uid, selectedUser.uid);

      // Listen for messages between the current user and the selected user
      const chatRef = query(
        ref(db, 'messages/'),
        orderByChild('chatId'),
        equalTo(chatId)
      );
      onValue(chatRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const msgs = Object.values(data).sort((a, b) => a.createdAt - b.createdAt); // Ensure messages are in the correct order
          setMessages(msgs);
          console.log("Messages Data:", msgs);  // Debugging statement
        } else {
          setMessages([]);
        }
      });
    }
  }, [selectedUser]);

  // Function to generate a unique chat ID for the two users
  const generateChatId = (uid1, uid2) => {
    return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
  };

  // Function to send a new message
  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !selectedUser) return;

    const db = getDatabase();
    const uid = localStorage.getItem('login-uid');
    const user = currentUser;

    try {
      const chatId = generateChatId(uid, selectedUser.uid);
      await push(ref(db, 'messages/'), {
        text: newMessage,
        createdAt: serverTimestamp(),
        uid: uid,
        name: user?.name || "Anonymous",  // Use the real name here
        chatId: chatId,
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  // Filter out the current user from the list of users
  const filteredUsers = users.filter(user => user.uid !== currentUser?.uid);

  return (
    <div className="chat-container">
      <div className="sidebar users-sidebar">
        <h3>Users</h3>
        <ul>
          {filteredUsers.map((user, index) => (
            <li
              key={index}
              className={selectedUser?.uid === user.uid ? "selected" : ""}
              onClick={() => setSelectedUser(user)}
            >
              {user.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-area">
        {selectedUser ? (
          <>
            <div className="messages">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${message.uid === currentUser?.uid ? 'sent' : 'received'}`}
                >
                  <p>
                    <strong>
                      {message.uid === currentUser?.uid ? 'You' : message.name}:  {/* Display the correct name */}
                    </strong> 
                    {message.text}
                  </p>
                </div>
              ))}
            </div>
            <div className="message-input">
              <input 
                type="text" 
                placeholder="Type a message..." 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)} 
              />
              <button type="button" onClick={handleSendMessage}>Send</button>
            </div>
          </>
        ) : (
          <p>Select a user to start chatting</p>
        )}
      </div>
      <div className="sidebar profile-sidebar">
        <h3>Profile</h3>
        {currentUser ? (
          <div className="profile-info">
            <p className="profile-name">{currentUser.name}</p>
            <div className="profile-links">
              {currentUser.facebook && (
                <a href={currentUser.facebook} target="_blank" rel="noopener noreferrer">
                  <FaFacebook className="social-icon" />
                </a>
              )}
              {currentUser.instagram && (
                <a href={currentUser.instagram} target="_blank" rel="noopener noreferrer">
                  <FaInstagram className="social-icon" />
                </a>
              )}
            </div>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default Chat;
