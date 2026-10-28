import type { Matrix, ResponsePlayBody } from '~~/types'
import { createAI } from 'agents/models/ai-sdk'
import { generateText, Output } from 'ai'
import type {} from '../types/cloudflare' // For nuxt typecheck
import { env } from 'cloudflare:workers'
import { z } from 'zod'

export default defineEventHandler(async (event): Promise<ResponsePlayBody> => {
  const bodySchema = z.object({
    matrix: z.array(
      z.array(z.boolean().nullable()).length(3),
    ).length(3),
  }).strict()

  const { matrix } = await readValidatedBody(event, bodySchema.parse)

  if (!canPlay(matrix)) {
    return { result: matrix }
  }

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

function canPlay(matrix: Matrix) {
  const winningLines = [
    [0, 1, 2], // Lignes
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // Colonnes
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // Diagonales
    [2, 4, 6],
  ] as const

  const cells = matrix.flat()

  for (const [a, b, c] of winningLines) {
    const value = cells[a]

    if (
      (value === true || value === false)
      && value === cells[b]
      && value === cells[c]
    ) {
      return false
    }
  }

  return true
}
