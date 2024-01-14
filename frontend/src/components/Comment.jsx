import { Container, Row, Col } from "react-bootstrap"
const Comment = ({writer, created_datetime, content}) => {

    return (
        <Container>
            <Row>
                <Col style={{display:"flex", justifyContent:"flex-start", fontSize : "3vw"}}>
                    {writer}
                </Col>
                <Col style={{display:"flex", justifyContent:"flex-end", fontSize : "3vw"}}>
                    {created_datetime}
                </Col>

            </Row>
            <Row style={{display:"flex", justifyContent:"flex-start", fontSize : "3vw"}}>
                <Col xs={8} >
                    {content}
                </Col>
            </Row>        
        </Container>
    )
}

export default Comment;