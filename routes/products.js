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

router.put('/',authMiddleware, async (req, res)=> {

  try{

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true}
    )

    return res.status(200).json(updatedProduct)

  } catch (error) {
    returnres.status(500).json({
      error: "Erro ao atualizar produto"
    })
  }
})

router.delete('/',authMiddleware, async (req, res)=> {

  try{
    await Product.findByIdAndDelete(req.userId)
    return res.status(200).json({
      message: "Produto deletado"
    })
  
  } catch (error) {
    
    return res.status(500).json ({
      error: "Erro ao deletar produto"
    })
  }
})
export default router