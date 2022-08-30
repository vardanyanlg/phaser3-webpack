import Phaser from 'phaser'
import BootScene from './js/BootScene.js'
import PreloaderScene from './js/PreloaderScene.js'
import MainScene from './js/MainScene.js'
import WebFontLoaderPlugin from 'phaser3-rex-plugins/plugins/webfontloader-plugin.js'
import BBCodeTextPlugin from 'phaser3-rex-plugins/plugins/bbcodetext-plugin.js'

const gameConfig = {
    type: Phaser.AUTO,
    parent: 'phaser3-webpack',
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
        mode:  Phaser.Scale.NONE,
        width: window.innerWidth,
        height: window.innerHeight
    },
    plugins: {
        global: [
            {
                key: 'rexWebFontLoader',
                plugin: WebFontLoaderPlugin,
                start: true
            },            
            {
                key: 'rexBBCodeTextPlugin',
                plugin: BBCodeTextPlugin,
                start: true
            }
        ]
    },
    scene: null
}

const game = new Phaser.Game(gameConfig)

game.scene.add("Boot", BootScene)
game.scene.add("Preload", PreloaderScene)
game.scene.add("Main", MainScene)

game.scene.start("Boot")

game.events.on('hidden',function() { this.sound.setMute(true) } ,game)
game.events.on('visible',function() { this.sound.setMute(false) },game)
game.events.on('blur',function() { this.sound.setMute(true) },game)
game.events.on('focus',function() { this.sound.setMute(false) },game)
