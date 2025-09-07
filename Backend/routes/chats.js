const express = require("express");
const Thread = require("../models/threadSchema.js");
const { sendError, sendSuccess } = require("../utils/response.js");
const { getOpenAIAPIResponse } = require("../utils/openai.js");
const Message = require("../models/messageSchema.js");
const { authenticateUser } = require("../middlewares/authToken.js");
const pdfParse = require("pdf-parse");
const multer = require("multer");

const router = express.Router();



// Multer config (in-memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

//Get all threads
router.get("/threads", authenticateUser, async (req, res) => {
  try {
    const userId = req.user._id;
    const threads = await Thread.find({ userId }).sort({ updatedAt: -1 });

    if (threads.length == 0) {
      return sendError(res, 404, "No Threads are Present");
    }

    return sendSuccess(res, 200, "All Threads", threads);
  } catch (error) {
    return sendError(res, 404, error.message);
  }
});

// Get a single thread
router.get("/thread/:threadId", authenticateUser, async (req, res) => {
  const { threadId } = req.params;
  const userId = req.user._id;
  try {
    const thread = await Thread.findOne({ threadId: threadId, userId })
      .populate("messages")
      .exec();

    if (!thread) {
      return sendError(res, 404, "Thread not found");
    }

    return sendSuccess(res, 200, "Thread found Successfully", thread);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
});

// Delete the thread
router.delete("/thread/:threadId", authenticateUser, async (req, res) => {
  const { threadId } = req.params;
  const userId = req.user._id;
  try {
    const thread = await Thread.findOneAndDelete({ threadId, userId });

    if (!thread) {
      return sendError(res, 404, "Thread not found");
    }

    return sendSuccess(res, 200, "Thread Deleted Successfully");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
});

router.post(
  "/chat",
  authenticateUser,
  upload.single("file"),
  async (req, res) => {
    const { threadId, message } = req.body;
    const userId = req.user._id;

    if (!threadId || !message) {
      return sendError(
        res,
        400,
        "Missing required information (threadId or message)"
      );
    }

    if (!threadId || threadId.trim() === "") {
      return sendError(res, 400, "Invalid threadId provided");
    }

    try {
      let thread = await Thread.findOne({ threadId: threadId, userId });
      let isNewThread = false;

      if (!thread) {
        isNewThread = true;
        thread = new Thread({
          threadId,
          title: message,
          userId,
        });
      }

      // Parse PDF if file exists
      let combinedContent = message;
      if (req.file) {
        // req.file.buffer contains the PDF file in memory
        const pdfData = await pdfParse(req.file.buffer);
        const pdfText = pdfData.text || "";

        // Combine PDF text + prompt for AI input
        combinedContent = pdfText + "\n\nUser Prompt:\n" + message;
      }

      // 1️⃣ Save only user prompt, NOT combined content
      const userMessage = await Message.create({
        role: "user",
        content: message, // only user prompt
      });
      thread.messages.push(userMessage._id);

      // 2️⃣ Send combined content to OpenAI
      const response = await getOpenAIAPIResponse(combinedContent);

      // 3️⃣ Save assistant response
      const assistantMessage = await Message.create({
        role: response.role,
        content: response.content,
      });
      thread.messages.push(assistantMessage._id);

      thread.updatedAt = new Date();
      await thread.save();

      if (isNewThread) {
        sendSuccess(res, 200, "New Chat Created", response.content);
      } else {
        sendSuccess(res, 200, "Message Added", response.content);
      }
    } catch (error) {
      sendError(res, 500, error.message || "Internal Server Error");
    }
  }
);


// free Chats


router.post("/free-chat", upload.single("file"), async (req, res) => {
  try {

    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return sendError(res, 400, "Prompt is required");
    }

    let fullPrompt = prompt.trim();

    // If a PDF file is attached, parse it
    if (req.file) {
      const parsedPdf = await pdfParse(req.file.buffer);
      fullPrompt = `${parsedPdf.text.trim()}\n\n${fullPrompt}`;
    }


    const reply = await getOpenAIAPIResponse(fullPrompt);

    const assistantMessage = {
      role: reply.role,
      content: reply.content,
    };

    sendSuccess(res, 200, "Assistant Replied", assistantMessage);
  } catch (error) {
    sendError(res, 500, error.message);
  }
});

module.exports = router;
