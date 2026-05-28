import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import Product from "./schemas/Product.js"
import authRoutes from "./routes/auth.js"

const app = express()

dotenv.config()
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

app.use("/api/auth", authRoutes)


app.post('/products', async (req, res) => {
  try{
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    res.send({error: error})
  }

})

app.get('/products', async (req, res) => {
try{
  const products = await Product.find();
  res.json(products);
} catch (error){
  res.json({error: error});
}

})

<<<<<<< Updated upstream
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor local rodando na porta ${PORT} http://localhost:${PORT}`);
  });
}
=======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor local rodando na porta ${PORT} http://localhost:${PORT}`);
});
>>>>>>> Stashed changes

export default app
