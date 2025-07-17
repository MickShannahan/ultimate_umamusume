

export class Racer {
  constructor(data) {
    this.id = data.name.replace(' ', '-').toLowerCase()
    this.name = data.name
    this.sprite = data.sprite
    this.staticSprite = data.staticSprite
    this.stats = {
      speed: data.stats.speed,
      stamina: data.stats.stamina,
      power: data.stats.power
    }
  }
}