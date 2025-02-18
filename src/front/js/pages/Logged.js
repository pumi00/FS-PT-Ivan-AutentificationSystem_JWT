import React from "react";
import "../../styles/logged.css";


export const Logged = () => {
    return (
        <div className="celebration-container">
            <h1>¡Estás Fogueado! 🔥</h1>
            <p>¡Felicidades! Estás en tu mejor momento. ¡Sigue así!</p>
            <div className="fireworks">
                <div className="firework"></div>
                <div className="firework"></div>
                <div className="firework"></div>
            </div>
        </div>
    )
}