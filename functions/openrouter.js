export async function handler(event) {
  console.log("FUNCTION HIT");

  if (!process.env.OPENROUTER_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "NO API KEY" })
    };
  }

  const body = JSON.parse(event.body || "{}");

  const response = await fetch("https://openrouter.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const text = await response.text();

  return {
    statusCode: 200,
    body: text
  };
}
