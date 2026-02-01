export async function handler(event, context) {
  try {
    const { prompt } = JSON.parse(event.body);

    const response = await fetch("https://openrouter.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer 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`
      },
      body: JSON.stringify({
        model: "google/gemma-3-27b-it:free",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch OpenRouter" })
    };
  }
}
