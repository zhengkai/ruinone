import { Rectangle, Container } from 'pixi.js';

export class Camera {

	static x = 0;
	static y = 0;

	static posChange = false;

	static start = false;

	static prevX = -10000;
	static prevY = -10000;

	static w = 1;
	static h = 1;

	static centerX = 0;
	static centerY = 0;
	static gridSize = 100;

	static screen: Rectangle;

	static resize = true;

	static init(screen: Rectangle) {
		this.screen = screen;
		this.calc();
	}

	static refresh() {
		this.resize = true;
		this.posChange = true;
		this.start = true;
	}

	static calc() {
		const sc = this.screen;

		const w = sc.width;
		const h = sc.height;

		if (this.w === w && this.h === h) {
			this.resize = false;
			return;
		}

		this.resize = true;
		this.w = w;
		this.h = h;

		const size = Math.min(w / 16, h / 9);
		this.gridSize = Math.floor(size / 2) * 2;

		this.centerX = Math.round(w / 2);
		this.centerY = Math.round(h / 2);

		console.log('Camera calc', w, h, this.gridSize, this.centerX, this.centerY);
	}

	static setPos(x: number, y: number) {

		// console.log('Camera.setPos', x, y, this.prevX, this.prevY);

		if (this.prevX === x && this.prevY === y) {
			// console.log('Camera.setPos', false);
			this.posChange = false;
			return;
		}
		this.posChange = true;
		// console.log('Camera.setPos', true);

		this.prevX = x;
		this.prevY = y;

		x = Math.max(6, x);
		y = Math.max(3, y);

		this.x = x;
		this.y = y;
	}

	static draw(o: Container, x: number, y: number) {

		if (!this.start) {
			return;
		}

		const gs = this.gridSize;

		o.position.x = gs * (x - this.x);
		o.position.y = - gs * (y - this.y);

		// console.log('Camera draw', o, this.x, this.y, gs, o.position.x, o.position.x);
	}
}
