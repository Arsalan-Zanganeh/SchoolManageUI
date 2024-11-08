import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Welcome = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="welcome-container">
            <h1>Welcome, {user.firstname}!</h1>
        </div>
    );
}

export default Welcome;
