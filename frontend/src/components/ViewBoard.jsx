import { Container, Row, Col } from "react-bootstrap"

const ViewBoard = ({ writer, title, content, create_datetime, now_date}) => {
    const fulldatetime = new Date(create_datetime);
    const now_year = now_date.getFullYear();
    
    let year = fulldatetime.getFullYear();
    let month = fulldatetime.getMonth() + 1;
    let day = fulldatetime.getDate();
    let hour = fulldatetime.getHours();
    let minute = fulldatetime.getMinutes();
    
    const get_date = () =>{
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
        <Container style={{padding: "3vh"}}>
            <Row >
                <Col style={{display:"flex", justifyContent:"flex-start", fontSize : "3vw"}} >
                    {writer}
                </Col>
                <Col style={{display:"flex", justifyContent:"flex-end", fontSize : "3vw"}}>
                    {get_date()}
                </Col>
            </Row>
            <Row style={{display:"flex", justifyContent:"center", fontSize : "3vw"}}>
                {title}
            </Row>
            <Row  className="justify-content-center">
                {content}
            </Row>
            <Row  className="justify-content-center">
                <Col style={{display:"flex", justifyContent:"center", fontSize : "3vw"}}>
                    좋아요
                </Col>
                <Col style={{display:"flex", justifyContent:"center", fontSize : "3vw"}}>
                    댓글 보기
                </Col>
                <Col style={{display:"flex", justifyContent:"center", fontSize : "3vw"}}>
                    댓글 달기
                </Col>
            </Row>
        </Container>
    )
}

export default ViewBoard