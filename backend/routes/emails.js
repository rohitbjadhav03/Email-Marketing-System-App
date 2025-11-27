const express = require("express");
const router = express.Router();
const sgMail = require("@sendgrid/mail");
const auth = require("../middleware/authMiddleware");
const Template = require("../models/Template");
const EmailLog = require("../models/EmailLog");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function fillTemplate(str, vars) {
  return str.replace(/{{\s*([^}]+)\s*}}/g, (_, k) => vars[k] || "");
}

// Send email (marketer)
router.post("/send", auth("marketer"), async (req, res) => {
  try {
    console.log("SEND body:", req.body);
    const { templateId, toEmail, variables } = req.body;

    const template = await Template.findById(templateId);
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    const subject = fillTemplate(template.subject, variables);
    const html = fillTemplate(template.body, variables);

    const msg = {
      to: toEmail,
      from: "rohitjadhav9203@gmail.com", // must match verified sender
      subject,
      html,
    };

    const response = await sgMail.send(msg);

    await new EmailLog({
      template: templateId,
      sentBy: req.user.userId,
      toEmail,
      variables,
      success: true,
      response,
    }).save();

    res.json({ message: "Email sent" });
  } catch (error) {
    console.error("SEND error code:", error.code);
    console.error("SEND error body:", error.response?.body);

    await new EmailLog({
      template: req.body.templateId,
      sentBy: req.user.userId,
      toEmail: req.body.toEmail,
      variables: req.body.variables,
      success: false,
      response: error.response?.body || error.message,
    }).save();

    res.status(500).json({ error: error.message });
  }
});

// Logs (admin/marketer)
router.get("/logs", auth(["admin", "marketer"]), async (req, res) => {
  try {
    let logs;
    if (req.user.role === "admin") {
      logs = await EmailLog.find().populate("template sentBy");
    } else {
      logs = await EmailLog.find({ sentBy: req.user.userId }).populate(
        "template sentBy"
      );
    }
    res.json(logs);
  } catch (err) {
    console.error("LOGS error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
