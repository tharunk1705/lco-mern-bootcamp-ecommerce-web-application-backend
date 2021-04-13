const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
    .populate("category")
    .exec( (err, product) => {
        if(err) {
            return res.status(400).json({
                error : "Product Not Found!"
            });
        }
        req.product = product;
        next();
    });
}


exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse( req, (err, fields, file) => {
        if(err) {
            return res.status(400).json({
                error : "Problem uploading the image!"
            });
        }

        // destructuring the fields
        const { price, name, description, category, stock} = fields;
        // Restrictions
        if(
            !name ||
            !description ||
            !price ||
            !category ||
            !stock
        ) {
            return res.status(400).json({
                error : "Include all the Fields"
            });
        }

        let product = new Product(fields);
        // handle files
        if(file.photo) {
            if(file.photo.size > 3000000) {
                return res.status(400).json({
                    error : "File size too Big!"
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        // Save to the DB
        product.save((err, product) => {
            if(err) {
                res.status(400).json({
                    error : "Saving in DB Failed!"
                });
            }
            res.json(product);
        });
    });
}


exports.getProduct = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
}

exports.photo = (req, res, next) => {
    if(req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}

// delete Controlller

exports.deleteProduct = (req, res) => {
    let product = req.product;
    product.remove( (err, deletedProduct) => {
        if(err) {
            return res.status(400).json({
                error : "Failed to delete the product"
            });
        }
        res.json({
            message : `Successfully deleted ${deletedProduct.name}!`,
            deletedProduct
        })
    });
};


exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse( req, (err, fields, file) => {
        if(err) {
            return res.status(400).json({
                error : "Problem uploading the image!"
            });
        }

        // updation code
        let product = req.product;
        product = _.extend(product, fields);


        // handle files
        if(file.photo) {
            if(file.photo.size > 3000000) {
                return res.status(400).json({
                    error : "File size too Big!"
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        // Save to the DB
        product.save((err, product) => {
            if(err) {
                res.status(400).json({
                    error : "Updation in DB Failed!"
                });
            }
            res.json(product);
        });
    });
}

exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

    Product.find()
        .select("-photo")
        .populate("category")
        .sort([[sortBy, "asc"]])
        .limit(limit)
        .exec((err, products) => {
            if(err) {
                return res.status(400).json({
                    error : "No products Found!"
                });
            }
            res.json(products);
        })
}

exports.getAllUniqueCategories = (req, res) => {
    Product.distinct("category", {}, (err, categories) => {
        if(err){
            return res.status(400).json({
                error : "No Category found!"
            });
        }
        res.json(categories);
    });
}

exports.updateStock = (req, res, next) => {
    let myOperations = req.body.order.Product.map(product => {
        return {
            updateOne : {
                filter : {_id : product._id},
                update : {$inc : {stock : -product.count, sold : +product.count}}
            }
        }
    });
    Product.bulkWrite(myOperations, {}, (err, products) => {
        if(err) {
            return res.status(400).json({
                error : "Bulk Operation Failed"
            });
        }
        next();
    });
}