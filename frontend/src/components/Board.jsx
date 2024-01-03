import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";

const Board = () => {
    const [board, setBoard] = useState([]);

    const Getboard = async() => {
        try {
            const resopnse = await axios.get("http://127.0.0.1:8000/api/boards");
            setBoard(resopnse.data);
            
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
                        { item.writer }
                        { item.title }
                        { item.content }
                        { item.created_datetime }
                    </Row>
                )
            })}
        </Container>
    )
}

export default Board;