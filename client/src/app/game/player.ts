import { Graphics } from 'pixi.js';
import { Screen } from './screen';
import { Camera } from './camera';

export interface PlayerDump {
	id: number;
	jumpCount: number;
	x: number;
	y: number;
}

export class Player {

	dump: PlayerDump;
	graphic: Graphics;

	gridSize = 10;

	x = 0;
	y = 0;

	constructor() {

		this.x = Math.random() * 5 + 3;

		const gs = Camera.gridSize;

		this.gridSize = gs;

		const w = gs * 0.7;
		const h = gs * 0.9;

		const g = (new Graphics())
			.beginFill(0xddeeff)
			.drawRoundedRect(- w / 2, -h, w, h, 0.2 * w);

		this.graphic = g;
	}

	setDump(a: PlayerDump) {
		this.dump = a;
		this.x = a.x;
		this.y = a.y;
	}

	draw() {

		Camera.draw(this.graphic, this.x, this.y);

	/*

		const gs = this.screen.gridSize;

		const g = this.graphic;
		g.position.x = gs * (this.x - x);
		g.position.y = - gs * (this.y - y);

		const scale = gs / this.gridSize;
		g.scale.set(scale, scale);
	 */
	}
}
