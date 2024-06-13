import React, { useEffect } from "react";
import { auth, provider } from "./FirebaseConfig"; 
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import './App.css';

function Auth() {
    const navigate = useNavigate(); 

    const handleClick = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            localStorage.setItem("email", result.user.email);
            navigate("/home");
        } catch (error) {
            console.error("Error signing in with Google:", error);
        }
    };

    useEffect(() => {
        if (localStorage.getItem('email')) {
            navigate("/home");
        }
    }, [navigate]);

    return (
        <div className="signin">
            <button className="btn" onClick={handleClick}>SignIn With Google</button>
        </div>
    );
}

export default Auth;
