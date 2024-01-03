import { Container, Row, Col } from "react-bootstrap"

const ViewBoard = ({ writer, title, content, create_datetime}) => {
    return (
        <Container>
            <Row  className="justify-content-center">
                {writer}
            </Row>
            <Row  className="justify-content-center">
                {title}
            </Row>
            <Row  className="justify-content-center">
                {content}
            </Row>
            <Row  className="justify-content-center">
                {create_datetime}
            </Row>
            <Row  className="justify-content-center">
                댓글 있으면 댓글 보이기
            </Row>
            <Row  className="justify-content-center">
                댓글 달기
            </Row>
        </Container>
    )
}

export default ViewBoard