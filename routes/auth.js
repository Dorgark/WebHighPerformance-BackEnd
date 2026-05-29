import express from "express"
import bcrypt from "bcrypt"
import validator from "validator"
import jwt from "jsonwebtoken"
import User from "../schemas/User.js"
import authMiddleware from "../middleware/authMiddleware.js"

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
        const id = {id: dataDb._id}
        const token = jwt.sign(id, process.env.JWT_SECRET, { expiresIn: process.env.JWT_REFRESH})
        console.log(req.userId)
        res.status(200).json({token})
    }
    catch(error) {
        res.status(500).json({error: "erro no servidor"})
    }

})

router.patch("/edit",authMiddleware, async (req,res)=>{
    try {
        const {name, email, password, number} = req.body
        const dataToUpdate = {}

        if (name) {
            const isNameEmpty = validator.isEmpty(name)
            if(isNameEmpty) {
               return res.status(401).json({error: "Nome não pode ser vazio"})
            }
            dataToUpdate.name = name
        }

        if (email){
            const isEmail = validator.isEmail(email)
            if(!isEmail) {
                return res.status(400).json({error: "Formato de email inválido"})
            }
            const thereIsUser = await User.findOne({email: email})
            if(thereIsUser) {
                return res.status(400).json({error: "O Email já está em uso"})
            }

            dataToUpdate.email = email
        }

        if(number){
            const isNumber = validator.isMobilePhone(number, "pt-BR")
            if(!isNumber){
                return res.status(400).json({error: "numero de telefone não é valido"})
            }

            dataToUpdate.number = number
        }

        if(password){
            const isPassword = validator.isLength(password, {min: 6})
            if(!isPassword){
                return res.status(400).json({error: "Senha tem que ter 6 ou mais caracteres"})
            }

            const newPassword = await bcrypt.hash(password, 10)

            dataToUpdate.password = newPassword
        }
        const updatedUser = await User.findByIdAndUpdate(req.userId, dataToUpdate, {new: true})
        return res.status(200).json(updatedUser)
    }
    catch(error){
        return res.status(500).json({error: error})
    }

})

router.delete("/delete",authMiddleware, async (req,res)=>{
    try {
        const deleted = await User.findByIdAndDelete(req.userId)
        return res.status(200).json(deleted)
    }
    catch(error){
        return res.status(500).json({error: error})
    }

})


export default router