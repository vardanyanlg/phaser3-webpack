import Phaser from 'phaser'
import PreloaderScene from './js/PreloaderScene.js'
import MainScene from './js/MainScene.js'

const gameConfig = {
    type: Phaser.AUTO,
    parent: 'phaser3-webpack',
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
        mode:  Phaser.Scale.NONE,
        // autoCenter:  Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight
    },
    scene: null
}

const game = new Phaser.Game(gameConfig)

game.scene.add("Preload", PreloaderScene)
game.scene.add("Main", MainScene)

game.scene.start("Preload")

game.events.on('hidden',function() { this.sound.setMute(true) } ,game)
game.events.on('visible',function() { this.sound.setMute(false) },game)
game.events.on('blur',function() { this.sound.setMute(true) },game)
game.events.on('focus',function() { this.sound.setMute(false) },game)
