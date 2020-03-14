import SceneKeys from '~/consts/SceneKeys'

import TitleScreen from './scenes/TitleScreen'
import Bootstrap from './scenes/Bootstrap'
import Preload from './scenes/Preload'
import Game from './scenes/Game'
import GameUI from './scenes/GameUI'
import GameOver from './scenes/GameOver'

const registerScenes = (game: Phaser.Game) => {
	const scene = game.scene
	scene.add(SceneKeys.Bootstrap, Bootstrap)
	scene.add(SceneKeys.Preload, Preload)
	scene.add(SceneKeys.TitleScreen, TitleScreen)
	scene.add(SceneKeys.Game, Game)
	scene.add(SceneKeys.GameUI, GameUI)
	scene.add(SceneKeys.GameOver, GameOver)
}

export default registerScenes
