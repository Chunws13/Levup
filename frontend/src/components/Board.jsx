import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import ViewBoard from "./ViewBoard";

const Board = () => {
    const [board, setBoard] = useState([]);
    const now_date = new Date();

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
                        <ViewBoard
                            writer={item.writer}
                            title={item.title}
                            content={item.content}
                            create_datetime={item.created_datetime}
                            now_date = {now_date}
                        />
                    </Row>
                )
            })}
        </Container>
    )
}

export default Board;