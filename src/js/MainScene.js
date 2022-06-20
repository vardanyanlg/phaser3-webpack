import Phaser from "phaser"

const DEFAULT_WIDTH = 1000
const DEFAULT_HEIGHT = 900
const MAX_WIDTH = 1920
const MIN_WIDTH = 1080
const MAX_HEIGHT = 2000
let SCALE_MODE = 'FIT' // FIT OR SMOOTH
let portrait = false

let bg

export default class MainScene extends Phaser.Scene {
    constructor () {
        super({ key: 'Main' })
    }
    create() {
		console.log('%cSTATE::MainScene', 'color: #fff; background: #f0f;')

        this.resize()

        bg = this.add
                    .image(480, 270,'bg')
                    .setScale(1)
                    .setDepth(0.01)

        this.tweens.add({targets: bg,scaleX: 1.1,scaleY:1.1,duration: 500,ease: 'Quad.InOut',delay: 0,yoyo:true,repeat:-1 })

        // this.music =  this.sound
        //                         .add('sound_fx')
                                // .play()


        window.addEventListener('resize', event => { this.resize(); this.updateObjects(); })
    }
    resize() {
        const w = window.innerWidth
        const h = window.innerHeight
    
        let width = DEFAULT_WIDTH
        let height = DEFAULT_HEIGHT
        let maxWidth = MAX_WIDTH
        let maxHeight = MAX_HEIGHT
        let scaleMode = SCALE_MODE
    
        let scale = Math.min(w / width, h / height)
        let newWidth = Math.min(w / scale, maxWidth)
        let newHeight = Math.min(h / scale, maxHeight)
    
        let defaultRatio = DEFAULT_WIDTH / DEFAULT_HEIGHT
        let maxRatioWidth = maxWidth / DEFAULT_HEIGHT
        let maxRatioHeight = DEFAULT_WIDTH / MAX_HEIGHT
    
        // smooth scaling
        let smooth = 1
        if (scaleMode === 'SMOOTH') {
          const maxSmoothScale = 1.15
          const normalize = (value, min, max) => {
            return (value - min) / (max - min)
          }
          if (width / height < w / h) {
            smooth =
              -normalize(newWidth / newHeight, defaultRatio, maxRatioWidth) / (1 / (maxSmoothScale - 1)) + maxSmoothScale
          } else {
            smooth =
              -normalize(newWidth / newHeight, defaultRatio, maxRatioHeight) / (1 / (maxSmoothScale - 1)) + maxSmoothScale
          }
        }
    
        // resize the game
        this.game.scale.resize(newWidth * smooth, newHeight * smooth)
    
        // scale the width and height of the css
        this.game.canvas.style.width = newWidth * scale + 'px'
        this.game.canvas.style.height = newHeight * scale + 'px'
    
        // center the game with css margin
        this. game.canvas.style.marginTop = `${(h - newHeight * scale) / 2}px`
        this.game.canvas.style.marginLeft = `${(w - newWidth * scale) / 2}px`

        this.game.sizeW = newWidth
        this.game.sizeH = newHeight
        // console.log(newWidth,newHeight)
        // console.log(this.game.sizeW,this.game.sizeH)

        if(this.game.sizeH > this.game.sizeW) portrait = true 
        else portrait = false

    //   if(portrait)  {
    //       // this.scale.lockOrientation('landscape')
    //       scale_modify = this.game.sizeH/2100
    //       // console.log('portrait scale modify',scale_modify)
    //   } else {
    //       scale_modify = Phaser.Math.Clamp(this.game.sizeW/1920,0.4,0.8)
    //       // if(this.game.sizeW/1920)
    //       // console.log('landscape scale modify',scale_modify)
    //   }
      // console.log('portrait',portrait)
      // console.log('scale_modify',scale_modify)
      this.cameras.resize(this.game.sizeW, this.game.sizeH)
      this.center = new Phaser.Geom.Point(this.cameras.main.centerX, this.cameras.main.centerY)

      // this.updateObjects()
    }
    updateObjects() {
        
    }
    update() {

    }
}