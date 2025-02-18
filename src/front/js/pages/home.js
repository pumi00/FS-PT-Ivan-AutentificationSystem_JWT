import React, { useContext } from "react";
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";

export const Home = () => {
	  const navigate = useNavigate();


	  const handleRegister = async (e) => {
		navigate("/register");
	  }

	  const handleLogin = async (e) => {
		navigate("/login");
	  }

	return (
		<div className="text-center mt-5">
			<h2>REGISTER</h2>
			<button onClick={ handleRegister }>Register</button>

			<h2>LOGIN</h2>
			
			<button onClick={ handleLogin }>Login</button>
		</div>
	);
};
