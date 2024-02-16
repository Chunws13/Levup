import { Form, Button, Container, Stack, Row, Col, Badge } from 'react-bootstrap'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import axios from 'axios';

const Report = () => {
    const cookie = new Cookies();
    const token = cookie.get("token");
    const navigate = useNavigate();

    const [reportContent, setReportContent] = useState("");

    const GetReports = async() => {
        try{
            const response = await axios.get('http://127.0.0.1:8000/api/reports/', {
                headers : {
                    Authorization : token,
                    "Content-Type": "application/json"
                }
            });

            console.log(response);

        } catch(error){
            alert(error.response.data.detail);
            navigate("/login")
        }


    }

    const SubmitReport = async() => {
        const postData = { reportContent }
    }

    useEffect(() => {
        GetReports();
    })

    return (
        <Container fluid style={{padding: "3vw", height: "75vh"}}>
            <Container style={{height: "70%"}}>

            </Container>

            <Container style={{height: "30%"}}>
                <Form>
                    <Form.Group>
                        <Form.Label> 버그 / 오류 제보 </Form.Label>
                        <Form.Control as="textarea" rows={6} 
                            value={reportContent} onChange={(event) => setReportContent(event.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                        <Button type='submit' style={{width: "100%", marginTop: "3vw"}}> 제보하기 </Button>
                    </Form.Group>
                </Form>
            </Container>

        </Container>
    );
}

export default Report;