import React, { useState, useEffect } from 'react';
import '../App.css';
import config from '../config.json';

async function fetchNames(tab) {
    const response = await fetch(`http://${config.computer_ip}:3002/names?tab=${encodeURIComponent(tab)}`);
    return await response.json();
}

const Grid = ({ tab }) => {
    const [names, setNames] = useState([]);
    const [alertMessage, setAlertMessage] = useState(null);

    useEffect(() => {
        async function fetchAndSetNames() {
            const names = await fetchNames(tab.trim());
            setNames(names);
        }
        fetchAndSetNames();
    }, [tab]);

    useEffect(() => {
        if (alertMessage) {
            const timeoutId = setTimeout(() => {
                setAlertMessage(null);
            }, 3000);
            return () => clearTimeout(timeoutId);
        }
    }, [alertMessage]);

    const handleSignOut = async (name) => {
        const response = await fetch(`http://${config.computer_ip}:3002/signOut`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: name
        });
        const data = await response.json();
        if (data.success) {
            setAlertMessage(`You've been signed out`);
        }
    };

    const handleSignIn = async (name) => {
        const response = await fetch(`http://${config.computer_ip}:3002/signIn`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: name
        });
        const data = await response.json();
        if (data.success) {
            setAlertMessage(`You've been signed In`);
        }
    };

    return (
        <>
            {alertMessage && (
                <div className="overlay">
                    <div className="alert-message">{alertMessage}</div>
                </div>
            )}
            <h2 style={{color: "#767d8a"}}>Side note: If you press "Sign in" without being signed out, you won't be logged as signed out/signed in.</h2>
            <div className="image-grid">
                {names.sort().map(name => (
                    <div key={name} className="image-container">
                        <div className="image-name" style={{color:"#767d8a"}}>{name}</div>
                        <img src={`https://source.unsplash.com/320x180/?${name}`} alt={name} />
                        <button className="button" onClick={() => handleSignOut(name)}>Sign Out</button>
                        <button className="button" onClick={() => handleSignIn(name)}>Sign In</button>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Grid;