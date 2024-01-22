import axios from "axios";
import { Container, Row, Col, Image, ProgressBar } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Cookies } from "react-cookie";
import Profile from '../images/basicProfile.jpeg'

const User = () => {
    const cookie = new Cookies();
    const token = cookie.get("token");
    const [userInfo, setUserInfo] = useState({});

    const expPercent = userInfo.exp / (userInfo.level * 20 + (userInfo.level - 1) * 5)

    const GetUser = async() => {
        try{
            const response = await axios.get("http://127.0.0.1:8000/api/users/",
                { headers : {
                    "Authorization" : token,
                    "Content-Type": "application/json"
                 }});
            
            setUserInfo(response.data.data);
        } catch (error) {
    }};

    useEffect( () => {
        GetUser();
        return 
    }, [])
    
    return (
        <Container style={{height : "75vh", padding: "3vh"}}>
            <Row style={{display:"flex", justifyContent:"center", fontSize : "3vw", height: "40vh"}}>
                {userInfo.profile ? 
                    "" 
                    :
                    <Image roundedCircle src={Profile} style={{height: "100%"}}/>
                }
            </Row>
            <Row style={{display:"flex", justifyContent:"center", alignItems: "center", fontSize : "5vw", height: "10vh"}}>
                {userInfo.id} 
            </Row>
            <Row style={{display:"flex", justifyContent:"center", fontSize : "4vw", height: "5vh"}}>
                {userInfo.email}
            </Row>

            <Row style={{display:"flex", justifyContent:"center", fontSize : "4vw", height : "5vh"}}>
                Level : {userInfo.level}
            </Row>

            <Row style={{display:"flex", justifyContent:"center", fontSize : "3vw", height : "5vh"}}>
                <ProgressBar  now ={expPercent} label={`Exp : ${userInfo.exp} ( ${expPercent}% )`}/>
            </Row>
            <Row style={{height : "5vh"}}>
                <Col style={{display:"flex", justifyContent:"center", fontSize : "4vw"}}>
                    시작한 작업 : {userInfo.mission_start}
                </Col>
                <Col style={{display:"flex", justifyContent:"center", fontSize : "4vw"}}>
                    완료한 작업 : {userInfo.mission_complete}
                </Col>
            </Row>
            <Row style={{height : "5vh"}}>
                <Col style={{display:"flex", justifyContent:"center", fontSize : "4vw"}}>
                    인증 글 수 : {userInfo.board}
                </Col>
                <Col style={{display:"flex", justifyContent:"center", fontSize : "4vw"}}>
                    인정 받은 횟수 : {userInfo.like}
                </Col>
            </Row>
        </Container>
    )
};

export default User;