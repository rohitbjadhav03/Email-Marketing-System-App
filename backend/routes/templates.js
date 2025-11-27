const express = require("express");
const router = express.Router();
const Template = require("../models/Template");
const auth = require("../middleware/authMiddleware");

// create template (admin)
router.post("/", auth("admin"), async (req, res) => {
  try {
    const { name, subject, body } = req.body;
    const tpl = await Template.create({
      name,
      subject,
      body,
      createdBy: req.user.userId,
    });
    res.status(201).json(tpl);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// list templates (admin + marketer)
router.get("/", auth(["admin", "marketer"]), async (req, res) => {
  try {
    const tpls = await Template.find().sort({ createdAt: -1 });
    res.json(tpls);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// update template (admin)
router.put("/:id", auth("admin"), async (req, res) => {
  try {
    const { name, subject, body } = req.body;
    const tpl = await Template.findByIdAndUpdate(
      req.params.id,
      { name, subject, body },
      { new: true }
    );
    if (!tpl) return res.status(404).json({ error: "Template not found" });
    res.json(tpl);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// delete template (admin)
router.delete("/:id", auth("admin"), async (req, res) => {
  try {
    const tpl = await Template.findByIdAndDelete(req.params.id);
    if (!tpl) return res.status(404).json({ error: "Template not found" });
    res.json({ message: "Template deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
