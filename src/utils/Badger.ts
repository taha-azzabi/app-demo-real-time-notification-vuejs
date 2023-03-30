interface BadgerOptions {
  counter: number
  color: string
}

class Badger {
  private faviconEL: HTMLLinkElement
  private src: string
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private faviconSize: number

  constructor(private options: BadgerOptions) {
    this.faviconSize = 0;
    this.faviconEL = document.querySelector("link[rel$='icon']") as HTMLLinkElement
    this.src = this.faviconEL.getAttribute('href') || ''
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
    this.setCanvasSize()
  }

  private _drawIcon(img: HTMLImageElement): void {
    this.ctx.clearRect(0, 0, this.faviconSize, this.faviconSize)
    this.ctx.drawImage(img, 0, 0, this.faviconSize, this.faviconSize)
  }

  updateFavicon(): void {
    this.faviconEL.setAttribute('href', this.canvas.toDataURL())
  }

  private _drawBadge(): void {
    const badgeRadius = this.faviconSize * 0.45
    const badgeX = this.faviconSize - badgeRadius
    const badgeY = this.faviconSize - badgeRadius

    this.ctx.beginPath()
    this.ctx.arc(badgeX, badgeY, badgeRadius, 0, 2 * Math.PI)
    this.ctx.fillStyle = this.options.color
    this.ctx.fill()
    this.ctx.closePath()
  }

  private _drawNumber(): void {
    const fontSize = this.faviconSize * 0.55
    const badgeRadius = this.faviconSize * 0.45
    const textX = this.faviconSize - badgeRadius
    const textY = this.faviconSize - badgeRadius * 0.9

    this.ctx.beginPath()
    this.ctx.font = `${fontSize}px Arial`
    this.ctx.fillStyle = '#fff' // White color
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'
    this.ctx.fillText(String(this.options.counter), textX, textY)
    this.ctx.closePath()
  }

  async setCanvasSize(): Promise<void> {
    if (this.options.counter > 0) {
      const img = new Image()
      img.src = this.src
      await new Promise((resolve) => {
        img.onload = () => {
          this.faviconSize = img.naturalWidth
          this.canvas.width = this.faviconSize
          this.canvas.height = this.faviconSize
          this._drawIcon(img)
          resolve(null)
        }
      })

      this._drawBadge()
      this._drawNumber()
      this.updateFavicon()
    }
  }

  getFaviconSrc(): string {
    return this.src
  }

  set counter(newValue: number) {
    this.options.counter = newValue
    this.setCanvasSize()
  }
}

export default Badger
