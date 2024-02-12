import axios from "axios";
import { Container, Row, Col, Image } from "react-bootstrap"
import Profile from '../images/basicProfile.jpeg'
import { useEffect, useState } from "react";

const Comment = ({writer, created_datetime, content, now_date}) => {

    const fulldatetime = new Date(created_datetime);
    const now_year = now_date.getFullYear();
    const [commenter, setCommenter] = useState(false);
    
    let year = fulldatetime.getFullYear();
    let month = fulldatetime.getMonth() + 1;
    let day = fulldatetime.getDate();

    let hour = fulldatetime.getHours();
    let minute = fulldatetime.getMinutes();

    useEffect( () => {
        const GetCommenter = async() => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/users/profile?user_name=${writer}`,
                                                {
                                                    headers: {
                                                        "Content-Type": "application/json"
                                                    }
                                                });
                setCommenter(response.data.data);
    
    
            } catch (error) {
                alert(error.response.data.detail);
            };
        }

        GetCommenter();

    }, []);

    const GetDate = () =>{
        month = month < 10 ? `0${month}` : month
        day = day < 10 ? `0${day}` : day
        hour = hour < 10 ? `0${hour}` : hour
        minute = minute < 10 ? `0${minute}` : minute

        if (now_year === year){
            return `${month}-${day} ${hour}:${minute}`
        }
        return `${year}-${month}-${day} ${hour}:${minute}`
    }

    return (
        <Container style={{padding: "1.5vw", color: "wheat"}}>
            <Row style={{fontSize : "4vw"}}>
                <Col xs={2} style={{display: "flex", alignItems: "center", justifyContent: "left"}}>
                    { commenter ?  
                        <Image roundedCircle src={`https://levupbucket.s3.ap-northeast-2.amazonaws.com/users/${commenter}`} style={{width: "80%", height: "auto"}}/>
                        : <Image roundedCircle src={Profile} style={{width: "80%", height: "auto"}}/>
                    }    
                </Col>
                <Col>
                    <Row style={{display:"flex", justifyContent:"left"}}>
                        {writer}
                    </Row>
                    <Row>
                        {content}

                    </Row>
                </Col>
                <Col style={{display:"flex", justifyContent:"flex-end"}}>
                    {GetDate()}
                </Col>
            </Row>  
        </Container>
    )
}

export default Comment;