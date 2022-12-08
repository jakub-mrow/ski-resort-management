import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [authenticated, setauthenticated] = useState(localStorage.getItem(localStorage.getItem("authenticated") || false));
    const users = [{ username: "test", password: "testpassword" }];

    const handleSubmit = (e) => {
        e.preventDefault()
        const account = users.find((user) => user.username === username);
        if (account && account.password === password) {
            setauthenticated(true)
            localStorage.setItem("authenticated", true);
            navigate("/");
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 antialiased px-4 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl mx-auto text-center">
                <span className="text-2xl font-light">Login to your account</span>
                <div className="relative mt-4 bg-white shadow-md sm:rounded-lg text-left">
                    <div className="h-2 bg-indigo-400 rounded-t-md"></div>
                    <div className="py-6 px-8">
                        <label className="block font-semibold">Username</label>
                        <input onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Email" className=" border w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:ring-1 focus:ring-indigo-600 rounded-md"/>
                        <label className="block mt-3 font-semibold">Password</label>
                        <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className=" border w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:ring-1 focus:ring-indigo-600 rounded-md"/>
                        <div className="flex justify-between items-baseline">
                            <button onClick={handleSubmit} className="mt-4 bg-indigo-500 text-white py-2 px-6 rounded-lg">Login</button>
                            <a href="#" className="text-sm hover:underline">Forgot password?</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login