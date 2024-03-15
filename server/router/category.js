import { Router } from "express";
import client from "../pg.js";

const CategoryRouter = Router();

CategoryRouter.get("/", async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const limit = 20;
    const offset = (Math.abs(parseInt(page) || 1) - 1) * limit;

    client.query("select * from category", (err, r, f) => {
      const rowCount = r.length;
      client.query(
        `select * from category limit ? offset ?`,
        [limit, offset],
        (error, result, fields) => {
          if (error) throw new Error("Something  went wrong");
          return res.json({
            success: true,
            message: "Categories fetched successfully.",
            data: result,
            isNextPage: rowCount > limit * page,
            limit,
          });
        }
      );
    });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

CategoryRouter.post("/", async (req, res) => {
  try {
    const { categoryName } = req.body;
    if (!categoryName) throw new Error("All fields are required.");
    client.query("insert into category (categoryname) values(?)", [
      categoryName,
    ]);
    return res
      .status(201)
      .json({ success: true, message: "Category inserted successfully." });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

CategoryRouter.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { categoryName } = req.body;
    if (!categoryName) throw new Error("All fields are required.");
    client.query("update category set categoryname=? where categoryid=?", [
      categoryName,
      cid,
    ]);
    return res.json({
      success: true,
      message: "Category updated successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error: error.message });
  }
});

CategoryRouter.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    if (!cid) throw new Error("Category ID is required");
    client.query(
      `delete from category where categoryid=?`,
      [cid],
      (error, results, fields) => {
        if (error) throw new Error("Category not found");

        if (results.affectedRows === 0) {
          return res
            .status(400)
            .json({ success: false, error: "Category not found" });
        }
        return res.json({
          success: true,
          message: "Category deleted successfully.",
        });
      }
    );
  } catch (error) {
    console.log(error);
    const message =
      error.code === "23503"
        ? "Please first remove products related to this category"
        : error.message;
    return res.status(400).json({ success: false, error: message });
  }
});

export default CategoryRouter;
