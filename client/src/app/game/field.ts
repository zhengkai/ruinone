import { Graphics } from 'pixi.js';
import { Screen } from './screen';
import { Camera } from './camera';

export interface FieldDump {
	id: number;
	x: number;
	y: number;
}

export class Field {

	dump: FieldDump;
	graphic: Graphics;

	gridSize = 10;

	x = 0;
	y = 0;

	constructor(private screen: Screen) {

		this.x = Math.random() * 5 + 3;

		const gs = Camera.gridSize;

		this.gridSize = gs;

		const w = gs;
		const h = gs;

		const g = (new Graphics())
			.beginFill(0x99aacc)
			.drawRect(- w / 2, -h, w, h);

		this.graphic = g;
	}

	setDump(a: FieldDump) {
		this.dump = a;
		this.x = a.x;
		this.y = a.y;
	}

	draw() {

		// const gs = Camera.gridSize;

		Camera.draw(this.graphic, this.x, this.y);

		/*
		const g = this.graphic;
		g.position.x = gs * (this.x - x);
		g.position.y = - gs * (this.y - y);

		const scale = gs / this.gridSize;
		g.scale.set(scale, scale);
		 */
	}
}
