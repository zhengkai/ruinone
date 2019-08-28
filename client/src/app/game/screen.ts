import { Application, Container, Text, Graphics, TextStyle } from 'pixi.js';

export class Screen {

	wasmReady = false;

	head = new Container();
	center = new Container();

	prevW = 1;
	prevH = 1;

	centerW = 1;
	centerH = 1;

	gridSize = 1;

	loadingText: Text;

	demo = false;

	style = new TextStyle({
		fontFamily: 'Roboto Mono',
		fontSize: 24,
		fill: 0xeeeeee,
		align: 'left',
	});

	constructor(private app: Application) {
		this.head.zIndex = 100000;
		this.center.zIndex = 100000;
		app.stage.addChild(this.head);
		app.stage.addChild(this.center);
	}

	run() {
		this.calc();

		if (!this.demo) {
			this.demo = true;
			// this.doDemo();
		}

		if (!this.wasmReady) {
			this.loading();
		}
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

	wasmInit() {
		this.wasmReady = true;
		this.cleanLoading();
	}

	loading() {
		this.cleanLoading();
		this.style.fontSize = this.gridSize / 4;
		const text = new Text('Loading ...', this.style);
		this.head.addChild(text);
		this.loadingText = text;
	}

	cleanLoading() {
		if (this.loadingText) {
			this.head.removeChild(this.loadingText);
			this.loadingText.destroy();
		}
	}
}
