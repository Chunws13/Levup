import { Container, Row, Col, Image } from "react-bootstrap"
import { useEffect, useState } from "react";
import { API } from "../API";
import { ConvertDate } from "./utils/ConvertDate";
import Profile from '../images/basicProfile.jpeg'

const Comment = ({writer, created_datetime, content}) => {

    const [commenter, setCommenter] = useState(false);
    
    useEffect( () => {
        const GetCommenter = async() => {
            try {
                const response = await API.getCommenter(writer);
                setCommenter(response.data.data);

            } catch (error) {
                alert(error.response.data.detail);
            };
        }

        GetCommenter();

    }, []);

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
                    {ConvertDate(created_datetime)}
                </Col>
            </Row>  
        </Container>
    )
}

export default Comment;