import { Graphics } from 'pixi.js';

export class Player {

	graphic: Graphics;

	x = 0;
	y = 0;

	speed = 0.1;

	acceleration = 0;

	jumpCount = 2;
	jumpPress = false;

	jump = 0.4;
	fall = 0.02;

	constructor(public gridSize: number) {

		this.x = Math.random() * 5 + 3;

		const w = gridSize * 0.7;
		const h = gridSize * 0.9;

		const g = (new Graphics())
			.beginFill(0xddeeff)
			.drawRoundedRect(- w / 2, -h, w, h, 0.2 * w);

		this.graphic = g;
	}
}
