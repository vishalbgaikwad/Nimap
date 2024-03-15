import { Router } from "express";
import client from "../pg.js";

const ProductRouter = Router();

ProductRouter.get("/", (req, res) => {
  const { page = 1 } = req.query;
  const limit = 10;
  const offset = (Math.abs(parseInt(page) || 1) - 1) * limit;

  client.query("select * from product", (err, result) => {
    if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
    const rowCount = result.length;
    client.query(
      `select * from product limit ? offset ?`,
      [limit, offset],
      (err, result) => {
        if (err) {
          return res.status(400).json({ success: false, error: err.message });
        }
        return res.json({
          success: true,
          message: "Products fetched successfully.",
          data: result,
          isNextPage: rowCount > limit * page,
          limit,
        });
      }
    );
  });
});

ProductRouter.get("/by-category/:categoryId", (req, res) => {
  const categoryId = req.params.categoryId;
  const { page = 1 } = req.query;
  const limit = 10;
  const offset = (Math.abs(parseInt(page) || 1) - 1) * limit;

  client.query(
    "SELECT p.* FROM product p WHERE p.categoryId = ? LIMIT ? OFFSET ?",
    [categoryId, limit, offset],
    (err, result) => {
      if (err) {
        return res.status(400).json({ success: false, error: err.message });
      }
      return res.json({
        success: true,
        message: "Products fetched successfully.",
        data: result,
      });
    }
  );
});

ProductRouter.post("/", (req, res) => {
  const { categoryId, productName } = req.body;
  if (!categoryId || !productName) {
    return res
      .status(400)
      .json({ success: false, error: "All fields are required." });
  }
  client.query(
    "insert into product (categoryid, productname) values(?, ?)",
    [categoryId, productName],
    (err) => {
      if (err) {
        return res.status(400).json({ success: false, error: err.message });
      }

      return res
        .status(201)
        .json({ success: true, message: "Product inserted successfully." });
    }
  );
});

ProductRouter.put("/:pId", (req, res) => {
  const { pId } = req.params;
  const { productName } = req.body;
  if (!productName) {
    return res
      .status(400)
      .json({ success: false, error: "All fields are required." });
  }

  client.query(
    "update product set productname=? where productid=?",
    [productName, pId],
    (err) => {
      if (err) {
        return res.status(400).json({ success: false, error: err.message });
      }
      
    }
  );
  return res.json({
    success: true,
    message: "Product updated successfully.",
  });
});

ProductRouter.delete("/:pid", (req, res) => {
  const { pid } = req.params;
  if (!pid) {
    return res
      .status(400)
      .json({ success: false, error: "Product ID is required" });
  }

  client.query(
    `delete from product where productid=?`,
    [pid],
    (err, result) => {
      if (err) {
        return res.status(400).json({ success: false, error: err.message });
      }

      if (!result.affectedRows) {
        return res
          .status(404)
          .json({ success: false, error: "Product not found" });
      }

      return res
        .status(200)
        .json({ success: true, message: "Product deleted successfully." });
    }
  );
});

export default ProductRouter;
