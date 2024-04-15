import { GithubLoginButton} from "react-social-login-buttons";
import "./LoginPage.css";

type LoginPageProps = {
    login: () => void;

}

export default function LoginPage(props: Readonly<LoginPageProps>) {
    return (
        <div className={"login-wrapper"}>
            <img src={"/rslogo.png"} alt={"logo"} className={"logo"}></img>
            <div className={"login-btn-wrapper"}>
        <GithubLoginButton onClick={props.login}></GithubLoginButton>
            </div>
        </div>
    )
}