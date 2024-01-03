import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import ViewBoard from "./ViewBoard";

const Board = () => {
    const [board, setBoard] = useState([]);

    const Getboard = async() => {
        try {
            const resopnse = await axios.get("http://127.0.0.1:8000/api/boards");
            setBoard(resopnse.data);
            resopnse.data.map((item) => {console.log(item.title)});
            
        } catch {
            alert("서버 에러");
        }
    }

    useEffect(() => {
        Getboard();
    }, []);

    return (
        <Container>
            { board.map((item, index) => {
                return (
                    <Row key={index}>
                        <ViewBoard
                            writer={item.writer}
                            title={item.title}
                            content={item.content}
                            create_date={item.created_datetime}
                        />
                    </Row>
                )
            })}
        </Container>
    )
}

export default Board;