export function getJwtSecret() {
    return process.env.JWT_USER_PASSWORD;
}