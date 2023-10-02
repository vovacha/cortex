import { open } from '@tauri-apps/api/dialog'
import { readTextFile } from '@tauri-apps/api/fs'

export function classNames(...classes: any): any {
  return classes.filter(Boolean).join(' ')
}

export async function openReadTextFile (): Promise<string | undefined> {
  const selected = await open({
    multiple: false,
    filters: [
      {
        name: 'Text',
        extensions: ['txt']
      }
    ]
  })
  if (Array.isArray(selected)) {
    // Selected multiple files
  } else if (selected === null) {
    // Cancelled the selection
  } else {
    return await readTextFile(selected)
  }
}

export function shuffleArray (array: any[]): any[] {
  let currentIndex = array.length
  let randomIndex
  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }
  return array
}
