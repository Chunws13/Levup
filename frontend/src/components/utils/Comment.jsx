import { Container, Row, Col, Image } from "react-bootstrap"
import { useEffect, useState } from "react";
import { API } from "../../API";
import { ConvertDate } from "../utils/ConvertDate";
import Profile from '../../images/basicProfile.jpeg'



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

    });

    return (
        <Container fluid className="eachComment">
            <Row>
                <Col className="commnterImg" xs={2}>
                    { commenter ?  
                        <Image roundedCircle src={`https://levupbucket.s3.ap-northeast-2.amazonaws.com/users/${commenter}`} style={{width: "80%", height: "auto"}}/>
                        : <Image roundedCircle src={Profile} style={{width: "90%", height: "auto%", objectFit: "cover"}}/>
                    }    
                </Col>
                <Col>
                    <Row>
                        <Col className="commentWriter">
                            {writer}
                        </Col>
                        <Col className="commentWirteTime">
                            {ConvertDate(created_datetime)}
                        </Col>
                    </Row>
                    <Row className="commentContent" xs={9}>
                        <Col >
                            {content}
                        </Col>
                    </Row>
                </Col>
            </Row>  
        </Container>
    )
}

export default Comment;