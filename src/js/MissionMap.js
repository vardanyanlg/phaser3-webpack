import Phaser from "phaser"

let map_array = []
let obj_exits = []
let obj_res = []
let fogs = []
let worms = []
let res_for_worms = []
let exits_show = []
let tileMap
let curr_worm
let gr,gr2
let commonR = 5,rareR = 3,legendaryR = 2,fuelR = 3

export default class MissionMap extends Phaser.GameObjects.Container {
    constructor (scene) {
        super(scene)
        scene.add.existing(this)
        this.resetMap()
        obj_exits = []
        obj_res = []
        fogs = []
        worms = []
        res_for_worms = []
        exits_show = []

        this.tileMap = tileMap = scene.make.tilemap({ key: 'map' })
        const tileset = tileMap.addTilesetImage('bg_tileset', 'bg');
        let bg_layer = tileMap.createLayer('Background', tileset, 0, 0)

        gr = scene.add.graphics().lineStyle(3, 0xFFFFFF, 0.03)

        scene.cam2.ignore([this,bg_layer,gr])

        this.createAnim(scene)
        this.drawGrid()

        const rnd = Phaser.Math.Between(1,3)
        switch(rnd) {
            case 1: map_array[3][8] = 0; break;
            case 2: map_array[8][13] = 0; break;
            case 3: map_array[12][10] = 0; break;
        }

        this.addResources()
        // this.addWorms()
    }
    getObjPos(tx,ty) {
        let find_obj
        // console.log(obj_res,tx,ty)
        for (let i = 0; i < obj_res.length; i++) {
            const obj = obj_res[i]
            if(obj.tileX === tx && obj.tileY === ty) {find_obj = obj; break;}
        }
        // console.log(find_obj)
        return find_obj
    }
    getDebris(tx,ty) {
        const find_obj = []
        for (let i = 0; i < obj_res.length; i++) {
            const obj = obj_res[i]
            if(obj.name === 'debris') {
                if(obj.tileX === tx+1 && obj.tileY === ty) find_obj.push(obj)
                if(obj.tileX === tx-1 && obj.tileY === ty) find_obj.push(obj)
                if(obj.tileX === tx && obj.tileY === ty+1) find_obj.push(obj)
                if(obj.tileX === tx && obj.tileY === ty-1) find_obj.push(obj)
            }
        }
        
        return find_obj
    }
    getTilePos(tx,ty) {
        console.log(tileMap.tileToWorldXY(tx,ty))
        return tileMap.tileToWorldXY(tx,ty)
    }
    getTilePosX(tx) {
        return tileMap.tileToWorldX(tx)
    }
    getTilePosY(ty) {
        return tileMap.tileToWorldY(ty)
    }
    getArrayPos(tx,ty) {
        // console.log('getArrayPos',map_array,tx,ty)
        if( (ty) < 0 || (ty) > map_array.length || (tx) < 0 || (tx) > map_array[0].length) return 1
        return map_array[ty][tx]
    }
    setArrayPos(tx,ty,tdata) {
        map_array[ty][tx] = tdata
    }
    getTilePointX(x) {
        // console.log('getTilePointX ',x)
        return tileMap.worldToTileX(x+this.scene.cameras.main.scrollX)
    }
    getTilePointY(y) {
        // console.log('getTilePointY ',y)
        return tileMap.worldToTileY(y+this.scene.cameras.main.scrollY)
    }
    addExits(startPoint) {
        const start_arr = [{tY:2,tX:0},{tY:3,tX:20},{tY:13,tX:0},{tY:13,tX:20}]
        let sel_start = start_arr[startPoint-1]
        start_arr.splice(startPoint-1,1)
        const rnd = Phaser.Math.Between(1,3)
        let sel_exit = start_arr[rnd-1]
        start_arr.splice(rnd-1,1)
        // console.log('addExits',startPoint)
        // switch(rnd) {
        //     case 1: if(rnd > 2) map_array[3][20] = 0; map_array[13][0] = 0; break;
        //     case 2: if(rnd > 2) map_array[2][0] = 0; else map_array[13][20] = 0; break;
        //     case 3: if(rnd > 2) map_array[2][0] = 0; else map_array[13][20] = 0; break;
        //     case 4: if(rnd > 2) map_array[3][20] = 0; else map_array[13][0] = 0; break;
        // }  
        exits_show.push({tileY:sel_start.tY,tileX:sel_start.tX})
        for (let i = 0; i < start_arr.length; i++) {
            if(map_array[start_arr[i].tY][start_arr[i].tX] != null) map_array[start_arr[i].tY][start_arr[i].tX] = 0
        }
        // switch(startPoint) {
        //     case 1: exits_show.push({tileY:2,tileX:0}); break;
        //     case 2: exits_show.push({tileY:13,tileX:0}); break;
        //     case 3: exits_show.push({tileY:3,tileX:20}); break;
        //     case 4: exits_show.push({tileY:13,tileX:20}); break;
        // }  
        // console.log(map_array)
        
        this.addObjects()

    }
    addObjects() {
        let tileID = 0
        const tilesCutouts = [64,77,82,88,181,182,261,262,264,279,280,281]
        for (let i = 0; i < map_array.length; i++) {
            for (let j = 0; j < map_array[i].length; j++) {
                const tile = map_array[i][j]
                
                if(tilesCutouts.indexOf(tileID) >= 0) { 
                    // console.log('add tile ',String(tileID).padStart(3,'0'))
                    const ext = this.scene.add.sprite(this.getTilePosX(j),this.getTilePosY(i),'objects','cutouts/tile'+String(tileID).padStart(3,'0'))
                        // .setTint(0xFF00FF)
                        .setDepth(0.1)
                        // .setAlpha(0.6)
                        .setVisible(true)
                        // .play('exit anim')
                    this.scene.cam2.ignore(ext)  
                    obj_exits.push(ext)
                }
                if(tile === -1) {
                    const ext = this.scene.add.sprite(this.getTilePosX(j),this.getTilePosY(i)+10,'objects','exit sign/0005')
                        .setAlpha(0.6)
                        .setVisible(false)
                        .play('exit anim')
                    ext.name = 'exit'
                    ext.tileX = j
                    ext.tileY = i
                    this.scene.cam2.ignore(ext)  
                    obj_exits.push(ext)
                } else if(tile === 2) {
                    let dbrs 
                    if(i === 3) {
                        dbrs = this.scene.add.sprite(this.getTilePosX(j),this.getTilePosY(i),'objects','debris/debris tile 71')
                            .setVisible(false)
                        let dbrs2 = this.scene.add.sprite(this.getTilePosX(j),this.getTilePosY(i+1),'objects','debris/debris tile 92')
                            .setVisible(false)
                        obj_res.push(dbrs2)
                        dbrs2.name = 'debris'
                        dbrs2.tileX = j
                        dbrs2.tileY = i    
                    }
                    if(i === 8) dbrs = this.scene.add.sprite(this.getTilePosX(j),this.getTilePosY(i),'objects','debris/debris tile 181').setVisible(false)
                    if(i === 12) dbrs = this.scene.add.sprite(this.getTilePosX(j),this.getTilePosY(i),'objects','debris/debris tile 262').setVisible(false)
                        // .play('exit anim')
                    dbrs.name = 'debris'
                    dbrs.tileX = j
                    dbrs.tileY = i
                    this.scene.cam2.ignore(dbrs)  
                    obj_res.push(dbrs)
                }
                tileID++
            }
        }
    }
    findFreeTiles() {
        let free_tiles = []
        for (let i = 0; i < map_array.length; i++) {
            for (let j = 0; j < map_array[i].length; j++) {
                if(map_array[i][j] === 0 && this.checkTileForRes(j,i+1) && this.checkTileForRes(j,i-1) && this.checkTileForRes(j+1,i) && this.checkTileForRes(j-1,i)) {
                    free_tiles.push({tileX:j,tileY:i})
                }
            }
        }
        return free_tiles
    }
    checkTileForRes(tx,ty) {
        const tData = this.getArrayPos(tx,ty)
        if(tData > -1 && tData < 2) return true
        else return false
    }
    addResources() {
        let free_tiles = this.findFreeTiles()
        // console.log(map_array)
        for (let i = 0; i < commonR; i++) {
            let rnd = Phaser.Math.Between(0,free_tiles.length-1)
            let rnd2 = Phaser.Math.Between(1,5)
            const res = this.scene.add.sprite(this.getTilePosX(free_tiles[rnd].tileX),this.getTilePosY(free_tiles[rnd].tileY),'objects','deposits/small 0'+rnd2)
                .setVisible(false)
            res.name = 'common res'
            res.tileX = free_tiles[rnd].tileX
            res.tileY = free_tiles[rnd].tileY
            map_array[res.tileY][res.tileX] = -10
            this.scene.cam2.ignore(res)  
            obj_res.push(res)
            res_for_worms.push(res)
            free_tiles.splice(rnd,1)
        }
        free_tiles = this.findFreeTiles()
        for (let i = 0; i < rareR; i++) {
            let rnd = Phaser.Math.Between(0,free_tiles.length-1)
            let rnd2 = Phaser.Math.Between(1,5)
            const res = this.scene.add.sprite(this.getTilePosX(free_tiles[rnd].tileX),this.getTilePosY(free_tiles[rnd].tileY),'objects','deposits/big 0'+rnd2)
                .setVisible(false)
            res.name = 'rare res'
            res.tileX = free_tiles[rnd].tileX
            res.tileY = free_tiles[rnd].tileY
            map_array[res.tileY][res.tileX] = -20
            this.scene.cam2.ignore(res)  
            obj_res.push(res)
            res_for_worms.push(res)
            free_tiles.splice(rnd,1)
        }
        free_tiles = this.findFreeTiles()
        for (let i = 0; i < legendaryR; i++) {
            let rnd = Phaser.Math.Between(0,free_tiles.length-1)
            let rnd2 = Phaser.Math.Between(1,5)
            const res = this.scene.add.sprite(this.getTilePosX(free_tiles[rnd].tileX),this.getTilePosY(free_tiles[rnd].tileY),'objects','deposits/huge 0'+rnd2)
                .setVisible(false)
            res.name = 'legendary res'
            res.tileX = free_tiles[rnd].tileX
            res.tileY = free_tiles[rnd].tileY
            map_array[res.tileY][res.tileX] = -30
            this.scene.cam2.ignore(res)  
            obj_res.push(res)
            res_for_worms.push(res)
            free_tiles.splice(rnd,1)
        }        
        // free_tiles = this.findFreeTiles()
        // let rnd = Phaser.Math.Between(0,free_tiles.length-1)
        // let rnd2 = Phaser.Math.Between(1,5)
        // const res = this.scene.add.sprite(this.getTilePosX(free_tiles[rnd].tileX),this.getTilePosY(free_tiles[rnd].tileY),'objects','deposits/huge 0'+rnd2)
        //     .setVisible(false)
        // res.name = 'legendary res'
        // res.tileX = free_tiles[rnd].tileX
        // res.tileY = free_tiles[rnd].tileY
        // map_array[res.tileY][res.tileX] = -30
        // this.scene.cam2.ignore(res)  
        // obj_res.push(res)
        // free_tiles.splice(rnd,1)

        free_tiles = this.findFreeTiles()
        for (let i = 0; i < fuelR; i++) {
            let rnd = Phaser.Math.Between(0,free_tiles.length-1)
            // let rnd2 = Phaser.Math.Between(1,5)
            const res = this.scene.add.sprite(this.getTilePosX(free_tiles[rnd].tileX),this.getTilePosY(free_tiles[rnd].tileY),'objects','deposits/fuel')
                .setVisible(false)
            res.name = 'fuel res'
            res.tileX = free_tiles[rnd].tileX
            res.tileY = free_tiles[rnd].tileY
            map_array[res.tileY][res.tileX] = -5
            this.scene.cam2.ignore(res)  
            obj_res.push(res)
            free_tiles.splice(rnd,1)
        }
    }
    addWorms() {
        for (let i = 0; i < 4; i++) {
            let rnd_res = Phaser.Math.Between(0,res_for_worms.length-1)
            let rnd_pos = Phaser.Math.Between(1,8)
            let worm_added = false

            switch(rnd_pos) {
                case 1: worm_added = this.wormCreate(res_for_worms[rnd_res].tileX-1,res_for_worms[rnd_res].tileY); break;
                case 2: worm_added = this.wormCreate(res_for_worms[rnd_res].tileX-1,res_for_worms[rnd_res].tileY-1); break;
                case 3: worm_added = this.wormCreate(res_for_worms[rnd_res].tileX,res_for_worms[rnd_res].tileY-1); break;
                case 4: worm_added = this.wormCreate(res_for_worms[rnd_res].tileX+1,res_for_worms[rnd_res].tileY-1); break;
                case 5: worm_added = this.wormCreate(res_for_worms[rnd_res].tileX-1,res_for_worms[rnd_res].tileY+1); break;
                case 6: worm_added = this.wormCreate(res_for_worms[rnd_res].tileX,res_for_worms[rnd_res].tileY+1); break;
                case 7: worm_added = this.wormCreate(res_for_worms[rnd_res].tileX+1,res_for_worms[rnd_res].tileY); break;
                case 8: worm_added = this.wormCreate(res_for_worms[rnd_res].tileX+1,res_for_worms[rnd_res].tileY+1); break;
            }   
            if(worm_added) res_for_worms.splice(rnd_res,1)
            else i--
        }

        // console.log(worms)
    }
    wormCreate(tx,ty) {
        const rover = this.scene.rover
        // console.log('worm create ',tx,ty)
        const tData = this.getArrayPos(tx,ty)

        if((tData < 1 && tData > -1) && (rover.tileX-1 != tx && rover.tileX+1 != tx) && (rover.tileY-1 != ty && rover.tileY+1 != ty)) {
            const worm = this.scene.add.sprite(this.getTilePosX(tx),this.getTilePosY(ty),'worm','appearance/worm_ani_000')
                .setVisible(false)
            worm.name = 'worm'
            worm.tileX = tx
            worm.tileY = ty
            map_array[ty][tx] = 3
            this.scene.cam2.ignore(worm)  
            worms.push(worm)
            return true
        } else return false
    }
    showWorm(tx,ty) {
        let worm_finded
        for (let i = 0; i < worms.length; i++) {
            const worm = worms[i]
            const wtx = worm.tileX
            const wty = worm.tileY
            if((wtx === tx-1 && wty === ty) || (wtx === tx+1 && wty === ty) || (wtx === tx && wty === ty-1) || (wtx === tx && wty === ty+1)) {
                worm_finded = worm
                i = worms.length
            }
        }
        if(worm_finded != null) {
            worm_finded
                .play('worm appearance')
                .on("animationcomplete",this.wormAppearance,worm_finded)
                .setVisible(true)

            curr_worm = worm_finded
            // console.log('worm appearance')
        } else {
            // console.log('worm not find',worms)
            this.scene.rover.setWorkNext()
        }
    }
    leaveWorm() {
        if(curr_worm != null) {
            curr_worm.play('worm leaving')
            curr_worm = null
        }
    }
    deleteWorm() {
        if(curr_worm != null) {
            const tData = this.getArrayPos(curr_worm.tileX,curr_worm.tileY)
            if(tData === 3) {
                this.setArrayPos(curr_worm.tileX,curr_worm.tileY,0)
            }
            curr_worm.play('worm leaving')
            curr_worm = null
        }
    }
    wormAppearance() {
        // console.log(this)
        this.off("animationcomplete")
        this.play('worm idle')
        this.scene.gui.showWindow('worm')
    }
    drawGrid() {
        for (let i = 0; i < map_array.length; i++) {
            for (let j = 0; j < map_array[i].length; j++) {
                const element = map_array[i][j]
            
                gr.strokeRect(j*this.scene.tileSize, i*this.scene.tileSize, this.scene.tileSize, this.scene.tileSize)
            }
        }
    }
    addFogs() {
        const roverPos = this.scene.rover.getTilePos()
        const arr_nofog = this.testFog(roverPos.tileX,roverPos.tileY)
        for (let i = 0; i < map_array.length; i++) {
            fogs.push([])
            for (let j = 0; j < map_array[i].length; j++) {
                const tile = map_array[i][j]
                let newfog
                let addfog = 1
                if(exits_show[0].tileX === j && exits_show[0].tileY === i) {
                    addfog = 0
                    for (let k = 0; k < obj_exits.length; k++) {
                        const obj = obj_exits[k];
                        if(obj != null) {
                            if(obj.tileX === exits_show[0].tileX && obj.tileY === exits_show[0].tileY) {
                                obj.setVisible(true)
                            }
                        }
                    }
                }

                // if(exits_show[1].tileX === j && exits_show[1].tileY === i) addfog = 0
                let ind_fog = -1
                for (let k = 0; k < arr_nofog.length; k++) {
                    const elem = arr_nofog[k];
                    if(elem.tileX === j && elem.tileY === i) ind_fog = k
                }
                if(ind_fog >= 0) addfog = arr_nofog[ind_fog].fog

                if(addfog > 0) {
                    newfog = this.scene.add.sprite(this.getTilePosX(j)+this.scene.tileSize/2,this.getTilePosY(i)+this.scene.tileSize/2,'objects','fog')
                        .setAlpha(addfog).setScale(0.99).setDepth(0.2)
                    this.scene.cam2.ignore(newfog)  
                    fogs[i].push(newfog)
                    
                } else {
                    this.showObj(j,i,0)
                    fogs[i].push(null)
                }
            }
        }
    }
    testFog(rx,ry,scan) {
        const arr = [{tileX:rx,tileY:ry,fog:0}]
        let leftT = 1, leftD = 1,rightT = 1,rightD = 1
        if(map_array[ry][rx-1] != null) { arr.push({tileX:rx-1,tileY:ry,fog:0}); if(map_array[ry][rx-1] < 1) { leftT -= 0.5;leftD -= 0.5;} }
        if(map_array[ry][rx+1] != null) { arr.push({tileX:rx+1,tileY:ry,fog:0}); if(map_array[ry][rx+1] < 1) {rightT -= 0.5;rightD -= 0.5;} }
        if(map_array[ry-1][rx] != null) { arr.push({tileX:rx,tileY:ry-1,fog:0}); if(map_array[ry-1][rx] < 1) {leftT -= 0.5;rightT -= 0.5;} }
        if(map_array[ry+1][rx] != null) { arr.push({tileX:rx,tileY:ry+1,fog:0}); if(map_array[ry+1][rx] < 1) {leftD -= 0.5;rightD -= 0.5;} }

        if(scan) { leftT = 0, leftD = 0,rightT = 0,rightD = 0 }

        if(map_array[ry-1][rx-1] != null) { arr.push({tileX:rx-1,tileY:ry-1,fog:leftT}); }
        if(map_array[ry+1][rx+1] != null) { arr.push({tileX:rx+1,tileY:ry+1,fog:rightD}); }
        if(map_array[ry-1][rx+1] != null) { arr.push({tileX:rx+1,tileY:ry-1,fog:leftD}); }
        if(map_array[ry+1][rx-1] != null) { arr.push({tileX:rx-1,tileY:ry+1,fog:rightT}); }

        if(scan) {
            for(let i = 0; i < 4; i++) {
                for(let j = 0; j < 4; j++) {
                    if( rx-i >= 0 && ry-j >= 0) if(map_array[ry-j][rx-i] != null) { arr.push({tileX:rx-i,tileY:ry-j,fog:0}); }
                    if( ry-j >= 0) if(map_array[ry-j][rx+i] != null) { arr.push({tileX:rx+i,tileY:ry-j,fog:0}); }
                    if( rx-i >= 0 && ry+j < map_array.length) if(map_array[ry+j][rx-i] != null) { arr.push({tileX:rx-i,tileY:ry+j,fog:0}); }

                    if( ry+j < map_array.length) if(map_array[ry+j][rx+i] != null) { arr.push({tileX:rx+i,tileY:ry+j,fog:0}); }
                }
            }
            if(map_array[ry][rx-2] != null) { arr.push({tileX:rx-2,tileY:ry,fog:leftT}); }
            if(map_array[ry][rx-3] != null) { arr.push({tileX:rx-3,tileY:ry,fog:leftT}); }
            if(map_array[ry][rx+2] != null) { arr.push({tileX:rx+2,tileY:ry,fog:rightD}); }
            if(map_array[ry][rx+3] != null) { arr.push({tileX:rx+3,tileY:ry,fog:rightD}); }

            if(map_array[ry-1][rx-2] != null) { arr.push({tileX:rx-1,tileY:ry-2,fog:leftT}); }
            if(map_array[ry+1][rx+1] != null) { arr.push({tileX:rx+1,tileY:ry+1,fog:rightD}); }
            if(map_array[ry-1][rx+1] != null) { arr.push({tileX:rx+1,tileY:ry-1,fog:leftD}); }
            if(map_array[ry+1][rx-1] != null) { arr.push({tileX:rx-1,tileY:ry+1,fog:rightT}); }
        }

        return arr
    }
    delFogs(roverPos,delayTw = 0,scan = false) {
        const arr_nofog = this.testFog(roverPos.tileX,roverPos.tileY,scan)
        const fortween = []
        if(fogs.length > 0) {
            const ty = roverPos.tileY
            const tx = roverPos.tileX
            for (let i = 0; i < fogs.length; i++) {
                for (let j = 0; j < fogs[i].length; j++) {
                    if(i >= 0 && j >= 0) {
                        let ind_fog = -1
                        let addfog = 1
                        for (let k = 0; k < arr_nofog.length; k++) {
                            const elem = arr_nofog[k];
                            if(elem.tileX === j && elem.tileY === i) {ind_fog = k;break;}
                        }
                        if(ind_fog >= 0) addfog = arr_nofog[ind_fog].fog
        
                        if(addfog < 1 ) {
                            if(fogs[i][j] != null) {
                                this.showObj(j,i,delayTw)
                                fortween.push(fogs[i][j])
                                fogs[i][j] = null
                            }
                        }
                    }
                }
            }
        }
        this.scene.tweens.add({targets: fortween,alpha: 0,duration: 1000,ease: 'Quad.Out',delay: delayTw,onComplete: (tw,trgts) => trgts.forEach((elem) => elem.destroy())})
    }
    showObj(tx,ty,delayTw = 0) {
        const fortween = []
        for (let i = 0; i < obj_res.length; i++) {
            const res = obj_res[i]
            if(res.tileX === tx && res.tileY === ty) {
                if(res != null) {
                    if(res.visible === false) {
                        res.setAlpha(0).setVisible(true)
                        fortween.push(res)
                    }
                }
            }
        }
        for (let i = 0; i < obj_exits.length; i++) {
            const res = obj_exits[i]
            if(res.tileX === tx && res.tileY === ty) {
                if(res != null) {
                    if(res.visible === false) {
                        res.setAlpha(0).setVisible(true)
                        fortween.push(res)
                    }
                }
            }
        }
        this.scene.tweens.add({targets: fortween,alpha: 1,duration: 1000,ease: 'Quad.Out',delay: delayTw})
    }
    deleteAll() {
        this.tileMap.destroy()
        gr.destroy()

        obj_exits.forEach((elem) => {if(elem != null) elem.destroy()} )
        obj_res.forEach((elem) => {if(elem != null) elem.destroy()} )
        fogs.forEach((elem) => {if(elem != null) elem.forEach((elem2) => {if(elem2 != null) elem2.destroy()} )})
        

    }
    resetMap() {
        map_array = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [-1,0,0,0,0,0,0,1,1,1,1,0,0,1,0,0,0,0,0,0,0],
            [1,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,-1],
            [1,1,1,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,1,1],
            [1,1,1,1,1,0,0,0,1,1,1,0,0,0,1,0,0,0,0,1,1],
            [1,1,0,0,0,0,0,0,1,1,0,0,0,1,1,0,0,1,1,1,1],
            [1,1,0,0,0,1,0,1,1,1,0,0,1,1,0,0,0,0,0,1,1],
            [1,1,0,0,0,1,1,1,0,0,0,0,0,2,0,1,0,0,0,1,1],
            [1,1,1,0,0,0,0,1,0,0,1,0,1,1,1,0,0,0,1,1,1],
            [1,1,1,1,1,0,0,1,0,0,1,1,1,0,0,0,0,0,0,1,1],
            [1,1,1,1,1,0,0,1,0,0,1,0,0,0,0,1,1,0,1,1,1],
            [0,0,0,1,1,0,0,0,0,0,2,0,0,1,1,0,0,0,1,0,0],
            [-1,0,0,0,0,0,0,0,0,1,1,0,1,1,1,0,0,0,0,0,-1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ]        
    }
    createAnim(scene) {
        // scene.anims.create({ key: 'exit anim', frames: 'exit sign/', frameRate: 24,repeat:-1 })
        scene.anims.create({
            key: 'exit anim',
            frames: scene.anims.generateFrameNames('objects',{ prefix: 'exit sign/', start:1,end: 24, zeroPad: 4 }),
            frameRate: 24,
            repeat:-1
        })
        scene.anims.create({
            key: 'worm appearance',
            frames: scene.anims.generateFrameNames('worm',{ prefix: 'appearance/worm_ani_', start:0,end: 89, zeroPad: 3 }),
            frameRate: 35
        })
        scene.anims.create({
            key: 'worm idle',
            frames: scene.anims.generateFrameNames('worm',{ prefix: 'idle/worm_idle_', start:0,end: 28, zeroPad: 2 }),
            frameRate: 29,
            repeat:-1
        })
        scene.anims.create({
            key: 'worm leaving',
            frames: scene.anims.generateFrameNames('worm',{ prefix: 'leaving/worm_ani_', start:127,end: 157, zeroPad: 3 }),
            frameRate: 30
        })
    }
}