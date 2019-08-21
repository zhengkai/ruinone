import { Application, Container, Text, Graphics, TextStyle } from 'pixi.js';
import { GameService } from './game.service';
import { Input } from './input';

export class Debug {

	head = new Container();
	foot = new Container();

	prevTickText: Text;

	prevFPS = '';
	prevFPSCount = 0;
	prevFPSText: Text;

	prevSizeW = 0;
	prevSizeH = 0;
	prevSizeText: Text;

	prevSignature: Text;

	target: GameService;

	screenReference = [
		{
			name: 'topleft',
			offset: [-8, -4.5],
			pivot: [0, 0],
			gridSize: 1,
			o: null,
		},
		{
			name: 'topright',
			offset: [8, -4.5],
			pivot: [1, 0],
			gridSize: 1,
			o: null,
		},
		{
			name: 'center',
			offset: [-0.5, -0.5],
			pivot: [0, 0],
			gridSize: 1,
			o: null,
		},
		{
			name: 'bottomleft',
			offset: [-8, 4.5],
			pivot: [0, 1],
			gridSize: 1,
			o: null,
		},
		{
			name: 'bottomright',
			offset: [8, 4.5],
			pivot: [1, 1],
			gridSize: 1,
			o: null,
		},
	];

	gamePadButton = [
		{
			key: 'w',
			position: [-1, 0],
			gridSize: 1,
			o: null,
		},
		{
			key: 'e',
			position: [1, 0],
			gridSize: 1,
			o: null,
		},
		{
			key: 'n',
			position: [0, -1],
			gridSize: 1,
			o: null,
		},
		{
			key: 's',
			position: [0, 1],
			gridSize: 1,
			o: null,
		},
		{
			key: 'jump',
			position: [3, 0],
			gridSize: 1,
			o: null,
		},
	];

	style = new TextStyle({
		fontFamily: 'Roboto Mono',
		fontSize: 12,
		fill: 0xeeeeee,
		align: 'right',
	});

	constructor(private app: Application) {
		app.stage.addChild(this.head);
		app.stage.addChild(this.foot);
	}

	run() {

		const s = this.app.screen;

		const h = this.head;
		h.position.x = s.width - 6;
		h.position.y = 6;
		h.zIndex = 100000;

		const f = this.foot;
		f.position.x = s.width - 6;
		f.position.y = s.height - 6;
		f.zIndex = 100000;

		this.drawTick();
		this.drawSignature();
		this.drawFPS();
		this.drawSize();
		this.drawPad();
	}

	drawTick() {

		const s = 'Tick: ' + this.target.world.tick;

		const c = this.head;

		if (this.prevTickText) {
			c.removeChild(this.prevTickText);
			this.prevTickText.destroy();
		}
		const tick = new Text(s, this.style);
		tick.anchor.x = 1;
		tick.position.y = 32;
		c.addChild(tick);
		this.prevTickText = tick;
	}

	drawSize() {
		const sc = this.app.screen;

		const so = this.target.screen;

		if (this.prevSizeW === so.prevW && this.prevSizeH === so.prevH)  {
			return;
		}
		this.prevSizeW = so.prevW;
		this.prevSizeH = so.prevH;

		this.drawPadResize();
		this.drawScreenReference();

		const s = 'Screen: ' + sc.width + 'x' + sc.height  + ', Grid: ' + so.gridSize;
		const c = this.head;

		if (this.prevSizeText) {
			c.removeChild(this.prevSizeText);
			this.prevSizeText.destroy();
		}
		const size = new Text(s, this.style);
		size.anchor.x = 1;
		c.addChild(size);
		this.prevSizeText = size;
	}

	drawSignature() {
		if (this.prevSignature) {
			this.foot.removeChild(this.prevSignature);
			this.prevSignature.destroy();
		}
		const sign = new Text('Ruin.One by Zheng Kai', this.style);
		this.prevSignature = sign;
		sign.anchor.x = 1;
		sign.anchor.y = 1;
		this.foot.addChild(sign);
	}

	drawScreenReference() {

		const so = this.target.screen;
		const gs = so.gridSize;

		for (const r of this.screenReference) {
			if (!r.o) {
				r.gridSize = gs;
				r.o = (new Graphics())
					.beginFill(0xffffff, 0.1)
					.drawRect(0, 0, gs, gs);
				this.app.stage.addChild(r.o);
				r.o.pivot.x = r.pivot[0] * gs;
				r.o.pivot.y = r.pivot[1] * gs;
			}
			r.o.position.x = so.centerW + r.offset[0] * gs;
			r.o.position.y = so.centerH + r.offset[1] * gs;

			const scale = gs / r.gridSize;
			r.o.scale.set(scale, scale);
		}
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

		const c = this.head;

		if (this.prevFPSText) {
			c.removeChild(this.prevFPSText);
			this.prevFPSText.destroy();
		}
		const fps = new Text(s, this.style);
		fps.anchor.x = 1;
		fps.position.y = 16;
		c.addChild(fps);
		this.prevFPSText = fps;
	}

	drawPadResize() {

		const gs = this.target.screen.gridSize;
		const os = gs * 0.3;

		for (const a of this.gamePadButton) {
			// console.log(a);

			if (!a.o) {
				a.gridSize = os;
				a.o = (new Graphics())
					.beginFill(0xffffff)
					.drawRoundedRect(0, 0, os, os, 0.2 * os);
				this.foot.addChild(a.o);
			}

			a.o.position.x = - gs * 3.5 + os * a.position[0] * 0.95;
			a.o.position.y = - gs * 0.8 + os * a.position[1] * 0.95;

			const scale = os / a.gridSize;
			a.o.scale.set(scale, scale);
		}
	}

	drawPad() {
		const i = Input.get();
		for (const b of this.gamePadButton) {
			b.o.alpha = i[b.key] ? 0.8 : 0.3;
		}
	}
}
