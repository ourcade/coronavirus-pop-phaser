import Phaser from 'phaser'

import TextureKeys from '~/consts/TextureKeys'
import GameEvents from '~/consts/GameEvents'
import AudioKeys from '~/consts/AudioKeys'

export default class Preload extends Phaser.Scene
{
	preload()
	{
		this.load.image(TextureKeys.Background, 'assets/game/background.png')
		this.load.image(TextureKeys.Virus, 'assets/game/coronavirus.png')
		this.load.image(TextureKeys.VirusRed, 'assets/game/virus_red.png')
		this.load.image(TextureKeys.VirusGreen, 'assets/game/virus_green.png')
		this.load.image(TextureKeys.VirusBlue, 'assets/game/virus_blue.png')
		this.load.image(TextureKeys.VirusYellow, 'assets/game/virus_yellow.png')
		this.load.image(TextureKeys.VirusParticles, 'assets/game/light_02.png')
		this.load.image(TextureKeys.Shooter, 'assets/game/shooter.png')

		this.load.audio(AudioKeys.MusicLoop, 'assets/game/music/imminent-threat-loop-var.wav')

		this.load.audio(AudioKeys.ShootBall, 'assets/game/sfx/highUp.wav')
		this.load.audio(AudioKeys.AttachToGrid, 'assets/game/sfx/phaserUp5.wav')
		this.load.audio(AudioKeys.ClearMatches, 'assets/game/sfx/threeTone2.wav')
		this.load.audio(AudioKeys.ClearMatchesExtra1, 'assets/game/sfx/powerUp8.wav')
		this.load.audio(AudioKeys.OrphanCleared, 'assets/game/sfx/zap1.wav')
		this.load.audio(AudioKeys.UIClick, 'assets/game/sfx/click_003.wav')
		this.load.audio(AudioKeys.GameOverFoley, 'assets/game/sfx/lowDown.wav')
	}

	create()
	{
		this.sound.play(AudioKeys.MusicLoop, {
			loop: true
		})

		this.game.events.emit(GameEvents.PreloadFinished)
	}
}
