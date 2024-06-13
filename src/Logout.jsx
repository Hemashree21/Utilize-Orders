import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from './FirebaseConfig';

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        localStorage.clear();
        navigate('/');
    };

    return (
        <button className="btn" onClick={handleLogout}>Logout</button>
    );
};

export default Logout;
