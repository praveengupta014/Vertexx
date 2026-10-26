// OPTIONAL. Talks to a local Ollama server only when LLM_URL is set. Nothing external is used by default.
export const llmEnabled = () => Boolean(process.env.LLM_URL);

export async function llmAnswer(system, context, question) {
  const res = await fetch(`${process.env.LLM_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.LLM_MODEL || 'llama3.2',
      stream: false,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: `Context:\n${context}\n\nQuestion: ${question}` },
      ],
    }),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error('Local LLM request failed');
  return (await res.json()).message.content.trim();
}
