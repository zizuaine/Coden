import AuthComponent from "../src/components/AuthComponent"
import LoginForm from "../src/components/LoginForm"

const LoginPage = () => {

    return (
        <div className="auth-wrapper">
            <AuthComponent title="Login">
                <LoginForm />
            </AuthComponent>
        </div>
    )
}

export default LoginPage;