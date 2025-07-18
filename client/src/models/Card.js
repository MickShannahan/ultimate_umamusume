

export class GameCard {
  constructor({ name, description, effect, type, sprite, rarity }) {
    this.name = name
    this.description = description
    this.effect = effect
    this.sprite = sprite
    this.type = type || 'upgrade'
    this.rarity = rarity || 'common'
  }
}