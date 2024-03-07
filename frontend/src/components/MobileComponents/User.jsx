import { Container, Row, Col, Image, ProgressBar, Dropdown, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Cookies } from "react-cookie";
import { useNavigate  } from 'react-router-dom';
import { API } from "../../API";
import Profile from '../../images/basicProfile.jpeg'

const User = () => {
    const cookie = new Cookies();
    const token = cookie.get("token");
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({});
    const [expPercent, setExpPercent ] = useState(0);
    
    const GetUser = async() => {
        try{
            const headers = {
                "Authorization" : token,
                "Content-Type": "application/json"
            };

            const response = await API.getUser(headers);

            setUserInfo(response.data.data);
            setExpPercent(Math.round(
                userInfo.exp / (userInfo.level * 20 + (userInfo.level - 1) * 5) * 100, 1));

        } catch (error) {
            alert(error.response.data.detail);
            navigate("/login")
    }};

    const SelectProfile = async(event) => {
        const userProfile = event.target.files[0]; 
        const formData = new FormData();
        formData.append("profile", userProfile);

        const headers = {
            "Authorization" : token
        }
        try {
            await API.selectProfile(formData, headers);
            await GetUser();

        } catch(error) {
            alert(error.response.data.detail);
        }
    };
    
    const DeleteProfile = async() => {
        try{
            const headers = {
                "Authorization" : token
            }
            await API.deleteProfile(headers);
            await GetUser();

        } catch(error){
            alert(error.response.data.detail);
        };
    };

    const LogOut = () => {
        cookie.remove("token", {path: "/"});
        navigate("/login")
    }

    useEffect( () => {
        GetUser();
        
    }, [expPercent])

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
            <Row style={{display:"flex", justifyContent:"center", fontSize : "5vw", height: "40%"}}>
                { userInfo.profile ? 
                    <Image roundedCircle src={`https://levupbucket.s3.ap-northeast-2.amazonaws.com/users/${userInfo.profile}?timestamp=${Date.now()}`} style={{width: "auto", height: "100%"}}/>
                    :
                    <Image roundedCircle src={Profile} style={{height: "100%"}}/>
                }
            </Row>
            <Row style={{display:"flex", justifyContent:"center", alignItems: "center", fontSize : "5vw", height: "10%"}}>
                {userInfo.id} 
            </Row>
            <Row style={{fontSize : "5vw", height: "10%"}}>
                <Col style={{display:"flex", justifyContent:"center"}}>
                    Level : {userInfo.level}
                </Col>
                <Col style={{display:"flex", justifyContent:"center"}}>
                    {userInfo.email}
                </Col>
            </Row>

            <Row style={{display:"flex", justifyContent:"flex-start", fontSize : "5vw", height : "5vh"}}>
                <ProgressBar style={{height: "60%"}}
                    now ={expPercent} label={`Exp : ${userInfo.exp} ( ${expPercent}% )`}/>
            </Row>
            <Row style={{height : "10%", fontSize : "5vw"}}>
                <Col style={{display:"flex", justifyContent:"center"}}>
                    시작한 작업 : {userInfo.mission_start}
                </Col>
                <Col style={{display:"flex", justifyContent:"center"}}>
                    완료한 작업 : {userInfo.mission_complete}
                </Col>
            </Row>
            <Row style={{height : "10%", fontSize : "5vw"}}>
                <Col style={{display:"flex", justifyContent:"center"}}>
                    인증 글 수 : {userInfo.board}
                </Col>
                <Col style={{display:"flex", justifyContent:"center"}}>
                    인정 받은 횟수 : {userInfo.like}
                </Col>
            </Row>
            <Row>
                <Button onClick={LogOut} variant="danger" style={{fontSize: "5vw"}}> 로그아웃 </Button>
            </Row>
        </Container>
    )
};

export default User;