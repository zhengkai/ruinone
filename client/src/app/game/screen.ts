import { Application, Container, Text, Graphics, TextStyle } from 'pixi.js';

export class Screen {

	wasmReady = false;

	head = new Container();
	center = new Container();

	prevW = 1;
	prevH = 1;

	centerW = 1;
	centerH = 1;

	gridSize = 16;

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

		this.head.position.x = this.gridSize;
		this.head.position.y = this.gridSize / 2;

		this.center.position.x = this.centerW;
		this.center.position.y = this.centerH;
		// console.log('Screen.calc', this.gridSize, this);
	}

	init() {
		this.cleanLoading();
	}

	loading() {

		const size = Math.max(16, Math.round(this.gridSize / 3));

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
