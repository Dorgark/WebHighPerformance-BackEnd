import express from "express";
import Product from "../schemas/Product.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";
import cloudinary from "cloudinary";
import cloudinaryStorage from "multer-storage-cloudinary";
import dotenv from "dotenv"

dotenv.config()
const router = express.Router();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "lojinha_produtos",
  allowedFormats: ["jpg", "png", "jpeg", "webp"],
});

const upload = multer({ storage: storage });

router.post('/',authMiddleware, upload.single('image'), async (req, res) => {
  try{
    const productData = req.body

    if (req.file) {
      productData.imageUrl = req.file.secure_url;
      productData.imagePublicId = req.file.filename;
    } else {
      return res.status(400).json({ error: "A imagem do produto é obrigatória" });
    }
    const newProduct = await Product.create(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Erro no terminal:", error);
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

router.put('/:id', authMiddleware, upload.single('image'), async (req, res)=> {
  try {
    const productData = req.body;

    if (req.file) {
      const produtoAntigo = await Product.findById(req.params.id);

      if (!produtoAntigo) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      if (produtoAntigo.imagePublicId) {
        await cloudinary.v2.uploader.destroy(produtoAntigo.imagePublicId);
      }

      productData.imageUrl = req.file.secure_url || req.file.url || req.file.path;
      productData.imagePublicId = req.file.filename;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      productData, 
      { returnDocument: 'after' }
    );

    return res.status(200).json(updatedProduct);

  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar produto" });
  }
});

router.delete('/:id',authMiddleware, async (req, res)=> {

  try{
    const produto = await Product.findById(req.params.id);

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado no banco de dados" });
    }

    if (produto.imagePublicId) {
      await cloudinary.v2.uploader.destroy(produto.imagePublicId);
    }

    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({message: "Produto deletado"})

  } catch (error) {
    return res.status(500).json ({error: "Erro ao deletar produto"})
  }
})
export default router