<script lang="ts" setup>
import type { ResponsePlayBody } from '~~/types'

const pendingReq = ref(false)

// Initialiser une matrice 3x3 avec des valeurs nulles
const matrix = useState('matrix', (): Array<Array<true | false | null>> => {
  return [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]
})

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

const gameStatus = computed(() => {
  const cells = matrix.value.flat()

  for (const [a, b, c] of winningLines) {
    const value = cells[a]

    if (
      (value === true || value === false)
      && value === cells[b]
      && value === cells[c]
    ) {
      return value === true ? 'won' : 'lost'
    }
  }

  return cells.includes(null) ? 'playing' : 'draw'
})

const gameEnded = computed(() => {
  return pendingReq.value || gameStatus.value === 'won' || gameStatus.value === 'lost'
})

// Gestion du clic sur une cellule
const onCellClick = async (rowIndex: number, cellIndex: number) => {
  if (gameEnded.value) {
    return
  }

  const row = matrix.value[rowIndex]

  if (row && row[cellIndex] === null) {
    row[cellIndex] = true
  }

  pendingReq.value = true

  const data = await $fetch<ResponsePlayBody>('/api/play', {
    method: 'POST',
    body: {
      matrix: matrix.value,
    },
  })
  pendingReq.value = false
  console.log(data)
  matrix.value = data['result']
}

// TODO Quand on à perdu -> t'as derpu -> animation remise en place des lettres en mode powerpoint de 5eme en techno
</script>

<template>
  <div>
    <div class="grid">
      <div
        v-for="(row, rowIndex) in matrix"
        :key="`row-${rowIndex}`"
        class="row"
      >
        <div
          v-for="(cell, cellIndex) in row"
          :key="`cell-${rowIndex}-${cellIndex}`"
          :class="`cell ${cell === null && !gameEnded ? 'free' : 'not_really_free'}`"
          @click="onCellClick(rowIndex, cellIndex)"
        >
          <div v-if="cell == true">
            <div class="circle_parent">
              <div class="circle_child" />
            </div>
          </div>
          <div v-else-if="cell == false" class="cross_container">
            <div class="cross_first" />
            <div class="cross_last" />
          </div>
        </div>
      </div>
    </div>
    <div>{{ gameStatus }}</div>
    <div v-if="pendingReq">
      En attente de la stupidité artificielle...
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: flex;
  flex-direction: column;
  gap: 5px; /* Espacement entre les lignes */
}

.row {
  display: flex;
  gap: 5px; /* Espacement entre les colonnes */
}

.cell {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #000;
  background-color: #f0f0f0;
  cursor: pointer;
  user-select: none;
}

.free:hover {
  background-color: #e0e0e0;
}

.not_really_free {
  cursor: not-allowed;
}

.circle_parent {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: cornflowerblue;
  display: flex;
  justify-content: center;
  align-items: center;
}

.circle_parent .circle_child {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #f0f0f0;
}

.cross_container {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cross_container .cross_first {
  position: absolute;
  width: 70px;
  height: 10px;
  transform: rotate(45deg);
  background-color: indianred;
}
.cross_container .cross_last {
  position: absolute;
  width: 70px;
  height: 10px;
  transform: rotate(-45deg);
  background-color: indianred;
}
</style>
