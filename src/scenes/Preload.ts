import Phaser from 'phaser'

import TextureKeys from '~/consts/TextureKeys'
import GameEvents from '~/consts/GameEvents'
import WebFontFile from '~/ui/WebFontFile'
import AudioKeys from '~/consts/AudioKeys'

export default class Preload extends Phaser.Scene
{
	preload()
	{
		const fonts = new WebFontFile(this.load, [
			'Nosifer',
			'Lemon',
			'Righteous'
		])

		this.load.addFile(fonts)

		this.load.image(TextureKeys.Virus, 'assets/game/coronavirus.png')
		this.load.image(TextureKeys.VirusParticles, 'assets/game/light_02.png')

		this.load.audio(AudioKeys.MusicLoop, 'assets/game/music/imminent-threat-loop-var.wav')
		this.load.audio(AudioKeys.AttachToGrid, 'assets/game/sfx/phaserUp5.wav')
		this.load.audio(AudioKeys.ClearMatches, 'assets/game/sfx/threeTone2.wav')
		this.load.audio(AudioKeys.ClearMatchesExtra1, 'assets/game/sfx/powerUp8.wav')
		this.load.audio(AudioKeys.OrphanCleared, 'assets/game/sfx/zap1.wav')
	}

	create()
	{
		this.sound.play(AudioKeys.MusicLoop, {
			loop: true
		})

		this.game.events.emit(GameEvents.PreloadFinished)
	}
}
