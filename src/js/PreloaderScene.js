import Phaser from "phaser"

export default class PreloaderScene extends Phaser.Scene {
    constructor () {
        super({ key: 'Preload' })
    }
    preload () {
        console.log('%cSCENE::PreloaderScene', 'color: #fff; background: #f00;')
        
        this.ldr = this.add.image(window.innerWidth/2, window.innerHeight/2,'loader').setOrigin(0.5).setScale(0.7)
        this.tweens.add({targets: this.ldr,angle:360,duration: 1000,ease: 'Linear', repeat:-1 })
        window.addEventListener('resize', this.resize() )

        this.load.path = './img/'
        this.load
                .image('bg', 'bg.jpg')
                .multiatlas('rover', 'rover'+Phaser.Math.Between(1,4)+'.json')
                .multiatlas('objects', 'objects.json')
                .multiatlas('worm', 'worm.json')
                .multiatlas('gui', 'gui.json')
                .multiatlas('nocompress', 'nocompress.json')
                .tilemapTiledJSON('map', 'level1.json')

        this.load.path = './font/'
        // this.load
        //         .bitmapFont('calibri', 'calibri_0.png','calibri.xml');

        this.load.rexWebFont({
            custom: {
                families: ['Helvetica','Play'],
                urls: ['font/stylesheet.css']
            }
        });
    }
    resize() {
        this.ldr.setPosition(window.innerWidth/2, window.innerHeight/2)
    }
   update() {
        console.log('%cSCENE::Loaded', 'color: #000; background: #0f0;')
        window.removeEventListener('resize', this.resize())
        this.scene.start("Main")
    }
}


