import React, { useState } from 'react';
import './Signin.css';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase/Firebase';
import { toast } from 'react-hot-toast';
import { getDatabase, ref, set } from 'firebase/database'; // Import Realtime Database functions

const Signin = () => {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // Navigate to another page
    const handleNavigate = () => {
        navigate("/Login");
    }

    // Signin operation
    const registers = async (e) => {
        e.preventDefault();
        try {
            if (user && password) {  // Ensure user and password are not empty
                await createUserWithEmailAndPassword(auth, user, password);
                const users = auth.currentUser;
                console.log("kk", users)
                // Get a reference to the database
                const db = getDatabase();

                // Save the user's email and uid to the Realtime Database
                await set(ref(db, 'users/' + users.uid), {
                    email: users.email,
                    uid: users.uid
                });
                localStorage.setItem('sign-uid', users.uid);

                console.log(auth.currentUser);
                toast.success('Registration successful!');

                navigate("/Login"); // Navigate to the login page after successful registration
            } else {
                toast.error("Username or Password cannot be empty");
            }
        } catch (err) {
            toast.error(`Registration Error: ${err.message}`);
            console.log("Registration Error:", err.message);
        }
    }

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={registers}>
                <h2>Sign In</h2>
                <div className="input-group">
                    <input type="text" placeholder="Username" onChange={(e) => setUser(e.target.value)} />
                </div>
                <div className="input-group">
                    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                </div>

                <button type="submit" className="submit-btn">Register</button>
                <div className="sign-up" onClick={handleNavigate}>
                    Already Signup? <a href="#" className="create-account">Login</a>
                </div>
            </form>
        </div>
    );
}

export default Signin;
