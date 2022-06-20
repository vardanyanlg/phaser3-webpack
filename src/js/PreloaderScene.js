import Phaser from "phaser"
import MainScene from './MainScene.js'

export default class PreloaderScene extends Phaser.Scene {
    constructor () {
        super({ key: 'Preload' })
    }
    preload () {
        console.log('%cSCENE::PreloaderScene', 'color: #fff; background: #f00;')

        this.load
                .image('bg', './img/logo.png')
                .audio('sound_fx', './audio/sound_fx.mp3')
    }
   update() {
        console.log('%cSCENE::Loaded', 'color: #000; background: #0f0;')
        this.scene.start("Main")
    }
}


