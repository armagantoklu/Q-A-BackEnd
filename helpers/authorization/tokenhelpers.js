const sendJwtToClient = (user, res) => {
    const token = user.generateJwtFromUser();
    const { COOKIE, NODE_ENV } = process.env;
    return res
        .status(200)
        .cookie('access_token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + parseInt(COOKIE) * 1000 * 60),
            secure: NODE_ENV === 'gelistirme' ? false : true
        }).json({
            success: true,
            access_token: token,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                password: user.password,
                role: user.role,
                blocked: user.blocked

            }
        });
}
const isTokenIncluded = (req) => {
    return req.headers.authorization && req.headers.authorization.startsWith('Bearer:');
};
const getAccessTokenFromHeaders = (req) => {
    const authorization = req.headers.authorization;
    const accessToken = authorization.split(" ")[1];
    return accessToken;
}
module.exports = {
    sendJwtToClient,
    isTokenIncluded,
    getAccessTokenFromHeaders
};