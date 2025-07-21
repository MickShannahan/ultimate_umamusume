import { logger } from "@/utils/Logger.js"


export class Racer {
  constructor(name, sprite, baseStats = {}, cards = [], startingEffects = []) {
    this.id = name.replace(' ', '-').toLowerCase()
    this.name = name
    this.sprite = sprite
    this.baseStats = {
      speed: baseStats.speed,
      stamina: baseStats.stamina,
      power: baseStats.power,
      aerodynamics: baseStats.aerodynamics || 0
    }
    this.stats = { ...this.baseStats }
    this.staminaLeft = this.baseStats.stamina
    this.staminaBurn = this.baseStats.staminaBurn || .6
    this.startingBoost = baseStats.startingBoost || 0
    this.position = 0
    this.velocity = 0
    this.raceMaxVelocity = 0
    this.inRecovery = false

    this.racePlacement

    this.cards = cards
    this.effects = startingEffects ?? []
  }

  get spriteBg() {
    return `url(${this.sprite})`
  }

  get speedNormal() {
    const capped = Math.max(1, this.stats.speed)
    return (Math.log10(capped) * 10) * .75
  }

  get powerNormal() {
    const capped = Math.max(1, this.stats.power)
    return (Math.log10(capped) * 10)

  }

  get airDrag() {
    return Math.max(1, (this.racePlacement == 1 ? 1.55 : 0) - (this.stats.power * .002) - this.stats.aerodynamics)
  }

  resetStats() {
    this.position = 0
    this.velocity = 0
    this.raceMaxVelocity = 0
    this.stats = { ...this.baseStats }
    this.staminaLeft = this.baseStats.stamina
    logger.log('🏇', this.name, 'stats reset', this.stats)
  }

  applyCard(card) {
    card.effect(this)
  }

  run(deltaT, racePlacement) {
    this.racePlacement = racePlacement
    if (this.inBurst) {
      this.runAtBurst(deltaT)
    } else if (this.inRecovery) {
      this.runAtJog(deltaT)
    } else {
      this.runAtPace(deltaT)
    }
  }

  runAtPace(deltaTime) {
    const gateBoost = this.velocity == 0 ? this.startingBoost ? this.startingBoost : this.powerNormal * .25 : 0
    const randomVariation = (Math.random() * .75) - (Math.random() * .75)
    const maxSpeed = this.speedNormal + randomVariation
    const accelerationFactor = this.powerNormal * .01
    const acceleration = (maxSpeed - (this.velocity * .5)) * (accelerationFactor)
    this.velocity = Math.min(this.velocity + acceleration * deltaTime, maxSpeed) + gateBoost

    const distance = this.velocity * deltaTime
    this.position += distance

    const staminaCost = (this.velocity * this.staminaBurn * this.airDrag) * deltaTime
    this.staminaLeft = Math.max(0, this.staminaLeft - staminaCost)
    this.raceMaxVelocity = Math.max(this.velocity, this.raceMaxVelocity)
    if (this.staminaLeft <= this.stats.stamina * .5) this.enterRecovery()
  }

  runAtJog(deltaTime) {
    const recoverySpeed = Math.max((this.raceMaxVelocity * .5), this.velocity * .98)
    this.velocity = recoverySpeed
    this.position += this.velocity * deltaTime

    const regenRate = 1.5 + (this.powerNormal * .25);
    this.staminaLeft += regenRate * deltaTime

    if (this.staminaLeft >= this.stats.stamina) this.exitRecovery();
  }

  runAtBurst(deltaTime) {
    const burstSpeed = this.speedNormal * 1.3

    const accelerationFactor = this.powerNormal * .05
    const acceleration = (burstSpeed - this.velocity) * (accelerationFactor)
    this.velocity = Math.min(this.velocity + acceleration * deltaTime, burstSpeed);

    const distance = this.velocity * deltaTime
    this.position += distance;

    const staminaCost = burstSpeed * (this.staminaBurn * .75) * this.airDrag
    this.staminaLeft -= staminaCost

    if (this.staminaLeft <= 0) this.exitBurst();
  }

  enterRecovery() {
    if (!this.inRecovery) {
      this.inRecovery = true
      this.inBurst = false
      logger.log(`${this.name} entered recovery.`)
    }
  }

  exitRecovery() {
    this.inRecovery = false
    logger.log(`${this.name} exited recovery.`)
  }

  enterBurst(duration = 2) {
    if (!this.inRecovery && this.staminaLeft > 1 && !this.inBurst) {
      this.inRecovery = false
      this.inBurst = true
      this.burstTimer = duration
      logger.log(`${this.name} entered burst mode!`)
    }
  }

  exitBurst() {
    this.inBurst = false
    logger.log(`${this.name} exited burst mode.`)
  }
}