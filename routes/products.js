import express from "express"
import Product from "../schemas/Product.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router()

router.post('/',authMiddleware, async (req, res) => {
  try{
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar produto", error});
  }

})

router.get('/', async (req, res) => {
    try{
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error){
        res.status(500).json({ error: "Erro ao buscar produtos", error});
    }
})

export default router