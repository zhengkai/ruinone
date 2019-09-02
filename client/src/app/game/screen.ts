import { Application, Container, Text, Graphics, TextStyle } from 'pixi.js';
import { Camera } from './camera';

export class Screen {

	head = new Container();
	center = new Container();

	prevW = 1;
	prevH = 1;

	loadingText: Text;

	demo = false;

	style = new TextStyle();

	constructor(private app: Application) {
		this.head.zIndex = 100000;
		this.center.zIndex = 100000;
		app.stage.addChild(this.head);
		app.stage.addChild(this.center);

		this.calc();
		this.loading();
	}

	run() {
		this.calc();

		/*
		if (!this.demo) {
			this.demo = true;
			this.doDemo();
		}
		 */
	}

	doDemo() {

		const c = this.center;

		const height = 100;
		const width = 100;

		const frame = 10;

		for (let x = -1; x <= 1; x += 1 / width) {

			const y = 1 - x * x;

			const g = (new Graphics())
				.beginFill(0xff0000)
				.drawRect((x + 1) * width, y * height, 1, 1);
			// console.log((x + 1) * width, y * height);
			c.addChild(g);
		}
	}

	calc() {

		if (!Camera.resize) {
			return;
		}

		const gs = Camera.gridSize;

		this.head.position.x = gs;
		this.head.position.y = gs / 2;

		this.center.position.x = Camera.centerX;
		this.center.position.y = Camera.centerY;
		// console.log('Screen.calc', this.gridSize, this);
	}

	init() {
		this.cleanLoading();
	}

	loading() {

		const size = Math.max(16, Math.round(Camera.gridSize / 3));

		this.cleanLoading();
		const text = new Text('Loading ...', {
			fontFamily: '"Times New Roman", Times, serif',
			fontSize: size,
			fontWeight: 'bold',
			fill: 0xeeeeee,
		});
		text.position.x = size * 2;
		text.position.y = size;

		this.head.addChild(text);
		this.loadingText = text;
	}

	cleanLoading() {
		if (this.loadingText) {
			this.head.removeChild(this.loadingText);
			this.loadingText.destroy();
			this.loadingText = null;
		}
	}
}
