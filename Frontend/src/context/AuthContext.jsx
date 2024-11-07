import { createContext, useState, useEffect } from "react";
import * as jwt_decode from "jwt-decode"; 
import { useNavigate } from "react-router-dom"; 
import Swal from 'sweetalert2';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("authTokens")
            ? JSON.parse(localStorage.getItem("authTokens"))
            : null
    );

    const [user, setUser] = useState(() =>
        localStorage.getItem("authTokens")
            ? jwt_decode(localStorage.getItem("authTokens"))
            : null
    );

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const loginUser = async (email, password) => {
        const response = await fetch("http://127.0.0.1:8000/Signup/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });
        const data = await response.json();
        console.log(data);

        if (response.status === 200) {
            console.log("Logged In");
            setAuthTokens(data);
            setUser(jwt_decode(data.access));
            localStorage.setItem("authTokens", JSON.stringify(data));
            navigate("/"); 
            Swal.fire({
                title: "Login Successful",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        } else {
            console.log(response.status);
            console.log("there was a server issue");
            Swal.fire({
                title: "Username or password does not exist",
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        }
    };
    const [errors, setErrors] = useState({});
    const registerUser = async (firstname, lastname, nationalid, phonenumber, password, password2, schoolname, schooltype, edulevel, province, city, address) => {
        const userData = {
            first_name: firstname,
            last_name: lastname,
            National_ID: nationalid,
            Phone_Number: phonenumber,
            password,
            password2,
            School_Name: schoolname,
            School_Type: schooltype,
            Education_Level: edulevel,
            Province: province,
            City: city,
            Address: address,
        };
    
        console.log(userData);
        
        const response = await fetch("http://127.0.0.1:8000/Signup/register/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });
    
        const data = await response.json();
        console.log(data);
    
        if (response.status === 201) {
            navigate("/login");
            Swal.fire({
                title: "Registration Successful, Login Now",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        } else if (response.status === 400) {  
            let errorMessage = "";
            for (const [key, value] of Object.entries(data)) {
                errorMessage += `${key}: ${value.join(", ")}\n`;  
            }
            Swal.fire({
                title: "Registration Error",
                html: `<div style="word-wrap: break-word; white-space: pre-wrap; max-width: 100%;">${errorMessage}</div>`, 
                icon: "error",
                toast: false,
                position: 'center', 
                showConfirmButton: true,
                width: '90%', 
                timer : null ,
                customClass: {
                    popup: 'responsive-swal-popup',
                },
            });
        } else {
            Swal.fire({
                title: "An Error Occurred",
                text: "Server Error. Please try again later.",
                icon: "error",
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: true,
            });
        }
    };
    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
        navigate("/login");
        Swal.fire({
            title: "You have been logged out...",
            icon: "success",
            toast: true,
            timer: 6000,
            position: 'top-right',
            timerProgressBar: true,
            showConfirmButton: false,
        });
    };

    const contextData = {
        user,
        setUser,
        authTokens,
        setAuthTokens,
        registerUser,
        loginUser,
        logoutUser,
    };

    useEffect(() => {
        if (authTokens) {
            setUser(jwt_decode(authTokens.access));
        }
        setLoading(false);
    }, [authTokens, loading]);

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};
