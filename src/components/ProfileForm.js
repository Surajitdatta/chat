import React, { useState } from 'react';
import './ProfileForm.css';
import { getDatabase, ref, set } from 'firebase/database'; // Import Realtime Database functions
import { toast } from 'react-hot-toast'; // Import toast
import { useNavigate } from 'react-router-dom';


const ProfileForm = () => {
    const [name, setName] = useState("");
    const [facebook, setFacebook] = useState("");
    const [instagram, setInstagram] = useState("");

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();

        const uid = localStorage.getItem('login-uid');
        if (!uid) {
            toast.error("User not logged in");
            return;
        }

        try {
            // Get a reference to the Realtime Database
            const db = getDatabase();

            // Save profile data to the Realtime Database
            await set(ref(db, 'profile/' + uid), {
                name,
                facebook,
                instagram,
                uid:uid
            });

            toast.success("Profile successfully saved!");
            setName("")
            setFacebook("")
            setInstagram("")
            navigate("/chat")

        } catch (error) {
            toast.error(`Error saving profile: ${error.message}`);
        }
    }

    return (
        <div className="profile-container">
            <form className="profile-form" onSubmit={handleSubmit}>
                <h2>Create Your Profile</h2>

                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="input-group">
                    <input
                        type="url"
                        placeholder="Facebook Profile Link"
                        value={facebook}
                        onChange={(e) => setFacebook(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <input
                        type="url"
                        placeholder="Instagram Profile Link"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                    />
                </div>

                <button type="submit" className="submit-btn">Create Profile</button>
            </form>
        </div>
    );
}

export default ProfileForm;
