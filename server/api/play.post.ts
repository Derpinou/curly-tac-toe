import type { PlayBody, ResponsePlayBody } from '~~/types'
import { createAI } from 'agents/models/ai-sdk'
import { generateText, Output } from 'ai'
import { env } from 'cloudflare:workers'
import { z } from 'zod'

export default defineEventHandler(async (event): Promise<ResponsePlayBody> => {
  const body: PlayBody = await readBody(event).then(x => x)
  const { matrix } = body
  const input = `
You are a player of tic-tac-toe.
The current game state is represented by a 3x3 matrix:

Game state:
${JSON.stringify(matrix)}

Rules:

1. Each array in the matrix represents a row.
2. You cannot remove, move, replace, or edit any existing true or false value.
3. You MUST play: replace exactly one null value with false to maximize your chances of winning.
4. Returning the input matrix unchanged is strictly forbidden.
5. The output matrix must differ from the input matrix in exactly one cell: null becomes false. Every other cell must remain unchanged.
6. Output only the updated game state as a JSON object with this structure:
   {"result": [[null, null, null], [null, null, null], [null, null, null]]}
7. Do not include any text, Markdown, code fences, commentary, or explanation.

Before responding, verify that you changed exactly one null to false.
Now return only the JSON result.
`
  const ai = createAI({ binding: env.AI })

  const { text: response } = await generateText({
    model: ai('@cf/meta/llama-3.3-70b-instruct-fp8-fast'),
    prompt: input,
    temperature: 0,
    maxOutputTokens: 128,

    output: Output.object({
      schema: z.object({
        result: z.array(
          z.array(z.boolean().nullable()).length(3),
        ).length(3),
      }).strict(),
    }),
  })

  return JSON.parse(response)
})
