const { HfInference } = require("@huggingface/inference");

// Khởi tạo client với token của bạn
const client = new HfInference("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");

const sendMessage = async (req, res) => {
  try {
    let out = "";
    const stream = await client.chatCompletionStream({
      model: "HuggingFaceH4/zephyr-7b-alpha",
      messages: req.body.messages,
      temperature: 0.5,
      max_tokens: 2048,
      top_p: 0.7,
    });

    for await (const chunk of stream) {
      if (chunk.choices && chunk.choices.length > 0) {
        const newContent = chunk.choices[0]?.delta?.content || "";
        out += newContent;
      }
    }
    res.status(200).json({ response: out });
  } catch (error) {
    console.error("Lỗi:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  sendMessage,
};
