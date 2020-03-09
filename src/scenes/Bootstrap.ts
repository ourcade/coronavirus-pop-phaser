import Phaser, { Scene } from 'phaser'

import SceneKeys from '~/consts/SceneKeys'
import GameEvents from '~/consts/GameEvents'
import ElementKeys from '~/consts/ElementKeys'

export default class Bootstrap extends Phaser.Scene
{
	preload()
	{
		this.game.events.once(GameEvents.PreloadFinished, this.handlePreloadFinished, this)
	}

	create()
	{
		this.resize()

		this.scene.run(SceneKeys.Preload)

		const x = this.scale.width * 0.5
		const y = this.scale.height * 0.5

		this.add.text(x, y, 'Loading...')
			.setOrigin(0.5, 0.5)
	}

	private handlePreloadFinished()
	{
		this.scene.stop(SceneKeys.Preload)
		console.log('preload finished')

		this.scene.start(SceneKeys.TitleScreen)
	}

	private resize()
    {
		const container = document.getElementById(ElementKeys.ContainerId)!
        let w = container.clientWidth * window.devicePixelRatio
        let h = container.clientHeight * window.devicePixelRatio
		
		this.scale.resize(w, h)
    }
}
