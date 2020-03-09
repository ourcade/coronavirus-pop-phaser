declare namespace Phaser.GameObjects
{
	interface GameObjectFactory
	{
		shooter(x: number, y: number, texture: string): IShooter
		ball(x: number, y: number, texture: string, frame?: string): IBall
	}
}
