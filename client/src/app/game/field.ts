import { Graphics } from 'pixi.js';
import { Screen } from './screen';

export interface FieldDump {
	id: number;
	x: number;
	y: number;
}

export class Field {

	dump: FieldDump;
	graphic: Graphics;

	x = 0;
	y = 0;

	constructor(private screen: Screen) {

		this.x = Math.random() * 5 + 3;

		const w = screen.gridSize;
		const h = screen.gridSize;

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

	draw(x: number, y: number) {

		const gs = this.screen.gridSize;

		const g = this.graphic;
		g.position.x = gs * (this.x - x);
		g.position.y = - gs * (this.y - y);
		// g.position.x = 10;
		// g.position.y = 10;

		// const scale = gs / this.screen.gridSize;
		g.scale.set(1, 1);
	}
}
