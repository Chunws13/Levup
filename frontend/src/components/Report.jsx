import { Form, Button, Container, Stack } from 'react-bootstrap'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import EachReport from './EachReport';
import axios from 'axios';

const Report = () => {
    const cookie = new Cookies();
    const token = cookie.get("token");
    const navigate = useNavigate();

    const [reportTitle, setReportTitle] = useState("");
    const [reportContent, setReportContent] = useState("");
    const [reportData, setReportData] = useState([]);

    const SubmitReport = async(event) => {
        event.preventDefault();
        const postData = { 
            title : reportTitle,
            content: reportContent 
        };

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/reports/', 
                { ...postData },
                {    
                    headers : {
                        Authorization : token,
                        "Content-Type": "application/json"
                    }
                });

            setReportData([response.data.data, ...reportData]);
            
        } catch (error){
            alert(error.response.data.detail);
        }
    }

    const GetReports = async() => {
        try{
            const response = await axios.get('http://127.0.0.1:8000/api/reports/', {
                headers : {
                    Authorization : token,
                    "Content-Type": "application/json"
                }
            });

            setReportData(response.data.data);
    
        } catch(error){
            alert(error);
            navigate("/login")
        }
    }
    useEffect(() => {
        GetReports();
    },[])

    return (
        <Container fluid style={{padding: "3vw", height: "75vh"}}>
            <Container style={{height: "60%", overflow:"auto"}}>
            
                <Stack gap={3}>
                    {reportData.map((item, index) => {
                        return (
                            <EachReport
                                key={index}
                                writer={item.writer}
                                title= {item.title}
                                content={item.content}
                                reported_date={item.reported_date.$date}
                            />
                            )})}
                </Stack>
            </Container>

            <Container style={{height: "30%"}}>
                <Form onSubmit={SubmitReport}>
                    <Form.Group>
                            <Form.Label> 버그 / 오류 제보 </Form.Label>
                            <Form.Control type="text"
                                value={reportTitle} onChange={(event) => setReportTitle(event.target.value)}/> 
                    </Form.Group>
                    <Form.Group>
                        <Form.Label> 상세 내용 </Form.Label>
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