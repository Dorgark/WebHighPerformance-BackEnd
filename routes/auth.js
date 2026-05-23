import express from "express"
import bcrypt from "bcrypt"
import mongoose from "mongoose"
import validator from "validator"
import User from "../schemas/User.js"

const router = express.Router()
const app = express()

router.post("/register", async (req,res)=> {
    try {
        const{ name, email, password, number} = req.body

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

        const rawPassword = await password
        const hashPassword = await bcrypt.hash(rawPassword, 10)

        User.create({name, email, password: hashPassword, number})

        res.status(201).json({resposta: "Usuario resgistrado com sucesso"})
    }
    catch(error){
        res.status(500).send(error)
    }
})

export default router