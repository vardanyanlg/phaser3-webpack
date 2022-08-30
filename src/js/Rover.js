import Phaser from "phaser"

let current_anim = 'idle left'
let move = ''
let tileX = 0
let tileY = 0
let lastTX = 2
let lastTY = 2
let work = false
let touch_array = []


export default class Rover extends Phaser.GameObjects.Sprite {
    constructor (scene,tx,ty,side) {
        super(scene,0,0,'rover')
        touch_array = []
        current_anim = 'idle '+side
        tileX = tx
        tileY = ty
        this.rover = this
        this.dynamite = 1
        this.collected_common = 0
        this.collected_rare = 0
        this.collected_legendary = 0
        this.ct_moves = 120

        scene.add.existing(this)

        this.createAnim(scene)

        this
            .setScale(0.8)
            .play(current_anim)
            .setPosition(this.getPosX(),this.getPosY())

        scene.cam2.ignore(this)
        scene.cameras.main.startFollow(this, true, 0.08, 0.08)

        for (let i = 0; i < 5; i++) {
            const newgreen = scene.add.sprite(this.x,this.y,'objects','green')
                .setAlpha(0.5)
                .setVisible(false)
                .setDepth(0.18)
                .setInteractive()
            if(i === 0) newgreen.setAlpha(0.01)
            newgreen.rover = this
            newgreen.scene = this.scene
            newgreen.id = i
            switch(i) {
                case 0: newgreen.name = 'self'; break;
                case 1: newgreen.name = 'left'; break;
                case 2: newgreen.name = 'right'; break;
                case 3: newgreen.name = 'up'; break;
                case 4: newgreen.name = 'down'; break;
            }
            newgreen.on('pointerdown', this.tapDown,newgreen)
            touch_array.push(newgreen)
        }
        scene.cam2.ignore(touch_array)

        scene.input.keyboard.on( 'keydown', this.keyDown, this )

        this.drawOpenTile()

    }
    
