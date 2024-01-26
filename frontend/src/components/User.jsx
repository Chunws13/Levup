import axios from "axios";
import { Container, Row, Col, Image, ProgressBar, Dropdown, Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Cookies } from "react-cookie";
import Profile from '../images/basicProfile.jpeg'

const User = () => {
    const cookie = new Cookies();
    const token = cookie.get("token");
    const [userInfo, setUserInfo] = useState({});
    const [profile, setProfile] = useState(null);

    const expPercent = userInfo.exp / (userInfo.level * 20 + (userInfo.level - 1) * 5)

    const SelectProfile = async(event) => {
        const userProfile = event.target.files[0]; 
        setProfile(userProfile);
        const formData = new FormData();
        formData.append("profile", userProfile);

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/users/profile",
                formData,
                { headers : {
                    "Authorization" : token
                 }});
            
            await GetUser();

        } catch(error) {
            console.log(error.response.data.detail);
        }

    };
    
    const DeleteProfile = async() => {
        console.log("delete button click")
        try{
            await axios.delete("http://127.0.0.1:8000/api/users/profile",
                { headers : {
                    "Authorization" : token
                }});
            
            await GetUser();

        } catch(error){
            console(error.response.data.detail);
        };
    };

    const GetUser = async() => {
        try{
            const response = await axios.get("http://127.0.0.1:8000/api/users/",
                { headers : {
                    "Authorization" : token,
                    "Content-Type": "application/json"
                 }});
            
            setUserInfo(response.data.data);

        } catch (error) {
            console.log(error.response.data.detail);
    }};

    useEffect( () => {
        GetUser();
        return 
    }, [])
    
    return (
        <Container style={{height : "75vh", padding: "3vh"}}>
            <Row>
                <Dropdown style={{display: "flex", justifyContent: "flex-end"}}>
                    <Dropdown.Toggle variant="dark" id="dropdown-basic">
                        편집
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item as="label" >
                            <input type="file" onChange={SelectProfile} style={{display : "none"}}/> 프로필 선택
                        </Dropdown.Item>
                        <Dropdown.Item onClick={DeleteProfile}>프로필 삭제</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Row>
            <Row style={{display:"flex", justifyContent:"center", fontSize : "3vw", height: "40vh"}}>
                {userInfo.profile ? 
                    <Image roundedCircle src={`http://127.0.0.1:8000/${userInfo.profile}?timestamp=${Date.now()}`}/>
                    :
                    <Image roundedCircle src={Profile} style={{height: "100%"}}/>
                }
            </Row>
            <Row style={{display:"flex", justifyContent:"center", alignItems: "center", fontSize : "5vw", height: "8vh"}}>
                {userInfo.id} 
            </Row>
            <Row >
                <Col style={{display:"flex", justifyContent:"center", fontSize : "4vw", height: "5vh"}}>
                    Level : {userInfo.level}
                </Col>
                <Col style={{display:"flex", justifyContent:"center", fontSize : "4vw", height: "5vh"}}>
                    {userInfo.email}
                </Col>
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