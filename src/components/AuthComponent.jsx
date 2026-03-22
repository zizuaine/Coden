const AuthComponent = ({ children, title }) => {
    return (
        <div className="authContainer">
            <h1>{title}</h1>

            {children}
        </div>
    )
}

export default AuthComponent;