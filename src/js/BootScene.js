import Phaser from "phaser"

export default class BootScene extends Phaser.Scene {
    constructor () {
        super({ key: 'Boot' })
    }
    preload () {
        console.log('%cSCENE::BootScene', 'color: #fff; background: #f00;')
        
        this.load.image('loader', './img/loader.png')
    }
   update() {
        console.log('%cSCENE::Boot Loaded', 'color: #000; background: #0f0;')
        this.scene.start("Preload")
    }
}


