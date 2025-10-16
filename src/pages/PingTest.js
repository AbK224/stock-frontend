import React,{useEffect, useState} from 'react'
import api from '../services/api';

export default function PingTest() {
    const [message, setMessage] = useState("Testing API...");
// Call the API when the component mounts
    useEffect(() => {
        api.get("/ping")
        // Handle the response from the backend
            .then((response) => {
                // 
                setMessage(response.data); // Assuming the backend returns a simple message
                // 
                setMessage("Connexion reussie au backend");
            })
            .catch((error) => {
                console.error("There was an error!", error);
                setMessage("http://127.0.0.1:8000/api/ping");
            });
        }, []);
  return (
    <div>
        <h1>Test API Laravel</h1>
        <p>{message}</p>
    </div>
  );

}


