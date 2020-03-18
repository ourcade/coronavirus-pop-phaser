export default interface IShotGuide
{
	showFrom(x: number, y: number, direction: Phaser.Math.Vector2, radius: number, color?: number)
	hide()
}
