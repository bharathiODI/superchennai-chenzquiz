import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function translateText(text: string) {
  const response =
    await openai.chat.completions.create({
      model: 'gpt-4.1-mini',

      messages: [
        {
          role: 'system',
          content:
            'Translate English to Tamil. Return only Tamil.',
        },
        {
          role: 'user',
          content: text,
        },
      ],
    })

  return response.choices[0]
    ?.message?.content
}