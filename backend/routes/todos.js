import { Router } from "express";
import pool from "../db.js";

const router = Router();

const QUERY_INSERT = "insert into todo (description, completed) values($1, $2) returning *";
const QUERY_GET = "select * from todo";
const QUERY_UPDATE = "update todo set description = $1, completed = $2 where todo_id = $3 returning *";
const QUERY_DELETE = "delete from todo where todo_id =  $1 returning *";

// Create a new todo
router.post("/", async (req, res) => {
   try {
      const {description, completed} = req.body;
      if(!description) {
         return res.status(400).json({ error: "Description is required." });
      }
      const newTodo = await pool.query(
         QUERY_INSERT,
         [description, completed || false]
      );
      res.json({
         message: "Todo created!",
         todo: newTodo.rows[0]
      });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }
});

// Get all todos
router.get("/", async (req, res) => {
   try {
      const allTodos = await pool.query(
         QUERY_GET
      );
      res.json(allTodos.rows);
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }
})

// Update a todo
router.put("/:id", async (req, res) => {
   try {
      const { id } = req.params;
      const { description, completed } = req.body;
      if (!description) {
         return res.status(400).json({ error: "Description is required." });
      }
      const updatedTodos = await pool.query(
         QUERY_UPDATE,
         [description, completed || false, id]
      );
      if (updatedTodos.rows.length === 0) {
         return res.status(404).json({ error: "Todo not found" });
      }
      // res.json(updatedTodo.rows[0]);
      res.json({
         message: "Todo was updated!",
         todo: updatedTodos.rows[0]
      })
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }
})

// Delete a todo
router.delete("/:id", async (req, res) => {
   try {
      const { id } = req.params;
      const deletedTodos = await pool.query(QUERY_DELETE, [id]);
      if (deletedTodos.rows.length === 0) {
         return res.status(404).json({ error: "Todo not found." });
      }
      res.json({
         message: "Todo was deleted!",
         todo: deletedTodos.rows[0]
      });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }
});

export default router;