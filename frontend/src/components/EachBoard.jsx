import { useState } from 'react'
import { Button, Container, Row, Col } from 'react-bootstrap'
import axios from 'axios'
import { Cookies } from "react-cookie";

const EachBaord = () => {
    const cookie = new Cookies();
    const token = cookie.get("token");
    
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const PostBoard = () => {

        postData = {};
        try{
            axios.post("http://127.0.0.1:8000/api/memo",
                { content : writeMemo },
                { headers : {
                    "Authorization" : token,
                    "Content-Type": "application/json"
                    }});

        } catch {

        }
    }

    return (
        <Container>
            <Row>
            </Row>
        </Container>
    )
}