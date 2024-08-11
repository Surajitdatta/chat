import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase/Firebase';
import { getDatabase, ref, get } from 'firebase/database'; // Import Realtime Database functions
import { toast } from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // Login operation
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            if (email && password) {  // Ensure email and password are not empty
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                const uid = user.uid;

                // Store uid in localStorage
                localStorage.setItem('login-uid', uid);

                // Get a reference to the Realtime Database
                const db = getDatabase();
                const profileRef = ref(db, `profile/${uid}`);

                // Check if the profile exists
                const profileSnapshot = await get(profileRef);
                if (profileSnapshot.exists()) {
                    // Profile exists, redirect to the chat section
                    navigate("/chat");
                } else {
                    // Profile does not exist, redirect to profile form
                    navigate("/profileform");
                }
                
                toast.success('Login successful!');
            } else {
                toast.error("Email or Password cannot be empty");
            }
        } catch (err) {
            toast.error(`Login Error: ${err.message}`);
            console.log("Login Error:", err.message);
        }
    }

    // Navigate to the sign-up page
    const handleNavigate = () => {
        navigate("/");
    }

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Login</h2>
                <div className="input-group">
                    <input 
                        type="text" 
                        placeholder="Email" 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </div>
                <div className="input-group">
                    <input 
                        type="password" 
                        placeholder="Password" 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
                <button type="submit" className="submit-btn">Login</button>
                <div className="sign-up" onClick={handleNavigate}>
                    Not a member? <a href="" className="create-account">Create Account</a>
                </div>
            </form>
        </div>
    );
}

export default Login;
