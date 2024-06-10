
import { API } from "../../API";
import { Container, Dropdown, Image, Row, Col, Button, ProgressBar } from "react-bootstrap";
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MemoHistory from "./MemoHistory";
import Profile from '../../images/basicProfile.jpeg'
import "../css/User.css"
import { all } from "axios";

const User = () => {
    const navigate = useNavigate();
    const cookie = new Cookies();
    const token = cookie.get("token", {path: "/"});

    const [userInfo, setUserInfo] = useState({});
    const [expPercent, setExpPercent] = useState(0);

    const [startMemoNum, setStartMemoNum] = useState(0);
    const [userMemo, setUserMemo] = useState([]);

    const [scrollPercent, setScrollPercent] = useState(0);

    const ScrollEventTrack = () => {
        const scrollPosition = window.scrollY;
        const docHeight = document.documentElement.scrollHeight;

        const winHeight = window.innerHeight; // 윈도우 높이
        const percent = (scrollPosition / (docHeight - winHeight)) * 100; // 비율
        setScrollPercent(percent);
    };

    const GetUser = async() => {
        try{
            const headers = {
                "Authorization" : token,
                "Content-Type": "application/json"
            };

            const response = await API.getUser(headers);
            const userData = response.data.data;

            setUserInfo(userData);
            setExpPercent(Math.round(
                userData.exp / (userData.level * 20 + (userData.level - 1) * 5) * 100, 1));
            
            GetHistory({startMemoNum});

        } catch (error) {
            alert(error.response.data.detail);
            navigate("/")
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

    const GetHistory = async({startMemoNum}) => {
        const headers = {
            "Authorization" : token
        }
        
        try {
            const response = await API.getHistory(startMemoNum, headers);
            const allMemo = response.data.data
            setUserMemo(userMemo => [...userMemo, ...allMemo]);
            
        } catch(error) {
            alert(error.response.data.detail);
        }
    };

    const LogOut = () => {
        cookie.remove("token", {path: "/"});
        navigate("/");
    };

    
    useEffect( () => {
        GetUser();
        window.addEventListener("scroll", ScrollEventTrack);

        return () => {
            window.removeEventListener("scroll", ScrollEventTrack);
        };

    }, []);

    useEffect(() => {
        if (scrollPercent >= 100){
            setStartMemoNum(startMemoNum + 16);
                
            GetHistory({startMemoNum});
        }
    }, [scrollPercent])

    return (
        <Container fluid className="userArea">
            <Row >
                
            </Row>
            <Row className="userProfile">
                <Col xs={6} className="imageArea">
                    { userInfo.profile ? 
                        <Image style={{aspectRatio: "1/1"}}
                            roundedCircle src={`https://levupbucket.s3.ap-northeast-2.amazonaws.com/users/${userInfo.profile}?timestamp=${Date.now()}`}/>
                        :
                        <Image roundedCircle src={Profile}/>
                    }
                    
                    <Dropdown className="edit">
                        <Dropdown.Toggle variant="dark" id="dropdown-basic">
                            
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item as="label" >
                                <input type="file" onChange={SelectProfile} style={{display : "none"}}/> 프로필 선택
                            </Dropdown.Item>
                            <Dropdown.Item onClick={DeleteProfile}>프로필 삭제</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col className="userInfo">
                    <Row>
                        {userInfo.id} 
                    </Row>
                    <Row>
                        Level : {userInfo.level}    
                    </Row>
                    <Row>
                        {userInfo.email}
                    </Row>
                    <Row className="logoutBtn">
                        <Button onClick={LogOut} variant="danger"> 로그아웃 </Button>
                    </Row>
                </Col>
            </Row>

            <Row className="expBar">
                <ProgressBar variant="warning"
                    now ={expPercent} label={`Exp : ${userInfo.exp} ( ${expPercent}% )`}/>
            </Row>
            <Row className="missionScore">
                <Col>
                    시작한 작업 : {userInfo.mission_start}
                </Col>
                <Col>
                    완료한 작업 : {userInfo.mission_complete}
                </Col>
            </Row>
            <Row className="activityScore">
                <Col>
                    인증 글 수 : {userInfo.board}
                </Col>
                <Col>
                    인정 받은 횟수 : {userInfo.like}
                </Col>
            </Row>
            {userMemo.map((item, index) => {
                return (
                    <MemoHistory
                        key = {index}
                        created_date = {item.created_date.$date}
                        content = {item.content}
                        status = {item.complete_status.toString()}
                    />
                )
            })}
        </Container>
    );
};
export default User;