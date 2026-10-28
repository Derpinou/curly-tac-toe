import type { PlayBody } from '~~/types'

export default defineEventHandler(async (event): Promise<any> => {
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
  // 1. You have to play even if you've lost
  // 4. You can't edit cell for `true` or `null` value

  /* `
Context:
You are a player of tic-tac-toe.
The current game state is represented by a 3x3 matrix:
\`${JSON.stringify(matrix)}\`.
- \`null\` indicates free cells where you can play.
- \`true\` indicates cells occupied by the opponent.
- \`false\` indicates cells occupied by you.

Task:
Play tic-tac-toe to maximize your chances of winning. Replace one \`null\` value with \`false\`.

Output format:
Return only the updated game state as a JSON object with the key \`result\`, formatted like this:
\`{"result": [[null, null, null], [null, null, null], [null, null, null]]}\`.
`
*/
  // Do not include any other text, explanation, or commentary.
  // Return me only output result without explains/commentary a JSON array formatted like the game state

  // console.log(input);

  /*
  const { response } = await hubAI().run('@cf/meta/llama-3.1-8b-instruct', {
    prompt: input,
  })



  let res
  try {
    /// .replaceAll(/[^a-zA-Z0-9\[\]",]'/, '')
    res = JSON.parse(response.replaceAll('`', '').replaceAll('json', '').replaceAll('\n', '').replaceAll('\'', ''))
    console.log(res)
  }
  catch (e) {
    console.log('erreur parse', e)
    console.log(response)
    res = { result: matrix }
  }
  return res

   */

  return { result: matrix };
})
