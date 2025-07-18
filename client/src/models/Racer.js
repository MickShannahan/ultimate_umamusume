import { logger } from "@/utils/Logger.js"


export class Racer {
  constructor(name, sprite, baseStats = {}, cards = [], startingEffects = []) {
    this.id = name.replace(' ', '-').toLowerCase()
    this.name = name
    this.sprite = sprite
    this.baseStats = {
      speed: baseStats.speed,
      stamina: baseStats.stamina,
      power: baseStats.power
    }
    this.stats = { ...this.baseStats }
    this.staminaLeft = this.baseStats.stamina
    this.startingBoost = baseStats.startingBoost || 0
    this.position = 0
    this.velocity = 0
    this.inRecovery = false

    this.cards = cards
    this.effects = startingEffects ?? []
  }

  resetStats() {
    this.position = 0
    this.velocity = 0
    this.stats = { ...this.baseStats }
    this.staminaLeft = this.baseStats.stamina
    logger.log('🏇', this.name, 'stats reset', this.stats)
  }

  applyCard(card) {
    card.effect(this)
  }

  run(deltaT) {
    const gateBoost = this.velocity == 0 ? this.startingBoost ? this.startingBoost : this.powerNormal * .5 : 0
    if (this.staminaLeft > 0) {
      const acceleration = (this.powerNormal) * deltaT
      const randomVariation = (Math.random() * 2.2) - (Math.random() * 1.5)
      this.velocity = Math.min(this.velocity + acceleration, this.speedNormal) + randomVariation + gateBoost
      const distance = this.velocity * deltaT
      this.position += distance

      const staminaCost = this.velocity * 0.075
      this.staminaLeft = Math.max(0, this.staminaLeft - staminaCost)
    }
  }

  get speedNormal() {
    const capped = Math.max(1, this.stats.speed)
    return (Math.log10(capped) * 10) * .5
  }

  get powerNormal() {
    const capped = Math.max(1, this.stats.power)
    return Math.log10(capped) * 3
  }
}