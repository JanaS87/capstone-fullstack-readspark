type LoginPageProps = {
    login: () => void;

}

export default function LoginPage(props: Readonly<LoginPageProps>) {
    return (
        <button onClick={props.login}>Login with GitHub</button>
    )
}