import { Application, Container, Text, Graphics, TextStyle } from 'pixi.js';
import { GameService } from './game.service';
import { Input } from './input';
import { Camera } from './camera';

export class Debug {

	head = new Container();
	foot = new Container();

	tickText: Text;

	prevFPS = '';
	prevFPSCount = 0;
	prevFPSText: Text;

	prevSizeW = 0;
	prevSizeH = 0;
	sizeText: Text;

	signatureText: Text;

	game: GameService;

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

	init(game: GameService) {
		this.game = game;

		game.app.stage.addChild(this.head);
		game.app.stage.addChild(this.foot);

		this.drawPadResize();
		this.drawScreenReference();
		this.drawSize();
		this.drawSignature();
	}

	constructor() {
	}

	run() {

		const h = this.head;
		h.position.x = Camera.w - 6;
		h.position.y = 6;
		h.zIndex = 100000;

		const f = this.foot;
		f.position.x = Camera.w - 6;
		f.position.y = Camera.h - 6;
		f.zIndex = 100000;

		this.drawTick();
		this.drawFPS();
		this.drawPad();

		if (Camera.resize)  {
			this.drawSize();
		}
	}

	drawTick() {

		const s = 'Tick: ' + this.game.world.tick;

		if (this.tickText) {
			this.tickText.text = s;
			return;
		}

		const tick = new Text(s, this.style);
		tick.anchor.x = 1;
		tick.position.y = 32;
		this.head.addChild(tick);
		this.tickText = tick;
	}

	drawSize() {

		const s = 'Screen: ' + Camera.w + 'x' + Camera.h  + ', Grid: ' + Camera.gridSize;

		if (this.sizeText) {
			this.sizeText.text = s;
			return;
		}
		const size = new Text(s, this.style);
		size.anchor.x = 1;
		this.head.addChild(size);
		this.sizeText = size;
	}

	drawSignature() {
		if (this.signatureText) {
			return;
		}
		const sign = new Text('Ruin.One by Zheng Kai', this.style);
		sign.anchor.x = 1;
		sign.anchor.y = 1;
		this.signatureText = sign;
		this.foot.addChild(sign);
	}

	setDisplay(visible: boolean) {
		for (const r of this.screenReference) {
			if (r.o) {
				r.o.visible = visible;
			}
		}
	}

	drawScreenReference() {

		const gs = Camera.gridSize;

		for (const r of this.screenReference) {
			if (!r.o) {
				r.gridSize = gs;
				r.o = (new Graphics())
					.beginFill(0xffffff, 0.1)
					.drawRect(0, 0, gs, gs);
				this.game.app.stage.addChild(r.o);
				r.o.pivot.x = r.pivot[0] * gs;
				r.o.pivot.y = r.pivot[1] * gs;
			}
			r.o.position.x = Camera.centerX + r.offset[0] * gs;
			r.o.position.y = Camera.centerY + r.offset[1] * gs;

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

		const s = 'FPS: ' + this.game.app.ticker.FPS.toFixed(1);
		if (this.prevFPS === s) {
			return;
		}
		this.prevFPS = s;

		if (this.prevFPSText) {
			this.prevFPSText.text = s;
			return;
		}
		const fps = new Text(s, this.style);
		fps.anchor.x = 1;
		fps.position.y = 16;
		this.head.addChild(fps);
		this.prevFPSText = fps;
	}

	drawPadResize() {

		const gs = Camera.gridSize;
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
