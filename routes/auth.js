import express from "express"
import bcrypt from "bcrypt"
import validator from "validator"
import jwt from "jsonwebtoken"
import User from "../schemas/User.js"

const router = express.Router()

router.post("/register", async (req,res)=> {
    try {
        const { name, email, password, number } = req.body

        const isEmail = validator.isEmail(email)
        if(!isEmail) {
            return res.status(400).json({error: "Formato de email inválido"})
        }

        const thereIsUser = await User.findOne({email: email})
        if(thereIsUser) {
            return res.status(400).json({error: "O Email já está em uso"})
        }
        
        const isNumber = validator.isMobilePhone(number, "pt-BR")
        if(!isNumber){
            return res.status(400).json({error: "numero de telefone não é valido"})
        }
        
        const isNameEmpty = validator.isEmpty(name)
        if(isNameEmpty){
            return res.status(400).json({error: "Nome não pode ser vazio"})
        }

        const isPassword = validator.isLength(password, {min: 6})
        if(!isPassword){
            return res.status(400).json({error: "Senha tem que ter 6 ou mais caracteres"})
        }

        const hashPassword = await bcrypt.hash(password, 10)

        await User.create({name, email, password: hashPassword, number})

        res.status(201).json({resposta: "Usuario registrado com sucesso"})
    }
    catch(error){
        res.status(500).send(error)
    }
})

router.post("/login", async (req, res)=>{
    try {
        const {email, password} = req.body
        const isEmailValid = validator.isEmail(email)
        const isPasswordEmpty = validator.isEmpty(password)
        if (!isEmailValid || isPasswordEmpty){
            return res.status(400).json({error: "email ou senha inválidos"})
        }
        
        const dataDb = await User.findOne({email: email})
        if (!dataDb) {
            return res.status(401).json({error: "email ou senha inválidos"})
        }
        
        const passwordDb = dataDb.password
        
        const isPasswordValid = await bcrypt.compare(password, passwordDb)
        if (!isPasswordValid) {
            return res.status(401).json({error: "email ou senha inválidos"})
        }
        const dataId = {id: dataDb._id}
        const token = jwt.sign(dataId, process.env.JWT_SECRET, { expiresIn: process.env.JWT_REFRESH})
        res.status(200).json({token})
    }
    catch(error) {
        res.status(500).json({error: "erro no servidor"})
    }

})

export default router