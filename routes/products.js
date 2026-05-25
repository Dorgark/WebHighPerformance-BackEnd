import express from "express"
import Product from "../schemas/Product.js";

const router = express.Router()

router.post('/products', async (req, res) => {
  try{
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    res.json({error: error})
  }

})

router.get('/products', async (req, res) => {
    try{
        const products = await Product.find();
        res.json(products);
    } catch (error){
        res.json({error: error});
    }
})

export default router