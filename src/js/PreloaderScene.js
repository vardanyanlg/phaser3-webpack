import Phaser from "phaser";
import MainScene from './MainScene.js';

let loadMain = false;
let countDecodedAudio = 0;
let allAudio = 0;
let countDecodedTexture = 0;
let allTextures = 0;

export default class PreloaderScene extends Phaser.Scene {
    constructor () {
        super({ key: 'Preload' })
    }

    preload () {
        console.log('%cSCENE::PreloaderScene', 'color: #fff; background: #f00;')

        // this.addAudio('sound_fx', sound_fxA);

        // this.addTexture('bg', bgI);

        // this.textures.on('onload', () => countDecodedTexture++, this);
        // this.sound.on('decoded', () => countDecodedAudio++, this);
        // console.log()
        this.load.image('bg', './img/logo.png');
        this.load.audio('sound_fx', './audio/sound_fx.mp3');
    }
    // addAudio(arg1,arg2) {
    //     allAudio++;
    //     this.sound.decodeAudio(arg1, arg2);
    // }
    // addTexture(arg1,arg2) {
    //     allTextures++;
    //     this.textures.addBase64(arg1, arg2);
    // }
    // create() {
    //     loadMain = true
    // }
   update() {
        // if (loadMain && (countDecodedAudio >= allAudio) && (countDecodedTexture >= allTextures)) {
            console.log('%cSCENE::Loaded', 'color: #000; background: #0f0;');
            this.scene.start("Main")
        // }
    }
}


