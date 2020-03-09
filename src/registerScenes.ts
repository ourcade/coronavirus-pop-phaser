import SceneKeys from '~/consts/SceneKeys'

import TitleScreen from './scenes/TitleScreen'

const registerScenes = (game: Phaser.Game) => {
	game.scene.add(SceneKeys.TitleScreen, TitleScreen)
}

export default registerScenes
