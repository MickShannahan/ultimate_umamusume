export class Sprite {
  constructor({ spritePath, frameCount = 0, fps = 24, height = 0, width = 0, startingFrame = 0 }) {
    this.sprite = spritePath
    this.frameCount = frameCount
    this.fps = fps
    this.height = height
    this.width = width
    this.startingFrame = startingFrame
  }
}