import { useState, useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ViewBoard from "./ViewBoard";

const Board = () => {
    const [board, setBoard] = useState([]);
    const now_date = new Date();
    const cookie = new Cookies();
    const token = cookie.get("token");
    const navigate = useNavigate();

    const GetBoard = async() => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/boards/");
            setBoard(response.data);
            
        } catch {
            alert("서버 에러");
        }
    }
    
    const PushLike = async({ token, board_id }) => {
        try{
            if (token !== undefined){
                await axios.get(`http://127.0.0.1:8000/api/boards/${board_id}/like`,
                    {headers : {
                        "Authorization" : token,
                        "Content-Type": "application/json"
                        }});
                return GetBoard();

            } else {
                navigate("/login");
            }

        } catch (error) {
            alert(error.detail);
        }
    }

    useEffect(() => {
        GetBoard();
    }, []);

    return (
        <Container>
            { board.map((item, index) => {
                return (
                    <Row key={index}>
                        <ViewBoard
                            board_id = {item.id}
                            writer={item.writer}
                            title={item.title}
                            content={item.content}
                            files = {item.files}
                            like = {item.like}
                            reply = {item.comment}
                            create_datetime={item.created_datetime}
                            now_date = {now_date}
                            token = {token}
                            PushLike = {PushLike}
                        />
                    </Row>
                )
            })}
        </Container>
    )
}

export default Board;