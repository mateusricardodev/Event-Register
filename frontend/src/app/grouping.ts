import type { CheckinParticipant } from './api'
import { groupLetter } from './format'

export interface LetterGroup {
  letter: string
  items: CheckinParticipant[]
}

/** Agrupa participantes (já ordenados por nome) pela letra inicial. */
export function groupByLetter(items: CheckinParticipant[]): LetterGroup[] {
  const map = new Map<string, CheckinParticipant[]>()
  for (const p of items) {
    const letter = groupLetter(p.name)
    const arr = map.get(letter)
    if (arr) arr.push(p)
    else map.set(letter, [p])
  }
  return Array.from(map, ([letter, list]) => ({ letter, items: list }))
}
