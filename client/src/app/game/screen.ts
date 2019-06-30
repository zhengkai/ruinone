import { Application, Container, Text, Graphics, TextStyle } from 'pixi.js';

export class Screen {

	prevW = 1;
	prevH = 1;

	centerW = 1;
	centerH = 1;

	gridSize = 1;

	constructor(private app: Application) {
	}

	run() {
		this.calc();
	}

	calc() {

		const sc = this.app.screen;

		const w = sc.width;
		const h = sc.height;

		if (this.prevW === w && this.prevH === h) {
			return;
		}
		this.prevW = w;
		this.prevH = h;

		const size = Math.min(w / 16, h / 9);
		this.gridSize = Math.floor(size / 2) * 2;

		this.centerW = Math.round(w / 2);
		this.centerH = Math.round(h / 2);

		// console.log('Screen.calc', this.gridSize, this);
	}
}
