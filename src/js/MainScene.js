import Phaser from "phaser"
import GUI from "./GUI.js"
import MissionMap from "./MissionMap.js"
import Rover from "./Rover.js"

const DEFAULT_WIDTH = 960
const DEFAULT_HEIGHT = 800
const MAX_WIDTH = 1920
const MAX_HEIGHT = 2400
let portrait = false
let zoomNow = true
const tileSize = 160
const map_size = {width:3360,height:2400}
let zOut = 0.3, zIn = 1

let bg,rover,map,gui

export default class MainScene extends Phaser.Scene {
    constructor () {
        super({ key: 'Main' })
    }
    create() {
        console.log('%cSTATE::MainScene', 'color: #fff; background: #f0f;')
        this.tileSize = tileSize

        this.zIn = 1
        this.zOut = 0.3
        this.cam2 = this.cameras.add().setName('Camera 2')

        this.resize()
        this.start()

        window.addEventListener('resize', event => { this.resize(); this.updateObjects(); })
    }
    start() {
      this.time_left = 1200
      this.map = map = new MissionMap(this)

      const startPoint = Phaser.Math.Between(1,4)
      map.addExits(startPoint)
      switch(startPoint) {
        case 1: this.rover = rover = new Rover(this,2,2,'right'); break;
        case 2: this.rover = rover = new Rover(this,17,3,'left'); break;
        case 3: this.rover = rover = new Rover(this,2,13,'right'); break;
        case 4: this.rover = rover = new Rover(this,17,13,'left'); break;
      }
      map.addWorms()
      map.addFogs(startPoint)

      this.gui = gui = new GUI(this)

      rover.checkActions()

      gui.showWindow('start')
      // gui.showWindow('passed')
      // gui.showWindow('game over fuel')
      // gui.showWindow('game over time')
      // gui.showWindow('game over worm')
      // gui.showWindow('worm')
    }
    isWindowShow() {
      if(gui != null) return gui.isWindowShow()
      else return false
    }
    restart() {
      console.log('restart')
      this.gui.delete()

      this.map.deleteAll()
      this.rover.deleteAll()
      this.gui.destroy()

      this.map = map = null
      this.rover = rover = null
      this.gui = gui = null

      this.start()

    }
    resize() {
        const w = window.innerWidth
        const h = window.innerHeight
    
        let width = DEFAULT_WIDTH
        let height = DEFAULT_HEIGHT
        let maxWidth = MAX_WIDTH
        let maxHeight = MAX_HEIGHT
    
        let scale = Math.min(w / width, h / height)
        let newWidth = Math.min(w / scale, maxWidth)
        let newHeight = Math.min(h / scale, maxHeight)

        this.game.scale.resize(newWidth, newHeight)
    
        this.game.canvas.style.width = newWidth * scale + 'px'
        this.game.canvas.style.height = newHeight * scale + 'px'
    
        this.game.canvas.style.marginTop = `${(h - newHeight * scale) / 2}px`
        this.game.canvas.style.marginLeft = `${(w - newWidth * scale) / 2}px`

        this.game.sizeW = newWidth
        this.game.sizeH = newHeight

        if(this.game.sizeH > this.game.sizeW) portrait = true 
        else portrait = false

      this.cameras.resize(this.game.sizeW, this.game.sizeH)

      this.scale.setParentSize(this.game.sizeW, this.game.sizeH)

      this.cameras.main.setBounds(0, 0, map_size.width, map_size.height)
      this.center = new Phaser.Geom.Point(this.cameras.main.centerX, this.cameras.main.centerY)

      let zcalc = this.game.sizeW/map_size.width
      let zcalc2 = this.game.sizeH/map_size.height
      this.zOut = zcalc < zcalc2 ? zcalc : zcalc2
      portrait ? this.zIn = 1.3 : this.zIn = 1

      this.updateObjects()
    }
    isZoomNow() {
      if(gui != null) return gui.zoomNow
      else return null
    }
    updateObjects() {
      if(gui != null) gui.updatePos()
    }
    update() {

    }
}