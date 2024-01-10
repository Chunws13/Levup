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

    const Getboard = async() => {
        try {
            const resopnse = await axios.get("http://127.0.0.1:8000/api/boards/");
            setBoard(resopnse.data);
            
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
                return Getboard();

            } else {
                navigate("/login");
            }

        } catch (error) {
            alert(error.detail);
        }
    }

    const CreateComment = async({ token, board_id, content }) => {
        try{
            if (token !== undefined){
                await axios.post(`http://127.0.0.1:8000/api/boards/${board_id}/comment`,
                    { content },
                    { headers : {
                        "Authorization" : token,
                        "Content-Type": "application/json"
                        }});
                        
            } else {
                navigate("/login");
            }

        } catch (error) {
            alert(error.detail);
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
                            board_id = {item.id}
                            writer={item.writer}
                            title={item.title}
                            content={item.content}
                            like = {item.like}
                            reply = {item.comment}
                            create_datetime={item.created_datetime}
                            now_date = {now_date}
                            token = {token}
                            PushLike = {PushLike}
                            CreateComment = {CreateComment}
                        />
                    </Row>
                )
            })}
        </Container>
    )
}

export default Board;