declare namespace Phaser.GameObjects
{
	interface GameObjectFactory
	{
		shooter(x: number, y: number, texture: string): IShooter
		ball(x: number, y: number, texture: string, frame?: string): IBall

		ballPool(texture: string, config?: Phaser.Types.Physics.Arcade.PhysicsGroupConfig | Phaser.Types.GameObjects.Group.GroupCreateConfig): IBallPool
		staticBallPool(texture: string, config?: Phaser.Types.Physics.Arcade.PhysicsGroupConfig | Phaser.Types.GameObjects.Group.GroupCreateConfig): IStaticBallPool
	}
}
