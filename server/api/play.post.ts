import type { PlayBody, ResponsePlayBody } from '~~/types'
import { createAI } from 'agents/models/ai-sdk'
import { generateText } from 'ai'
import { env } from 'cloudflare:workers'

export default defineEventHandler(async (event): Promise<ResponsePlayBody> => {
  const body: PlayBody = await readBody(event).then(x => x)
  const { matrix } = body
  const input = `
You are a player of tic-tac-toe.
The current game state is represented by a 3x3 matrix:
Game state:
${JSON.stringify(matrix)}

Rules:
1. Arrays on matrix represents a row
2. You can't remove / move / replace / edit a \`true\` or \`false\` value
3. Replace once \`null\` value with \`false\` to maximize your chances of winning at tic-tac-toe.
4. Output only the updated game state as a JSON object.
5. Strict format: \`{"result": [[null, null, null], [null, null, null], [null, null, null]]}\`
6. Do not include any text, commentary, or explanation.

Now return the result.
`
  const ai = createAI({ binding: env.AI })

  const { text: response } = await generateText({
    model: ai('@cf/meta/llama-3.3-70b-instruct-fp8-fast'),
    prompt: input,
    temperature: 0,
  })
  console.log(response)

  return JSON.parse(response)
})
