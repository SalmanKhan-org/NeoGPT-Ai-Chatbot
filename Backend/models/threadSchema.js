const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const threadSchema = new Schema({
  threadId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    default: "New Chat",
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref:"User"
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// This must be AFTER you define the schema
threadSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const Message = mongoose.model("Message");
    await Message.deleteMany({ _id: { $in: doc.messages } });
  }
});

const Thread = mongoose.model("Thread", threadSchema);

module.exports = Thread;
