import Phaser from 'phaser'

import playButton from '~/ui/PlayButton'

export default class HelloWorldScene extends Phaser.Scene
{
	preload()
    {
        
    }

    create()
    {
		const width = this.scale.width
		const height = this.scale.height

		const x = width * 0.5
		const y = height * 0.3

		const fontSize = Math.min(width * 0.13, 225)
        this.add.text(x, y, 'Coronavirus\nPop!', {
			fontSize,
			align: 'center'
		})
		.setOrigin(0.5, 0.5)

		this.add.dom(x, height * 0.7, playButton('Play'))
			.addListener('click').on('click', () => {
				// TODO: go to game scene
			})
    }
}
