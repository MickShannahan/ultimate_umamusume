

export class Cache {
  #cache
  constructor() {
    this.#cache = new Map()
  }

  get(key) {
    const { ttl, data } = this.#cache.get(key) ?? { ttl: Infinity, data: null }
    if (ttl < Date.now()) return null
    return data
  }

  set(key, value) {
    const data = { ttl: Date.now() + (1000 * 60 * 60 * 24), data: value }
    this.#cache.set(key, data)
  }

  clear() {
    this.#cache.clear()
  }
}