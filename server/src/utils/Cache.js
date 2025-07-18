import fs from 'fs'
import path from 'path'

export class Cache {
  #cache
  #filePath
  constructor(filePath = './cache.json') {
    this.#cache = new Map()
    this.#filePath = path.resolve(filePath)
    this.#loadFromDisk()
  }

  get(key) {
    const entry = this.#cache.get(key)
    if (!entry) return null

    const { ttl, data } = entry
    if (ttl < Date.now()) {
      this.#cache.delete(key)
      this.#saveToDisk()
      return null
    }

    return data
  }

  set(key, value) {
    const entry = {
      ttl: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
      data: value
    }
    this.#cache.set(key, entry)
    this.#saveToDisk()
  }

  clear() {
    this.#cache.clear()
    this.#saveToDisk()
  }

  #saveToDisk() {
    const json = JSON.stringify(Object.fromEntries(this.#cache), null, 2)
    fs.writeFileSync(this.#filePath, json, 'utf-8')
  }

  #loadFromDisk() {
    if (!fs.existsSync(this.#filePath)) return

    try {
      const raw = fs.readFileSync(this.#filePath, 'utf-8')
      const parsed = JSON.parse(raw)

      const now = Date.now()
      for (const [key, value] of Object.entries(parsed)) {
        if (value.ttl > now) {
          this.#cache.set(key, value)
        }
      }
    } catch (err) {
      console.error('Failed to load cache:', err)
    }
  }
}