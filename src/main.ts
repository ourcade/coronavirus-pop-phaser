import 'regenerator-runtime'

import Phaser from 'phaser'

import SceneKeys from './consts/SceneKeys'
import registerScenes from './registerScenes'

import config from './config'

const game = new Phaser.Game(config)

registerScenes(game)

game.scene.start(SceneKeys.Bootstrap)
