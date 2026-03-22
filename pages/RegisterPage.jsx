import AuthComponent from "../src/components/AuthComponent"
import RegisterForm from "../src/components/RegisterForm"

const RegisterPage = () => {

    return (
        <div className="auth-wrapper">
            <AuthComponent title="Register Here">
                <RegisterForm />
            </AuthComponent>
        </div>

    )
}

export default RegisterPage;