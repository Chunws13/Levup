import { Container, Image } from "react-bootstrap"
import backgroundimg from "../../images/wallpaper/baduck_wallpaper_pc.png"

const Background = () => {
    return (
        <Container className="background" style={{height: "100vh"}}>
            <Image src= {backgroundimg} style={{height: "100%"}}/>
        </Container>
    )
}

export default Background;