import { useEffect } from "react"
import { API } from "../../API";
import { useNavigate } from "react-router-dom";
import { Button, Image } from "react-bootstrap";
import { Cookies } from "react-cookie";
import KakaoLoginBtn from "../../images/kakao_login.png"
    
const KakaoLogin = () => {
    const naviage = useNavigate();
    
    const KakaoLogin = () => {
        window.Kakao.Auth.login({
            success: async function(data) {
                await KakaoLoginSuccess(data);
            },
            fail: function(data){
                alert(data);
            }
        });
    };

    const KakaoLoginSuccess = async(data) => {
        const access_token = data.access_token;
        const body = {access_token: access_token};
        const cookie = new Cookies();

        const login_request = await API.kakoLoginRequset(body);
        cookie.set("token", login_request.data.token, {path: "/"});
        naviage("/");
    };

    useEffect(() => {
        if(!window.Kakao.isInitialized()){
            window.Kakao.init(process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY);
        }
    });

    return (
        <Button style={{ border: 'none', padding: 0, backgroundColor: 'transparent'}}>
            <Image onClick={KakaoLogin} src={KakaoLoginBtn} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
        </Button>
    );
};

export default KakaoLogin;