
import { API } from "../../API";
import { Container, Dropdown, Image, Row, Col, Button, ProgressBar } from "react-bootstrap";
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Profile from '../../images/basicProfile.jpeg'

const User = ({ token }) => {
    const navigate = useNavigate();
    const cookie = new Cookies();

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

    const LogOut = () => {
        cookie.remove("token", {path: "/"});
        window.location.reload();
    }

    useEffect( () => {
        GetUser();
        
    }, [expPercent])

    return (
        <Container fluid>
            <Row>
                <Dropdown>
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
            <Row>
                { userInfo.profile ? 
                    <Image roundedCircle src={`https://levupbucket.s3.ap-northeast-2.amazonaws.com/users/${userInfo.profile}?timestamp=${Date.now()}`} style={{width: "auto", height: "100%"}}/>
                    :
                    <Image roundedCircle src={Profile}/>
                }
            </Row>
            <Row>
                {userInfo.id} 
            </Row>
            <Row>
                <Col>
                    Level : {userInfo.level}
                </Col>
                <Col>
                    {userInfo.email}
                </Col>
            </Row>

            <Row>
                <ProgressBar style={{height: "60%"}}
                    now ={expPercent} label={`Exp : ${userInfo.exp} ( ${expPercent}% )`}/>
            </Row>
            <Row>
                <Col>
                    시작한 작업 : {userInfo.mission_start}
                </Col>
                <Col>
                    완료한 작업 : {userInfo.mission_complete}
                </Col>
            </Row>
            <Row>
                <Col>
                    인증 글 수 : {userInfo.board}
                </Col>
                <Col>
                    인정 받은 횟수 : {userInfo.like}
                </Col>
            </Row>
            <Row>
                <Button onClick={LogOut} variant="danger"> 로그아웃 </Button>
            </Row>
        </Container>
    );
};
export default User;