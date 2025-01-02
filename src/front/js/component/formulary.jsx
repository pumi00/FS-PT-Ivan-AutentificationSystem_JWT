import React, { useContext, useState } from "react";
import { Context } from "../store/appContext.js"

export const Formulary = ({type}) => {
    const {store, actions} = useContext(Context);
    
    
    const [formData, setFormData] = useState({

        email: '',
        password: '',
    })


    const handleChange = e => setFormData({...formData, [e.target.name]: e.target.value})
    const handleSubmit =  e => {
        e.preventDefault()
        console.log('submit', formData)
        type=='login'? actions.login(formData) : actions.register(formData)
    }




    return (
        < form onSubmit={handleSubmit}>
            <input type="email" onChange={handleChange} placeholder="email" value={formData.email}/>
            <input type="password" onChange={handleChange} placeholder="password" value={formData.email}/>
            <input type="submit" />
            <button type="submit">Enviar</button>
        </form >
    );
}