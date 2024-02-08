const { Product } = require("../models/Product");
const { auth, isUser, isAdmin } = require("../middleware/auth");
const cloudinary = require("../utils/cloudinary");

const router = require("express").Router();

//CREATE

router.post("/", isAdmin, async (req, res) => {
  const { name, brand, desc, price, image } = req.body;

  try {
    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image, {
        upload_preset: "shopito-product-images",
      });

      if (uploadedResponse) {
        const product = new Product({
          name,
          brand,
          desc,
          price,
          image: uploadedResponse,
        });

        const savedProduct = await product.save();
        res.status(200).send(savedProduct);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//DELETE
/*
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).send("Product has been deleted...");
  } catch (error) {
    res.status(500).send(error);
  }
});
*/

//GET ALL PRODUCTS

router.get("/", async (req, res) => {
  const qbrand = req.query.brand;
  try {
    let products;

    if (qbrand) {
      products = await Product.find({
        brand: qbrand,
      });
    } else {
      products = await Product.find();
    }

    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

//GET PRODUCT

router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});

//Delete
router.delete("/:id",isAdmin, async (req,res) => {
  try{
    const product = await Product.findById(req.params.id);

    if(product.image.public_id){
      const destroyResponse = await cloudinary.uploader.destroy(product.image.public_id);

      if(destroyResponse){
        const deleteProduct = await Product.findByIdAndDelete(req.params.id);

        res.status(200).send(deleteProduct);
      }
    }
    else{
      console.log("Action Terminated, Failed to Deleted Product Image...");
    }
  }catch(err){
    res.status(500).send(err);
  }
});

//UPDATE

router.put("/:id", isAdmin, async (req, res) => {
  if(req.body.productsImg){
    try{
    const destroyResponse = await cloudinary.uploader.destroy(
      req.body.product.image.public_id
    );

    if(destroyResponse){
      const uploadedResponse = await cloudinary.uploader.upload(
        req.body.productImg,
        {
          upload_preset: "shopito-product-images",
        }
      );
      
      if(uploadedResponse){
        const updatedProduct = await Product.findByIdAndUpdate(
          req.params.id,
          {
            $set:{
              ...req.body.product,
              image: uploadedResponse,
            },
          },
          { new: true },
        );

        res.status(200).send(updatedProduct);
      }
    }
  }catch(err){
    res.status(500).send(err);
  }
  }
  else{
    try{
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body.product,
        },
        { new: true },
      );
      res.status(200).send(updatedProduct);
    }catch(err){
      res.status(500).send(err);
    }
  }
  // try {
  //   const updatedProduct = await Product.findByIdAndUpdate(
  //     req.params.id,
  //     {
  //       $set: req.body,
  //     },
  //     { new: true }
  //   );
  //   res.status(200).send(updatedProduct);
  // } catch (error) {
  //   res.status(500).send(error);
  // }
});

module.exports = router;
