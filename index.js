import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import Produto from "./schemas/Produto.js"

dotenv.config()

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_KEY)
        console.log("conectado ao MongoDB com sucesso")
    }
    catch(error){
        console.log("erro ao se conectar ao MongoDB", error)
    }
}
connectDB()

//ROTAS DE POST E GET ABAIXO

// Suas rotas e middlewares aqui (ex: app.get...)

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor local rodando na porta ${PORT} http://localhost:${PORT}`);
  });
}

export default app
