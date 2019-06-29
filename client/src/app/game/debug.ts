import { Application, Container, Text, Graphics, TextStyle } from 'pixi.js';

export class Debug {

	container = new Container();

	prevFPS = '';
	prevFPSCount = 0;
	prevFPSText: Text;

	prevSize = '';
	prevSizeText: Text;

	style = new TextStyle({
		fontFamily: 'Roboto Mono',
		fontSize: 12,
		fill: 0xeeeee,
		align: 'right',
	});

	constructor(private app: Application) {
		app.stage.addChild(this.container);
	}

	run() {

		const app = this.app;
		const c = this.container;
		c.position.x = app.screen.width - 6;
		c.position.y = 6;

		this.drawFPS();
		this.drawSize();
	}

	drawSize() {
		const sc = this.app.screen;
		const s = 'Size: ' + sc.width + 'x' + sc.height;
		if (this.prevSize === s) {
			return;
		}
		this.prevSize = s;

		const c = this.container;

		if (this.prevFPSText) {
			c.removeChild(this.prevSizeText);
		}
		const size = new Text(s, this.style);
		size.anchor.x = 1;
		size.pivot.y = -12;
		c.addChild(size);
		this.prevSizeText = size;
	}

	drawFPS() {

		this.prevFPSCount++;
		if (this.prevFPSCount < 20) {
			return;
		}
		this.prevFPSCount = 0;

		const s = 'FPS: ' + this.app.ticker.FPS.toFixed(1);
		if (this.prevFPS === s) {
			return;
		}
		this.prevFPS = s;

		const c = this.container;

		if (this.prevFPSText) {
			c.removeChild(this.prevFPSText);
		}
		const fps = new Text(s, this.style);
		fps.anchor.x = 1;
		c.addChild(fps);
		this.prevFPSText = fps;
	}
}
