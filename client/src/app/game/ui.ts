import { Application, Container, Text, Graphics } from 'pixi.js';
import { GamePart } from './game.part';
import { Camera } from './camera';

export class UI extends GamePart {

	config = [
		{
			key: 'pause',
			text: 'Pause',
			bold: true,
			fontSize: 0.5,
			bg: 0xaa5500,
			w: 3,
			h: 1,
			position: 'center',
			hide: true,
		},
	];

	pause = new Container();

	init() {
		this.drawAll();
	}

	drawAll() {
		for (const c of this.config) {
			this.drawOne(c);
		}
	}

	drawOne(c: any) {

		const gs = Camera.gridSize;

		const p = this[c.key];

		const w = c.w * gs;
		const h = c.h * gs;

		const fontSize = c.fontSize * gs;

		if (c.hide) {
			p.visible = false;
		}

		const style = {
			fontFamily: 'Roboto',
			fontSize,
			fontWeight: 'bold',
			fill: 0x000000,
			align: 'center',
			stroke: '#ffffff',
			strokeThickness: fontSize / 20,
		};
		if (c.bold) {
			style.fontWeight = 'bold';
		}

		const text = new Text(c.text, style);
		text.anchor.x = 0.5;
		text.anchor.y = 0.5;
		text.position.x = w / 2;
		text.position.y = h / 2;

		const bg = (new Graphics())
			.beginFill(c.bg)
			.drawRect(0, 0, w, h);

		p.addChild(bg);
		p.addChild(text);

		const s = this.n.screen;

		switch (c.position) {

			case 'center':
				p.position.x = - w / 2;
				p.position.y = - h / 2;
				s.center.addChild(p);
				break;

			case 'head':
				s.head.addChild(p);
				break;
		}
	}
}
