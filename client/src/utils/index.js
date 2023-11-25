import axios from "axios";

export async function RegisterFn(formData) {
    console.log("NODE_ENV", import.meta.env.NODE_ENV);

    try{
        const serverUrl = import.meta.env.VITE_SERVER_URL ?? ""
        const registerUrl = serverUrl + "/api/v1/auth/register"
        console.log(formData, registerUrl)
        const serverResponse = await axios.post(registerUrl, formData)
        return serverResponse
    } catch(error){
        console.log("Error:", error)
    }
}

export async function LoginFn(formData) {
    try{
        const serverUrl = import.meta.env.VITE_SERVER_URL ?? ""
        const loginUrl = serverUrl + "/api/v1/auth/login"
        console.log(formData, loginUrl)
        const serverResponse = await axios.post(loginUrl, formData)
        return serverResponse
    } catch(error){
        console.log("Error:", error)
    }
}