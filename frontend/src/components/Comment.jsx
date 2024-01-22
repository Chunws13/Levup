import { Container, Row, Col } from "react-bootstrap"
const Comment = ({writer, created_datetime, content, now_date}) => {

    const fulldatetime = new Date(created_datetime);
    const now_year = now_date.getFullYear();
    
    let year = fulldatetime.getFullYear();
    let month = fulldatetime.getMonth() + 1;
    let day = fulldatetime.getDate();

    let hour = fulldatetime.getHours();
    let minute = fulldatetime.getMinutes();

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
        <Container>
            <Row>
                <Col style={{display:"flex", justifyContent:"flex-start", fontSize : "3vw"}}>
                    {writer}
                </Col>
                <Col style={{display:"flex", justifyContent:"flex-end", fontSize : "3vw"}}>
                    {GetDate()}
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