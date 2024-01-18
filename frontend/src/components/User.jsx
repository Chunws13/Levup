import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Cookies } from "react-cookie";

const User = () => {
    const cookie = new Cookies();
    const token = cookie.get("token");
    const [userInfo, setUserInfo] = useState({});

    const GetUser = async() => {
        try{
            const response = await axios.get("http://127.0.0.1:8000/api/users/",
                { headers : {
                    "Authorization" : token,
                    "Content-Type": "application/json"
                 }});
            
            setUserInfo(response.data.data);
            console.log(userInfo)
        } catch (error) {

        }
    }

    useEffect( () => {
        GetUser();
        return 
    }, [])
    
    return (
        <Container>
            {userInfo.id}
            {userInfo.email}
            {userInfo.level}
            {userInfo.exp}
            {userInfo.mission_start}
            {userInfo.mission_complete}
            {userInfo.board}
            {userInfo.like}
            {userInfo.point}
        </Container>
    )
};

export default User;