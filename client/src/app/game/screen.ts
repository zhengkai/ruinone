import { Application, Container, Text, Graphics, TextStyle } from 'pixi.js';

export class Screen {

	wasmReady = false;

	head = new Container();

	prevW = 1;
	prevH = 1;

	centerW = 1;
	centerH = 1;

	gridSize = 1;

	loadingText: Text;

	style = new TextStyle({
		fontFamily: 'Roboto Mono',
		fontSize: 24,
		fill: 0xeeeeee,
		align: 'left',
	});

	constructor(private app: Application) {
		app.stage.addChild(this.head);
	}

	run() {
		this.calc();

		if (!this.wasmReady) {
			this.loading();
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

		const head = this.head;
		head.position.x = this.gridSize;
		head.position.y = this.gridSize / 2;
		head.zIndex = 100000;
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
