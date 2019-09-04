import { Graphics } from 'pixi.js';
import { Screen } from './screen';
import { Camera, CameraDraw } from './camera';

export interface FieldDump {
	id: number;
	x: number;
	y: number;
}

export class Field implements CameraDraw {

	dump: FieldDump;

	graphic: Graphics;
	x = 0;
	y = 0;

	constructor() {
		this.build();
	}

	build() {

		if (this.graphic) {
			this.graphic.destroy();
		}

		const gs = Camera.gridSize;

		const w = gs;
		const h = gs;

		const g = (new Graphics())
			.beginFill(0x99aacc)
			.drawRect(- w / 2, -h, w, h);
		g.zIndex = -100;

		this.graphic = g;
	}

	setDump(a: FieldDump) {
		this.dump = a;
		this.x = a.x;
		this.y = a.y;
	}
}
