import SceneKeys from '~/consts/SceneKeys'

import TitleScreen from './scenes/TitleScreen'
import Bootstrap from './scenes/Bootstrap'
import Preload from './scenes/Preload'
import Game from './scenes/Game'

const registerScenes = (game: Phaser.Game) => {
	const scene = game.scene
	scene.add(SceneKeys.Bootstrap, Bootstrap)
	scene.add(SceneKeys.Preload, Preload)
	scene.add(SceneKeys.TitleScreen, TitleScreen)
	scene.add(SceneKeys.Game, Game)
}

export default registerScenes