    tapDown() {
        if(work && !this.scene.isWindowShow()) {
            move = this.name

            this.rover.moveAction(move)
        }
    }
    moveAction(mv='self') {
        // console.log('moveAction')
        // if(work && this.scene.isZoomNow()) {
        if(work) {
            this.scene.gui.toogleInfo(true)
            // move = this.name
            move = mv

            // console.log('move',move,this)
            let tData = 0
            switch(move) {
                case 'right': tData = this.scene.map.getArrayPos(tileX+1,tileY); if(tData < 1) this.moveRight(); else if(tData === 2) this.startDynamite(); break;
                case 'left': tData = this.scene.map.getArrayPos(tileX-1,tileY); if(tData < 1) this.moveLeft(); else if(tData === 2) this.startDynamite(); break;
                case 'up': tData = this.scene.map.getArrayPos(tileX,tileY-1); if(tData < 1) this.moveUp(); else if(tData === 2) this.startDynamite(); break;
                case 'down': tData = this.scene.map.getArrayPos(tileX,tileY+1); if(tData < 1) this.moveDown(); else if(tData === 2) this.startDynamite(); break;
                case 'self': if([-10,-20,-30].indexOf(this.scene.map.getArrayPos(tileX,tileY)) >= 0) this.rotateMining(); else if((this.scene.map.getArrayPos(tileX,tileY)) === -1) this.toExit(); else if((this.scene.map.getArrayPos(tileX,tileY)) === -5) this.collectFuel(); break;
            }
        }
    }
    keyDown(e) {
        // console.log(e)
        // if(work && this.scene.isZoomNow()) {
        if(work && !this.scene.isWindowShow()) {
            const tData = this.scene.map.getArrayPos(tileX,tileY)
            move = ''
            if(e.key === 'ArrowRight' || e.code === 'KeyD') {
                if(this.scene.map.getArrayPos(tileX+1,tileY) < 1) this.moveRight()
            } else if(e.key === 'ArrowLeft' || e.code === 'KeyA') {
                if(this.scene.map.getArrayPos(tileX-1,tileY) < 1) this.moveLeft()
            } else if(e.key === 'ArrowUp' || e.code === 'KeyW') {
                if(this.scene.map.getArrayPos(tileX,tileY-1) < 1) this.moveUp()
            } else if(e.key === 'ArrowDown' || e.code === 'KeyS') {
                if(this.scene.map.getArrayPos(tileX,tileY+1) < 1) this.moveDown()
            } else if(e.code === 'KeyR') {
                if(tData === -5) this.collectFuel()
                else if(this.checkCollapse()) this.startDynamite()
            } else if(e.code === 'KeyE') {
                if(this.scene.map.getArrayPos(tileX,tileY) === -1) this.toExit()
                else if(this.scene.map.getArrayPos(tileX,tileY) < -9) this.rotateMining()
            } else if(e.code === 'KeyF') {
                this.startScan()
            } else if(e.code === 'Escape') {
                console.log('press ESC')
                this.scene.gui.showWindow('exit')
            }
        }
    }
    startScan() {
        if(work) {
            if(this.ct_moves > 4) {
                this.ct_moves -= 5
                this.scene.gui.updateHeader()

                this.scene.map.delFogs(this.getTilePos(),0,true)
            }
        }
    }
    checkActions() {
        const tData = this.scene.map.getArrayPos(tileX,tileY)
        let act = 'scan'
        if(tData === -1) {
            act = 'exit'
        } else if(tData === -5) {
            act = 'fuel'
        } else if(tData < -9) {
            if(tData === -10) act = 'common'
            else if(tData === -20) act = 'rare'
            else if(tData === -30) act = 'legendary'
        } else {
            if(this.checkCollapse()) act = 'dynamite'
        }

        if(this.scene.gui != null) this.scene.gui.showModal(act)
    }
    checkCollapse() {
        const scene = this.scene
        if(scene.map.getArrayPos(tileX+1,tileY) === 2 || scene.map.getArrayPos(tileX-1,tileY) === 2 ||  scene.map.getArrayPos(tileX,tileY+1) === 2 ||  scene.map.getArrayPos(tileX,tileY-1) === 2)
        return true
        else return false
    }
    checkWorm() {
        const scene = this.scene
        if(scene.map.getArrayPos(tileX+1,tileY) === 3 || scene.map.getArrayPos(tileX-1,tileY) === 3 ||  scene.map.getArrayPos(tileX,tileY+1) === 3 ||  scene.map.getArrayPos(tileX,tileY-1) === 3)
        return true
        else return false
    }
    toExit() {
        if(this.ct_moves > 0) {
            move = 'exit'
            work = false
            console.log('exit')
            this.hideTouch()
            this.scene.gui.hideAll()
            this.setVisible(false)
            this.scene.input.keyboard.off( 'keydown')
            this.scene.gui.showEnd()
        }
    }
    startDynamite() {
        if(this.dynamite > 0) {
            move = 'dynamite'
            work = false
            this.hideTouch()
            this.dynamite--
            this.scene.gui.updateHeader()
    
            const find_debris = this.scene.map.getDebris(tileX,tileY)
            for (let i = 0; i < find_debris.length; i++) this.scene.map.setArrayPos(find_debris[i].tileX,find_debris[i].tileY,0)
            
            if(find_debris.length > 0) {
                for (let i = 0; i < find_debris.length; i++) {
                    const elem = find_debris[i];
                }
                this.scene.tweens.add({targets: find_debris,alpha: 0,duration: 300,ease: 'Linear',delay: 0})
            }
    
            this.scene.time.delayedCall(700,(rover,work) => {
                rover.drawOpenTile()   
            },[this,work]);
        }
    }
    collectFuel() {
        let need_moves = 1;
        this.mine_now = 'fuel';

        if(this.ct_moves >= need_moves) {
            this.ct_moves += 10
            this.scene.gui.updateHeader()
            // work = false
            // move = 'fuel'
            this.hideTouch()
            this.scene.map.setArrayPos(tileX,tileY,0)
            const find_res = this.scene.map.getObjPos(tileX,tileY)
            if(find_res != null) this.scene.tweens.add({targets: find_res,alpha: 0,duration: 1000,ease: 'Quad.InOut',delay: 0})

            this.drawOpenTile()    

            // switch(current_anim) {
            //     case 'idle left': this.play('rotation left-mining'); this.startMining(250,'idle left');  break;
            //     case 'idle right':  this.play('rotation right-down'); this.playAfterDelay('rotation down-mining',500); this.startMining(750,'idle down'); break;
            //     case 'idle up':  this.play('rotation up-left'); this.playAfterDelay('rotation left-mining',500); this.startMining(750,'idle left'); break;
            //     case 'idle down': this.play('rotation down-mining'); this.startMining(250,'idle down'); break;
            // }
        }
    }
    rotateMining() {
        let need_moves = 1;
        const res_mining = this.scene.map.getArrayPos(tileX,tileY)
        switch(res_mining) {
            case -10: this.mine_now = 'common'; need_moves = 6; break;
            case -20: this.mine_now = 'rare'; need_moves = 10; break;
            case -30: this.mine_now = 'legendary'; need_moves = 15; break;
        }

        if(this.ct_moves >= need_moves) {
            this.ct_moves -= need_moves
            this.scene.gui.updateHeader()
            work = false
            move = 'mining'
            this.hideTouch()
            switch(current_anim) {
                case 'idle left': this.play('rotation left-mining'); this.startMining(250,'idle left');  break;
                case 'idle right':  this.play('rotation right-down'); this.playAfterDelay('rotation down-mining',500); this.startMining(750,'idle down'); break;
                case 'idle up':  this.play('rotation up-left'); this.playAfterDelay('rotation left-mining',500); this.startMining(750,'idle left'); break;
                case 'idle down': this.play('rotation down-mining'); this.startMining(250,'idle down'); break;
            }
        }
    }
    setWork(wrk = true) {
        work = wrk ? true : false
    }
    isWork() {
        return work
    }
    startMining(delayTw = 0,anim = 'idle left') {
        
        current_anim = anim

        this.scene.map.setArrayPos(tileX,tileY,0)

        this.scene.time.delayedCall(delayTw,(rover) => {
            rover.play('mining');
            rover.endMining(3050);
        },[this]);
        
    }
    endMining(delayTw = 0) {
        const find_res = this.scene.map.getObjPos(tileX,tileY)
        if(find_res != null) this.scene.tweens.add({targets: find_res,alpha: 0,duration: 3000,ease: 'Quad.InOut',delay: 250})

        this.scene.time.delayedCall(delayTw,(rover,move) => {
            if(current_anim === 'idle left') rover.playReverse('rotation left-mining')
            else rover.playReverse('rotation down-mining')
            work = true
            this.drawOpenTile()    
            switch(rover.mine_now ) {
                case 'common': rover.collected_common++; break;
                case 'rare': rover.collected_rare++; break;
                case 'legendary': rover.collected_legendary++; break;
            }
            rover.scene.gui.updateHeader()
    
        },[this,move,current_anim]);
    }
    startMove(delayTw = 0) {
        if(this.ct_moves > 0) {
            this.ct_moves--
            this.scene.gui.updateHeader()
            this.hideTouch()
            this.scene.tweens.add({
                targets: this,
                x: this.getPosX(),
                y: this.getPosY(),
                duration: 1000,
                ease: 'Linear',
                delay: delayTw,
                onComplete:(tw,trgts,params)=>{params.moveEnd()},
                onCompleteParams:[this],
                onStart:(tw,trgts,params,move)=>{if(move === 'right' || move === 'left' || move === 'down' || move === 'up') params.play('ride '+move)},
                onStartParams:[this,move] 
            })
            this.scene.map.delFogs(this.getTilePos(),delayTw)
        }
    }
    hideTouch() {
        touch_array.forEach((elem) => elem.setVisible(false))
    }
    moveLast() {
        tileX = lastTX
        tileY = lastTY

        this.x = this.getPosX()
        this.y = this.getPosY()

    }
    moveRight() {
        work = false
        lastTX = tileX
        lastTY = tileY

        move = 'right'
        tileX++
        switch(current_anim) {
            case 'idle right': this.startMove(); break;
            case 'idle left': this.play('rotation left-up');this.playAfterDelay('rotation up-right',500);this.startMove(1000); break;
            case 'idle up': this.play('rotation up-right'); this.startMove(500); break;
            case 'idle down': this.play('rotation down-right'); this.startMove(500); break;
        }
        this.scene.gui.toogleInfo(true)
    }
    moveLeft() {
        work = false
        lastTX = tileX
        lastTY = tileY

        move = 'left'
        tileX--
        switch(current_anim) {
            case 'idle left': this.startMove(); break;
            case 'idle right': this.play('rotation right-up');this.playAfterDelay('rotation up-left',500);this.startMove(1000); break;
            case 'idle up': this.play('rotation up-left'); this.startMove(500); break;
            case 'idle down': this.play('rotation down-left'); this.startMove(500); break;
        }
        this.scene.gui.toogleInfo(true)
    }
    moveUp() {
        work = false
        lastTX = tileX
        lastTY = tileY

        move = 'up'
        tileY--
        switch(current_anim) {
            case 'idle up': this.startMove(); break;
            case 'idle right': this.play('rotation right-up');this.startMove(500); break;
            case 'idle left': this.play('rotation left-up'); this.startMove(500); break;
            case 'idle down': this.play('rotation down-left');this.playAfterDelay('rotation left-up',500); this.startMove(1000); break;
        }
        this.scene.gui.toogleInfo(true)
    }
    moveDown() {
        work = false
        lastTX = tileX
        lastTY = tileY

        move = 'down'
        tileY++
        switch(current_anim) {
            case 'idle down': this.startMove(); break;
            case 'idle right': this.play('rotation right-down');this.startMove(500); break;
            case 'idle left': this.play('rotation left-down'); this.startMove(500); break;
            case 'idle up': this.play('rotation up-right');this.playAfterDelay('rotation right-down',500); this.startMove(1000); break;
        }
        this.scene.gui.toogleInfo(true)
    }
    moveEnd() {
        if(move === 'right' || move === 'left' || move === 'down' || move === 'up') current_anim = 'idle '+move
        this.play(current_anim)
        if(this.checkWorm()) {
            // console.log('find worm')
            this.scene.map.showWorm(tileX,tileY)
        } else {
            this.setWorkNext()
        }
    }
    setWorkNext() {
        work = true
        this.drawOpenTile()
    }
    getPosX() {
        return this.scene.map.getTilePosX(tileX)+this.scene.tileSize/2
    }
    getPosY() {
        return this.scene.map.getTilePosY(tileY)+this.scene.tileSize/2
    }
    getTilePos() {
        return {tileX:tileX,tileY:tileY}
    }
    drawOpenTile() {
        if(this.ct_moves > 0 && this.scene.time_left > 0) {
            work = true
            touch_array.forEach((elem,ind,arr) => {
                const rover = elem.rover
                const scene = elem.scene
                if(elem.id > 0) elem.setVisible(false).setAlpha(0.5)
                else elem.setVisible(true)
                switch(elem.id) {
                    case 0: elem.setPosition(rover.x,rover.y); break;
                    case 1: elem.setPosition(rover.x-rover.scene.tileSize,rover.y); break;
                    case 2: elem.setPosition(rover.x+rover.scene.tileSize,rover.y); break;
                    case 3: elem.setPosition(rover.x,rover.y-rover.scene.tileSize); break;
                    case 4: elem.setPosition(rover.x,rover.y+rover.scene.tileSize); break;
                }
            })
            if(this.scene.map.getArrayPos(tileX-1,tileY) < 1) touch_array[1].setVisible(true)
            if(this.scene.map.getArrayPos(tileX+1,tileY) < 1) touch_array[2].setVisible(true)
            if(this.scene.map.getArrayPos(tileX,tileY-1) < 1) touch_array[3].setVisible(true)
            if(this.scene.map.getArrayPos(tileX,tileY+1) < 1) touch_array[4].setVisible(true)
    
            if(this.scene.map.getArrayPos(tileX-1,tileY) == 2) touch_array[1].setVisible(true).setAlpha(0.01)
            if(this.scene.map.getArrayPos(tileX+1,tileY) == 2) touch_array[2].setVisible(true).setAlpha(0.01)
            if(this.scene.map.getArrayPos(tileX,tileY-1) == 2) touch_array[3].setVisible(true).setAlpha(0.01)
            if(this.scene.map.getArrayPos(tileX,tileY+1) == 2) touch_array[4].setVisible(true).setAlpha(0.01)
    
    
            this.checkActions()
        } else {
            if(this.ct_moves <= 0) this.scene.gui.showWindow('game over fuel')
            else if(this.scene.time_left <= 0) this.scene.gui.showWindow('game over time')
        }
    }
    deleteAll() {
        for (let i = 0; i < touch_array.length; i++) {
            if(touch_array[i] != null) touch_array[i].destroy()
        }
        this.destroy()
    }
    createAnim(scene) {
        scene.anims.create({ key: 'idle right', frames: [{key:'rover',frame:'ride right/0117'}], frameRate: 1 })
        scene.anims.create({ key: 'idle left', frames: [{key:'rover',frame:'ride left/0039'}], frameRate: 1 })
        scene.anims.create({ key: 'idle down', frames: [{key:'rover',frame:'ride down/0001'}], frameRate: 1 })
        scene.anims.create({ key: 'idle up', frames: [{key:'rover',frame:'ride up/0078'}], frameRate: 1 })
        scene.anims.create({
            key: 'ride right',
            frames: scene.anims.generateFrameNames('rover',{ prefix: 'ride right/', start:117,end: 140, zeroPad: 4 }),
            frameRate: 24,
            repeat:-1
        })
        scene.anims.create({
            key: 'ride left',
            frames: scene.anims.generateFrameNames('rover',{ prefix: 'ride left/', start:39,end: 62, zeroPad: 4 }),
            frameRate: 24,
            repeat:-1
        })
        scene.anims.create({
            key: 'ride down',
            frames: scene.anims.generateFrameNames('rover',{ prefix: 'ride down/', start:1,end: 24, zeroPad: 4 }),
            frameRate: 24,
            repeat:-1
        })
        scene.anims.create({
            key: 'ride up',
            frames: scene.anims.generateFrameNames('rover',{ prefix: 'ride up/', start:78,end: 101, zeroPad: 4 }),
            frameRate: 24,
            repeat:-1
        })
        //Rotate Animation
        scene.anims.create({
            key: 'rotation up-right',
            frames: scene.anims.generateFrameNames('rover',{ prefix: 'rotation up-right/', start:102,end: 116, zeroPad: 4 }),
            frameRate: 28,
        })
        scene.anims.create({
            key: 'rotation right-up',
            frames: scene.anims.generateFrameNames('rover',{ prefix: 'rotation up-right/', start:116,end: 102, zeroPad: 4 }),
            frameRate: 28,
        })
        scene.anims.create({
            key: 'rotation right-down',
            frames: scene.anims.generateFrameNames('rover',{ prefix: 'rotation right-down/', start:141,end: 155, zeroPad: 4 }),
            frameRate: 28,
        })
        scene.anims.create({
            key: 'rotation down-right',
            frames: scene.anims.generateFrameNames('rover',{ prefix: 'rotation right-down/', start:155,end: 141, zeroPad: 4 }),
            frameRate: 28,
        })
        scene.anims.create({
            key: 'rotation down-left',
            frames: scene.anims.generateFrameNames('rover',{ prefix: 'rotation down-left/', start:25,end: 38, zeroPad: 4 }),
            frameRate: 28,
        })
        scene.anims.create({
            key: 'rotation left-down',
            frames: scene.anims.generateFrameNames('rover',{ prefix: 'rotation down-left/', start:38,end: 25, zeroPad: 4 }),
            frameRate: 28,
        })
        scene.anims.create({
            key: 'rotation left-up',
            frames: scene.anims.generateFrameNames('rover',{ prefix: 'rotation left-up/', start:63,end: 77, zeroPad: 4 }),
            frameRate: 28,
        })
        scene.anims.create({
            key: 'rotation up-left',
            frames: scene.anims.generateFrameNames('rover',{ prefix: 'rotation left-up/', start:77,end: 63, zeroPad: 4 }),
            frameRate: 28,
        })
        scene.anims.create({
            key: 'rotation left-mining',
            frames: scene.anims.generateFrameNames('rover',{ prefix: 'rotation down-left/', start:38,end: 32, zeroPad: 4 }),
            frameRate: 28,
        })
        scene.anims.create({
            key: 'rotation down-mining',
            frames: scene.anims.generateFrameNames('rover',{ prefix: 'rotation down-left/', start:25,end: 32, zeroPad: 4 }),
            frameRate: 28,
        })

        const mining_frames = [
            scene.anims.generateFrameNames('rover',{ prefix: 'start mining/', start:1,end: 24, zeroPad: 4 }),
            scene.anims.generateFrameNames('rover',{ prefix: 'mining/', start:25,end: 48, zeroPad: 4 }),
            scene.anims.generateFrameNames('rover',{ prefix: 'mining/', start:25,end: 48, zeroPad: 4 }),
            scene.anims.generateFrameNames('rover',{ prefix: 'mining/', start:25,end: 48, zeroPad: 4 }),
            scene.anims.generateFrameNames('rover',{ prefix: 'stop mining/', start:49,end: 63, zeroPad: 4 }),
        ]
        scene.anims.create({
            key: 'mining',
            frames: mining_frames.flat(),
            frameRate: 24,
            repeat:0
        })

    }
}

