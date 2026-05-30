import jwt from "jsonwebtoken"

function authMiddleware (req,res,next) {
    const trashToken = req.headers["authorization"]
    const token = trashToken.replace("Bearer ", "")
    
    try {
        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = verifiedToken.id
        next()
    }
    catch(error) {
        res.status(500).json({error: error})
    }
}

export default authMiddleware