const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// GET all rules
router.get("/", (req, res) => {
    const sql = "SELECT * FROM rules";

    db.query(sql, (err, results) => {
        if(err){
            return res.status(500).json({error: err.message});
        }
        res.json(results);
    });
});

//POST new rule
router.post("/", (req, res) => {
    const { keyword, match_type, action_type, color, tag } = req.body;

    const sql = `INSERT INTO rules (keyword, match_type, action_type, color, tag)
    VALUES (?, ?, ?, ?, ?)`;

    db.query(
        sql,
        [keyword, match_type, action_type, color, tag],
        (err, result) => {
            if(err){
                return res.status(500).json({error: err.message});
            }

        res.json({ message: "Rule created successfully", id: result.insertId });
        }
    )
});

//Delete rule by id
router.delete("/:id", (req, res) => {
    const sql = "DELETE FROM rules WHERE id = ?";

    db.query(sql, [req.params.id], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Rule deleted successfully" });
    });
});

//PUT - update rule by id
router.put("/:id", (req, res) => {
    const { keyword, match_type, action_type, color, tag } = req.body;

    const sql = `UPDATE rules
    SET keyword = ?, match_type = ?, action_type = ?, color = ?, tag = ?
    WHERE id = ?`;

    db.query(
        sql,
        [keyword, match_type, action_type, color, tag, req.params.id],
        (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: "Rule updated successfully" });
        }
    );
});

module.exports = router;