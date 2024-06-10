import { Container, Row, Col } from "react-bootstrap";
import {ConvertDate} from "./ConvertDate";
import "../css/MemoHistory.css"
const MemoHistory = ({created_date, content, status}) => {
    const date = ConvertDate(created_date).split(" ")[0];

    return (
        <Container fluid className="historyContainer">
            <Row>
                <Col xs={3} className="date">
                    {date}
                </Col>
                <Col xs={7} className="content">
                    {content}
                </Col>
                <Col xs={2} className="status">
                    {status}
                </Col>
            </Row>
        </Container>
    )
};

export default MemoHistory;