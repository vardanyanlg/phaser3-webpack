import Phaser from "phaser"

const moves_name = 'Moves:'
const times_name = 'Time left:'
const dynamite_name = 'Dynamite\navailable:'
const res_name = 'Resources\ncollected:'

export default class GUI extends Phaser.GameObjects.Container {


    constructor (scene) {
        super(scene)

        this
            .setScrollFactor(0)
            .setDepth(0.5)

        this.createAnim(scene)

        this.pay_worm_count = 0
        this.zoomNow = true
        this.windowShowNow = false
        this.wnd_array = []
        // this.time_left = 1200
        
        this.scene.add.existing(this)
        this.curr_mode = ''

        this.header_cont = scene.add.container()
        // this.header = scene.add.sprite(0,0,'gui','header')
        //     .setOrigin(0)
        //     .setScale(1.8,1)
        this.move_icon = scene.add.sprite(80,40,'gui','move_icon')
        this.time_icon = scene.add.sprite(230,40,'gui','time_icon')
        this.dynamite_icon = scene.add.sprite(360,40,'gui','dynamite_icon')
        this.res_icon = scene.add.sprite(500,40,'gui','resources_icon')
        this.moves_txt = scene.add.rexBBCodeText(80,80, moves_name+' [color=#34FF61]120/120[/color]', { fontFamily: 'Helvetica', fontSize: 18, color: '#FFFFFF'}).setOrigin(0.5,0).setHAlign('center').setResolution(2)
        this.time_txt = scene.add.rexBBCodeText(230,80, times_name+' [color=#34FF61]20:00[/color]', { fontFamily: 'Helvetica', fontSize: 18, color: '#FFFFFF'}).setOrigin(0.5,0).setHAlign('center').setResolution(2)
        this.dynamite_txt = scene.add.rexBBCodeText(360,80, dynamite_name+' [color=#34FF61]1[/color]', { fontFamily: 'Helvetica', fontSize: 18, color: '#FFFFFF'}).setOrigin(0.5,0).setHAlign('center').setResolution(2)
        this.res_txt = scene.add.rexBBCodeText(500,80, res_name+' [color=#34FF61]0/0/0[/color]', { fontFamily: 'Helvetica', fontSize: 18, color: '#FFFFFF'}).setOrigin(0.5,0).setHAlign('center').setResolution(2)
        
        this.header_cont.add([this.move_icon,this.time_icon,this.dynamite_icon,this.res_icon])
        this.header_cont.add([this.moves_txt,this.time_txt,this.res_txt,this.dynamite_txt])

        this.modal_cont = scene.add.container().setPosition(scene.game.sizeW,0)
        this.modal = scene.add.sprite(0,0,'gui','modal')
            .setOrigin(1,0)
            .setScale(1,1.3)
            // .setAlpha(1)
            .setInteractive()
        this.modal_icon = scene.add.sprite(-100,60,'gui','scan')

        this.modal_cont.add([this.modal,this.modal_icon])
        this.modal_txt = scene.add.text(-100,150,'Press "E" to mine\ncommon resource',{font: "18px Helvetica", fill: "#FFFFFF", align: "center"}).setOrigin(0.5).setResolution(2)
            // .setFontSize(30)
            .setDepth(0.6)
        this.modal_cont.add([this.modal_txt])
        this.modal.on('pointerdown', this.tapAction,this)

        // this.modal_cont.add(this.modal_txt)
        this.showModal('scan')


        this.controls_info = scene.add.image(scene.game.sizeW-85,scene.game.sizeH-200,'gui','controls_modal')
            .setInteractive()
            .setScrollFactor(0)

        this.controls_info.curr_show = true
        this.add([this.controls_info])

        this.controls_info.on('pointerdown',this.toogleInfo,this)

        this.sound_icon = scene.add.image(scene.game.sizeW-40,scene.game.sizeH-30,'gui','sound_icon')
            .setInteractive()
            .setScrollFactor(0)

        this.add([this.sound_icon])

        // this.controls_info.on('pointerdown',this.toogleInfo,this)

        // this.zoom_btn = scene.add.sprite(scene.game.sizeW,scene.game.sizeH,'gui','zoomOut_btn')
        //     .setInteractive()
        //     .setOrigin(1)
        //     // .setScale(0.4)
        //     // .setScrollFactor(0)

        // scene.anims.create({ key: 'zoom out btn', frames: [{key:'gui',frame:'zoomOut_btn'}], frameRate: 1 })
        // scene.anims.create({ key: 'zoom in btn', frames: [{key:'gui',frame:'zoomIn_btn'}], frameRate: 1 })

        // this.zoom_btn.on('pointerdown',this.tapZoom,this)
        scene.input.keyboard.on( 'keydown', this.keyDown, this )

        // this.add([this.zoom_btn])
        this.add([this.header_cont,this.modal_cont])
        scene.cameras.main.ignore(this)

        // timer = scene.time.create(false)
        // timer.loop(Phaser.Timer.SECOND, this.endTimer, this)
        // timer.start()
        this.timedEvent = scene.time.addEvent({ delay: 1000, callback: this.endTimer, callbackScope: this, loop: true });
    }
    toogleInfo(close = false) {
        if(this.controls_info.curr_show === true) this.controls_info.curr_show = false
        else this.controls_info.curr_show = true
        
        if(close === true) this.controls_info.curr_show = false

        if(this.controls_info.curr_show === true) {
            this.scene.tweens.add({targets: this.controls_info,x: this.scene.game.sizeW-85,duration: 100,ease: 'Quad.InOut',delay: 0 })
        } else {
            this.scene.tweens.add({targets: this.controls_info,x: this.scene.game.sizeW-9,duration: 100,ease: 'Quad.InOut',delay: 0 })
        }
    }
    tapAction() {
        // console.log('tap action')
        if(this.curr_mode === 'scan') {
            this.scene.rover.startScan()
        } else if(this.curr_mode === 'dynamite') {
           if( this.scene.rover.checkCollapse())  this.scene.rover.startDynamite()
        } else {
            this.scene.rover.moveAction('self')
        }
        
    }
    endTimer() {
        // console.log(this)
        if(this.scene != null) {
            if(!this.windowShowNow) {
                if(this.scene.time_left != null) this.scene.time_left--
                if(this.time_txt != null) this.time_txt.setText(times_name+' [color=#34FF61]'+new Date( this.scene.time_left * 1000).toISOString().slice(14, 19)+'[/color]')

                if(this.scene.time_left <= 0) this.scene.gui.showWindow('game over time')
            }
        }
    }
    updateHeader() {
        const rover = this.scene.rover
        this.moves_txt.setText(moves_name+' [color=#34FF61]'+rover.ct_moves+'/120[/color]')
        // this.time_txt2
        this.res_txt.setText(res_name+' [color=#34FF61]'+rover.collected_common+'/'+rover.collected_rare+'/'+rover.collected_legendary+'[/color]')
        this.dynamite_txt.setText(dynamite_name+' [color=#34FF61]'+rover.dynamite+'[/color]')
    }
    showModal(mode = 'common') {
        this.curr_mode = mode
        switch(mode) {
            case 'empty': this.modal_txt.setText('No actions available'); this.modal_icon.setVisible(false); break;
            case 'exit': this.modal_txt.setText('Press "E" to leave\nthe map'); this.modal_icon.setVisible(false); break;
            case 'common': this.modal_txt.setText('Press "E" to mine\n resources\n(COST - 6 MOVES)'); this.modal_icon.setTexture('gui','gem 1').setVisible(true); break;
            case 'rare': this.modal_txt.setText('Press "E" to mine\n resources\n(COST - 10 MOVES)'); this.modal_icon.setTexture('gui','gem 2').setVisible(true); break;
            case 'legendary': this.modal_txt.setText('Press "E" to mine\n resources\n(COST - 15 MOVES)'); this.modal_icon.setTexture('gui','gem 3').setVisible(true); break;
            // case 'fuel': this.modal_txt.setText('Press "E" to mine\n resources\n[COST 15 MOVES]'); break;
            case 'dynamite': this.modal_txt.setText('Press "R" to blow\nup tunnel collapse'); this.modal_icon.setVisible(false); break;
            case 'fuel': this.modal_txt.setText('Press "R" to collect\nthe fuel\n(COST - 1 MOVE)'); this.modal_icon.setTexture('gui','fuel').setVisible(true); break;
            case 'scan': this.modal_txt.setText('Press "F" to scan\nthe area\n(COST - 5 MOVE)'); this.modal_icon.setTexture('gui','scan').setVisible(true); break;
        }
    }
    showWindow(type,black_delay = 50) {
        if(!this.windowShowNow) {
            this.windowShowNow = true
            this.wnd_array.forEach(e => {if(e != null) e.destroy()})
            this.wnd_array = []
    
            const rover = this.scene.rover
            this.end_cont = this.scene.add.container().setPosition(this.scene.center.x,this.scene.center.y)
    
            this.blackscreen = this.scene.add.graphics()
            this.blackscreen.fillStyle(0x000000,0.75).fillRect(-this.scene.game.sizeW,-this.scene.game.sizeH,this.scene.game.sizeW*3,this.scene.game.sizeH*3)
            this.blackscreen.setScale(4).setAlpha(1).setVisible(true)
            if(black_delay > 0) {
                this.blackscreen.setAlpha(0)
                this.scene.tweens.add({targets: this.blackscreen,alpha: 1,duration: black_delay,ease: "Linear" ,delay: 0 })
            }
            
    
            this.end = this.scene.add.sprite(0,0,'gui','window_ui')
                .setOrigin(0.5)
                .setScale(1)
                .setDepth(0.9)
    
            if(type === 'start') {
                this.img = this.scene.add.image(0.5,11,'gui','disclaimer_image').setOrigin(0.5,1).setScale(0.996)
                this.message = this.scene.add.text(0,50,'WELCOME TO MINING MISSION',{font: "30px Play", fill: "#FFFFFF", align: "center"}).setOrigin(0.5).setResolution(2)
                this.message2 = this.scene.add.text(0,140,'Your goal is to complete resource mining and return\nto base with a limited amount of steps.\n\nIn the course of the mission, you might be attacked by the sand worm.\nYou will be able to decide whether to interact with him and fight or leave.',{font: "14px Helvetica", fill: "#FFFFFF", align: "center"}).setOrigin(0.5).setResolution(2)
                this.start_btn = this.scene.add.image(0,230,'gui','button').setInteractive()
                    .on('pointerdown',this.letsPlay,this)
        
                this.start_txt = this.scene.add.text(0,230,'LET’S PLAY',{font: "16px Play", fill: "#36363D", align: "center"}).setOrigin(0.5).setResolution(2)
        
                this.wnd_array.push(this.blackscreen,this.end,this.img,this.message,this.message2,this.start_btn,this.start_txt)
            } else if(type === 'exit') {
                this.img = this.scene.add.image(0.5,11,'gui','disclaimer_image').setOrigin(0.5,1).setScale(0.996)
                this.message = this.scene.add.text(0,80,'EXIT THE MISSION?',{font: "30px Play", fill: "#FFFFFF", align: "center"}).setOrigin(0.5).setResolution(2)
                this.message2 = this.scene.add.text(0,140,'You will loose all the progress in this mission\nif you exit before getting to the exit gates',{font: "14px Helvetica", fill: "#FFFFFF", align: "center"}).setOrigin(0.5).setResolution(2)
                this.exit_btn = this.scene.add.image(100,230,'gui','button').setInteractive()
                    .on('pointerdown',this.exitGame,this)
                this.exit_txt = this.scene.add.text(100,230,'EXIT',{font: "16px Play", fill: "#36363D", align: "center"}).setOrigin(0.5).setResolution(2)
    
                this.return_txt = this.scene.add.text(-100,230,'RETURN TO MISSION',{font: "16px Play", fill: "#34FF61", align: "center"}).setOrigin(0.5).setInteractive().setResolution(2)
                    .on('pointerdown',this.returnGame,this)
    
                this.wnd_array.push(this.blackscreen,this.end,this.img,this.message,this.message2,this.exit_btn,this.exit_txt,this.return_txt)
            } else if(type === 'worm') {
                this.end.setScale(1,1.15)
                this.selectActionWorm = 'retreat'
                this.img = this.scene.add.image(0.5,-30,'gui','worm_attack').setOrigin(0.5,1).setScale(0.996)
                this.message = this.scene.add.text(0,30,"YOU'VE BEEN ATTACKED\nBY THE SAND WORM!",{font: "30px Play", fill: "#FFFFFF", align: "center"}).setOrigin(0.5).setResolution(2)
                this.message2 = this.scene.add.text(-160,90,'Choose your next action to save yourself:',{font: "16px Helvetica", fill: "#FFFFFF", align: "left"}).setOrigin(0,0.5).setResolution(2)
                this.exit_btn = this.scene.add.image(0,270,'gui','button').setInteractive()
                    .on('pointerdown',this.chooseWormAction,this)
                this.exit_txt = this.scene.add.text(0,270,'CHOOSE',{font: "16px Play", fill: "#36363D", align: "center"}).setOrigin(0.5).setResolution(2)
                this.retreat_btn = this.scene.add.sprite(0,130,'gui','modal_choose_select').setInteractive()
                    .play('modal choose select')
                    .on('pointerdown',this.chooseRetreat,this)
                this.retreat_txt = this.scene.add.text(-150,130,'Retreat (11 moves will be taken)',{font: "13px Helvetica", fill: "#FFFFFF", align: "left"}).setOrigin(0,0.5).setResolution(2)
                this.pay_btn = this.scene.add.sprite(0,166,'gui','modal_choose').setInteractive()
                    .play('modal choose')
                    .on('pointerdown',this.choosePay,this)
                this.pay_txt = this.scene.add.text(-150,166,'Pay contribution to worm (24% of your income)',{font: "13px Helvetica", fill: "#FFFFFF", align: "left"}).setOrigin(0,0.5).setResolution(2)
                this.fight_btn = this.scene.add.sprite(0,202,'gui','modal_choose').setInteractive()
                    .play('modal choose')
                    .on('pointerdown',this.chooseFight,this)
                this.fight_txt = this.scene.add.text(-150,202,'Fight worm (70% chance to win)',{font: "13px Helvetica", fill: "#FFFFFF", align: "left"}).setOrigin(0,0.5).setResolution(2)
    
                // this.return_txt = this.scene.add.text(-100,230,'RETURN TO MISSION',{font: "16px Play", fill: "#34FF61", align: "center"}).setOrigin(0.5).setInteractive()
                //     .on('pointerdown',this.returnGame,this)
    
                this.wnd_array.push(this.blackscreen,this.end,this.img,this.message,this.message2,this.exit_btn,this.exit_txt)
                this.wnd_array.push(this.retreat_btn,this.pay_btn,this.fight_btn)
                this.wnd_array.push(this.retreat_txt,this.pay_txt,this.fight_txt)
            } else if(type === 'attack won' || type === 'retreat' || type === 'pay') {
                let go_img = 'attack_won'
                let go_title = 'ATTACK - WON'
                let go_offset = 0
                let go_info = 'You decided to fight the worm Luckily,\nyou were able to defeat the worm. Continue your journey'
                this.end.setScale(1,1)
                if(type === 'retreat') { this.end.setScale(1,0.95); go_offset = -15; go_img = 'retreated'; go_title = 'YOU HAVE RETREATED'; go_info = '11 steps have been deducted\nContinue your journey.'; }
                if(type === 'pay') { this.end.setScale(1,0.95); go_offset = -15; go_img = 'contribution'; go_title = 'CONTRIBUTION PAID'; go_info = 'You have chosen to donate 24% of your resource to worm.\nWorm lets you live and allow you to pass.\nPlease continue your journey'; }
                
                this.img = this.scene.add.image(0.5,40+go_offset,'gui',go_img).setOrigin(0.5,1).setScale(0.996)
                this.message = this.scene.add.text(0,60+30+go_offset,go_title,{font: "30px Play", fill: "#FFFFFF", align: "center"}).setOrigin(0.5).setResolution(2)
                this.message2 = this.scene.add.text(0,120+30+go_offset, go_info,{font: "16px Play", fill: "#FFFFFF", align: "center"}).setOrigin(0.5).setResolution(2)

                this.exit_btn = this.scene.add.image(0,180+40+go_offset,'gui','button').setInteractive()
                    .on('pointerdown',this.continueGame,this)
                this.exit_txt = this.scene.add.text(0,180+40+go_offset,'OK',{font: "16px Play", fill: "#36363D", align: "center"}).setOrigin(0.5).setResolution(2)
    
                // this.return_txt = this.scene.add.text(-100,180+40,'EXIT',{font: "16px Play", fill: "#34FF61", align: "center"}).setOrigin(0.5).setInteractive()
                //     .on('pointerdown',this.exitGame,this)
    
                this.wnd_array.push(this.blackscreen,this.end,this.img,this.message,this.message2,this.exit_btn,this.exit_txt)
            } else if(type === 'game over fuel' || type === 'game over time' || type === 'game over worm') {
                let go_img = 'game_over_fuel'
                let go_info = 'YOU RUN OUT OF FUEL'
                if(type === 'game over time') { go_img = 'game_over_fuel'; go_info = 'YOU RUN OUT OF TIME'; }
                if(type === 'game over worm') { go_img = 'game_over_worm'; go_info = 'YOU HAVE BEEN EATEN BY A WORM'; }
                this.end.setScale(1,0.92)
                this.img = this.scene.add.image(0.5,35,'gui',go_img).setOrigin(0.5,1).setScale(0.996)
                this.message = this.scene.add.text(0,60+20,'GAME OVER!',{font: "30px Play", fill: "#FFFFFF", align: "center"}).setOrigin(0.5).setResolution(2)
                this.message2 = this.scene.add.text(0,100+20, go_info,{font: "30px Play", fill: "#FFFFFF", align: "center"}).setOrigin(0.5).setResolution(2)

                this.exit_btn = this.scene.add.image(100,180+20,'gui','button').setInteractive()
                    .on('pointerdown',this.restartGame,this)
                this.exit_txt = this.scene.add.text(100,180+20,'PLAY AGAIN',{font: "16px Play", fill: "#36363D", align: "center"}).setOrigin(0.5).setResolution(2)
    
                this.return_txt = this.scene.add.text(-100,180+20,'EXIT',{font: "16px Play", fill: "#34FF61", align: "center"}).setOrigin(0.5).setInteractive().setResolution(2)
                    .on('pointerdown',this.exitGame,this)
    
                this.wnd_array.push(this.blackscreen,this.end,this.img,this.message,this.message2,this.exit_btn,this.exit_txt,this.return_txt)
            } else if(type === 'passed') {
                let res_proc_collect = rover.collected_common*8 + rover.collected_rare*18 + rover.collected_legendary*28 - this.pay_worm_count*24
                let res_ganted = Phaser.Math.Clamp(Math.round((res_proc_collect))/100,0,100)
                let clny_collect = Math.round((2 * res_ganted)*10)/10

                this.end.setScale(1.5,1)
                this.grayrect = this.scene.add.graphics()
                this.grayrect.fillStyle(0x232628,1).fillRect(-80,-106,460,246)
    
                this.resline = this.scene.add.graphics()
                this.resline.fillStyle(0x3D4048,1).fillRect(0,0,220,4).setPosition(-40,-15)
                this.resline2 = this.scene.add.graphics()
                this.resline2.fillStyle(0x34FF61,1).fillRect(0,0,220*res_ganted,4).setPosition(-40,-15)

                this.transline = this.scene.add.graphics()
                this.transline.fillStyle(0x3D4048,1).fillRect(0,0,245,4).setPosition(-362,138)
                this.transline2 = this.scene.add.graphics()
                this.transline2.fillStyle(0xF55B5D,1).fillRect(0,0,245*0.75,4).setPosition(-362,138)
                this.transline3 = this.scene.add.graphics()
                this.transline3.fillStyle(0x34FF61,1).fillRect(0,0,245*0.65,4).setPosition(-362,138)
    
                this.img = this.scene.add.image(-240,140,'rover','rover_image').setOrigin(0.5,1)
                this.av = this.scene.add.image(60,-70,'nocompress','resources_avatar').setOrigin(0.5).setScale(0.5)
                this.av2 = this.scene.add.image(260,-70,'nocompress','player_avatar').setOrigin(0.5).setScale(0.5)
                this.av_txt = this.scene.add.text(-40,-30,'Resources collected: '+clny_collect+' CLNY',{font: "14px Helvetica", fill: "#FFFFFF", align: "left"}).setOrigin(0,0.5).setResolution(2)
                this.ganted_txt = this.scene.add.text(60,5,+Math.round(res_ganted*100)+'% ganted',{font: "12px Helvetica", fill: "#FFFFFF", align: "center"}).setOrigin(0.5).setResolution(2)
                this.av2_txt = this.scene.add.text(260,-30,'Avatar: + 2000 XP',{font: "14px Helvetica", fill: "#FFFFFF", align: "center"}).setOrigin(0.5).setResolution(2)
                this.message3 = this.scene.add.text(-40,45,'Common: '+rover.collected_common+' x 8% = '+rover.collected_common*8+'%',{font: "12px Helvetica", fill: "#FFFFFF", align: "left"}).setOrigin(0,0.5).setResolution(2)
                this.message4 = this.scene.add.text(-40,80,'Rare: '+rover.collected_rare+' x 18% = '+rover.collected_rare*18+'%',{font: "12px Helvetica", fill: "#FFFFFF", align: "left"}).setOrigin(0,0.5).setResolution(2)
                this.message5 = this.scene.add.text(-40,115,'Legendary: '+rover.collected_legendary+' x 28% = '+rover.collected_legendary*28+'%',{font: "12px Helvetica", fill: "#FFFFFF", align: "left"}).setOrigin(0,0.5).setResolution(2)
        

                this.message = this.scene.add.text(0,-200,'YOU HAVE PASSED\nTHE MISSION!',{font: "40px Play", fill: "#FFFFFF", align: "left"}).setOrigin(0.5).setResolution(2)
                this.message2 = this.scene.add.text(-240,-125,'Default transport',{font: "14px Helvetica", fill: "#FFFFFF", align: "center"}).setOrigin(0.5).setResolution(2)
                this.transp_cond = this.scene.add.rexBBCodeText(-240,150, 'Transport condition 65% | [color=#F55B5D]-10%[/color]', { fontFamily: 'Helvetica', fontSize: 14, color: '#FFFFFF'}).setOrigin(0.5,0).setHAlign('center').setResolution(2)

                this.exit_btn = this.scene.add.image(100,230,'gui','button').setInteractive().setScale(1.5,1)
                    .on('pointerdown',this.restartGame,this)
                // this.exit_txt = this.scene.add.text(100,230,'COLLECT REWARDS',{font: "16px Play", fill: "#36363D", align: "center"}).setOrigin(0.5)
                this.exit_txt = this.scene.add.text(100,230,'PLAY AGAIN',{font: "16px Play", fill: "#36363D", align: "center"}).setOrigin(0.5).setResolution(2)
    
                this.return_txt = this.scene.add.text(-100,230,'EXIT',{font: "16px Play", fill: "#34FF61", align: "center"}).setOrigin(0.5).setInteractive().setResolution(2)
                    .on('pointerdown',this.exitGame,this)
    
                this.wnd_array.push(this.blackscreen,this.end,this.grayrect,this.img,this.av,this.av_txt,this.av2,this.av2_txt,this.message,this.message2,this.exit_btn,this.exit_txt,this.return_txt)
                this.wnd_array.push(this.message3,this.message4,this.message5)
                this.wnd_array.push(this.transp_cond,this.ganted_txt)
                this.wnd_array.push(this.resline,this.resline2)
                this.wnd_array.push(this.transline,this.transline2,this.transline3)
            }
            this.end_cont.add(this.wnd_array)
    
            this.add(this.end_cont)
        }
    }
    continueGame() {
        this.closeWindow()
        this.scene.rover.setWorkNext()
    }
    closeWindow() {
        this.wnd_array.forEach(e => {if(e != null) e.destroy()})

        this.windowShowNow = false
    }
    letsPlay() {
        this.closeWindow()
        this.scene.rover.work = true
    }
    returnGame() {
        this.closeWindow()
        // this.scene.rover.work = true
    }
    restartGame() {
        this.scene.restart()
    }
    exitGame() {
        window.close()
    }
    chooseRetreat() {
        // console.log('choose retreat')
        this.selectActionWorm = 'retreat'

        this.retreat_btn.play('modal choose select')
        this.pay_btn.play('modal choose')
        this.fight_btn.play('modal choose')
    }
    choosePay() {
        this.selectActionWorm = 'pay'
        
        this.retreat_btn.play('modal choose')
        this.pay_btn.play('modal choose select')
        this.fight_btn.play('modal choose')
    }
    chooseFight() {
        this.selectActionWorm = 'fight'
        
        this.retreat_btn.play('modal choose')
        this.pay_btn.play('modal choose')
        this.fight_btn.play('modal choose select')
    }
    chooseWormAction() {
        this.closeWindow()

        switch(this.selectActionWorm) {
            case 'retreat': this.scene.rover.ct_moves = Phaser.Math.Clamp(this.scene.rover.ct_moves - 11, 0, 120); this.updateHeader(); this.scene.map.leaveWorm(); this.scene.rover.moveLast(); this.showWindow('retreat',0); break;
            case 'pay': this.pay_worm_count++; this.scene.map.deleteWorm(); this.showWindow('pay',0); break;
            case 'fight': this.fightWorm(); break;
        }
        
    }
    fightWorm() {
        // console.log('fightWorm')
        const rnd_fight = Phaser.Math.Between(1,100)
        if(rnd_fight <= 70) {
            this.scene.map.deleteWorm()
            this.showWindow('attack won',0)
        } else {
            this.showWindow('game over worm',0)
        }
    }
    isZoomNow() {
        return this.zoomNow
    }
    tapZoom() {
        // console.log('tap zoom')
        this.zoomToogle()
    }
    keyDown(e) {
        // console.log(e)
        if(e.code === 'Space') {
            this.zoomToogle()
        }
      }
    isWindowShow() {
        return this.windowShowNow
    }
    zoomToogle() {
        if(!this.isWindowShow()) {
            this.zoomNow = !this.zoomNow
            if(this.zoomNow) {
                if(this.zoom != null) this.zoom_btn.play('zoom out btn')
                this.zoomIn()
            } else {
                if(this.zoom != null) this.zoom_btn.play('zoom in btn')
                this.zoomOut()
            }
        }
    }
    showEnd() {
        this.showWindow('passed')
        // const rover = this.scene.rover
        // this.end_cont = this.scene.add.container().setPosition(this.scene.center.x,this.scene.center.y)
        // this.end = this.scene.add.sprite(0,0,'gui','modal')
        //     .setOrigin(0.5)
        //     .setScale(3.5,3)
        // this.message = this.scene.add.text(0,-180,'YOU HAVE PASSED\nTHE MINING MISSION!',{font: "60px Helvetica", fill: "#FFFFFF", align: "center"}).setOrigin(0.5)
        // this.message2 = this.scene.add.text(0,-80,'Resources collected:',{font: "30px Helvetica", fill: "#FFFFFF", align: "center"}).setOrigin(0.5)
        // this.message3 = this.scene.add.text(0,-30,'COMMON - '+rover.collected_common,{font: "30px Helvetica", fill: "#FFFFFF", align: "center"}).setOrigin(0.5)
        // this.message4 = this.scene.add.text(0,10,'RARE - '+rover.collected_rare,{font: "30px Helvetica", fill: "#FFFFFF", align: "center"}).setOrigin(0.5)
        // this.message5 = this.scene.add.text(0,50,'LEGENDARY - '+rover.collected_legendary,{font: "30px Helvetica", fill: "#FFFFFF", align: "center"}).setOrigin(0.5)

        // this.restart = this.scene.add.text(0,150,'[start new]',{font: "30px Helvetica", fill: "#FFFFFF", align: "center"})
        //     .setOrigin(0.5)
        //     .setInteractive()
        //     .on('pointerdown',this.scene.restart,this.scene)

        // this.end_cont.add([this.end,this.message,this.message2,this.message3,this.message4,this.message5,this.restart])

        // this.add(this.end_cont)
    }
    hideAll() {

        // this.zoom_btn.off('pointerdown')
        this.scene.input.keyboard.off( 'keydown')

        if(this.header_cont != null) this.header_cont.setVisible(false)
        if(this.modal_cont != null) this.modal_cont.setVisible(false)
        if(this.controls_info != null) this.controls_info.setVisible(false)
        if(this.sound_icon != null) this.sound_icon.setVisible(false)
        
        // if(this.zoom_btn != null) this.zoom_btn.setVisible(false)

    }
    zoomIn() {
        this.scene.cameras.main.startFollow(this.scene.rover, true, 0.08, 0.08)
        this.scene.tweens.add({targets: this.scene.cameras.main,zoom: this.scene.zIn,duration: 500,ease: 'Quad.InOut',delay: 0 })
    }
    zoomOut() {
        this.scene.cameras.main.stopFollow()
        this.scene.tweens.add({targets: this.scene.cameras.main,zoom: this.scene.zOut,duration: 500,ease: 'Quad.InOut',delay: 0 })
    }
    updateInfoPos() {
        if(this.controls_info.curr_show === true) {
            this.controls_info.setPosition(this.scene.game.sizeW-85,this.scene.game.sizeH-200,'gui','controls_modal')
            // this.scene.tweens.add({targets: this.controls_info,x: this.scene.game.sizeW-85,duration: 100,ease: 'Quad.InOut',delay: 0 })
        } else {
            this.controls_info.setPosition(this.scene.game.sizeW-9,this.scene.game.sizeH-200,'gui','controls_modal')
            // this.scene.tweens.add({targets: this.controls_info,x: this.scene.game.sizeW-9,duration: 100,ease: 'Quad.InOut',delay: 0 })
        }
    }
    updatePos() {
        this.modal_cont.setPosition(this.scene.game.sizeW,0)
        // this.zoom_btn.setPosition(this.scene.game.sizeW,this.scene.game.sizeH)
        if(this.controls_info != null) this.updateInfoPos()
        if(this.sound_icon != null) this.sound_icon.setPosition(this.scene.game.sizeW-40,this.scene.game.sizeH-30)

        if(this.end_cont != null) this.end_cont.setPosition(this.scene.center.x,this.scene.center.y)
    }
    delete() {
        this.scene.input.keyboard.off('keydown')
        this.scene.time.removeAllEvents()

    }
    createAnim(scene) {
        scene.anims.create({ key: 'modal choose', frames: [{key:'gui',frame:'modal_choose'}], frameRate: 1 })
        scene.anims.create({ key: 'modal choose select', frames: [{key:'gui',frame:'modal_choose_select'}], frameRate: 1 })
    }
}