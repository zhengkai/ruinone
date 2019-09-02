import { Graphics } from 'pixi.js';
import { Screen } from './screen';
import { Camera, CameraDraw } from './camera';

export interface PlayerDump {
	id: number;
	jumpCount: number;
	x: number;
	y: number;
}

export class Player implements CameraDraw {

	dump: PlayerDump;

	gridSize = 10;

	graphic: Graphics;
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
		g.zIndex = -100;

		this.graphic = g;
	}

	setDump(a: PlayerDump) {
		this.dump = a;
		this.x = a.x;
		this.y = a.y;
	}
}
