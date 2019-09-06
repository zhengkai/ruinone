import { Application, Container, Graphics, Rectangle } from 'pixi.js';
import { GamePart } from './game.part';
import { Camera } from './camera';

export interface Grid {
	x: number;
	y: number;
	id: number;
	c: Container;
	select: Graphics;
	cover: Graphics;
}

export class Editor extends GamePart {

	pos = {
		x: 15,
		y: 7,
	};

	size = {
		w: 30,
		h: 16,
	};

	mapGrid = Array<Grid>();

	c = new Container();
	map = new Container();

	constructor() {
		super();
		this.c.visible = false;
		this.map.visible = false;
		this.c.zIndex = 300000;
	}

	hide() {
		this.c.visible = false;
		this.map.visible = false;
	}

	show() {
		this.c.visible = true;
		this.map.visible = true;
	}

	run() {
		if (Camera.resize) {
			for (const o of this.mapGrid) {
				this.gridGraphics(o);
			}
		}
	}

	init() {

		const s = this.n.screen;
		s.center.addChild(this.c);
		s.center.addChild(this.map);

		/*
		const bg = (new Graphics())
			.beginFill(0x669966)
			.drawRect(0, 0, gs, gs);

		bg.position.x = 0;
		bg.position.y = 0;

		this.c.addChild(bg);
		 */

		this.matrix();
	}

	matrix() {
		for (let x = 0; x < this.size.w; x++) {
			for (let y = 0; y < this.size.h; y++) {
				this.genGrid(x, y);
			}
		}
		this.loadMap();
	}

	loadMap() {
		const map = this.loadMapStr();
		if (map) {
			let i = 0;
			for (const o of this.mapGrid) {
				o.select.visible = map[i] === '1';
				i++;
			}
		}
	}

	loadMapStr() {
		let map = localStorage.getItem('map');
		if (!map || map.length < 10) {
			map = '00001000000001000000100000000000100000000000000000000000000'
				+ '00000110000000000000011110000000001001111000000000100000000'
				+ '00000000000000000000000000000010000000000000000000000001000'
				+ '00100000000010000110000000000000011100000000000000100000000'
				+ '00000000000000000100000000000000010000010000000001000000000'
				+ '00000010000000000000000000001000000000000000000000001000000'
				+ '00000000000000000100000100000000000000000000000000000000000'
				+ '00000010001000000000000000000000000000000000000000000011100'
				+ '0000010';
		}
		return map;
	}

	saveMap() {
		let s = '';
		for (const a of this.mapGrid) {
			s += a.select.visible ? '1' : '0';
		}
		localStorage.setItem('map', s);
	}

	genGrid(x: number, y: number) {

		if (x === 0 && y === 0) {
			return;
		}

		const c = new Container();

		const o = {
			x,
			y,
			id: x * this.size.w + y,
			c,
		} as Grid;

		c.interactive = true;
		this.gridGraphics(o);

		this.map.addChild(o.c);
		this.mapGrid.push(o);

		c.on('pointerdown', (d) => {
			const e = d.data.originalEvent;
			const rightMouse = e.which === 3 || e.button === 2;
			this.clickGrid(o, rightMouse);
		});

		c.on('pointerover', (d) => {
			o.cover.alpha = 0.3;
		});

		c.on('pointerout', (d) => {
			o.cover.alpha = 0.1;
		});
	}

	gridGraphics(o: Grid) {

		let visible = false;
		if (o.select && o.select.visible) {
			visible = true;
		}

		o.c.removeChildren();

		const gs = Camera.gridSize / 2;

		const select = (new Graphics())
			.beginFill(0xddeeff)
			.drawRect(0, 0, gs, gs);
		select.visible = visible;

		o.c.addChild(select);
		o.select = select;

		o.c.hitArea = new Rectangle(0, 0, gs, gs);

		const cover = (new Graphics())
			.beginFill(0xccffff)
			.drawRect(0, 0, gs, gs);
		cover.alpha = 0.1;
		cover.zIndex = 1000;

		o.c.addChild(cover);
		o.cover = cover;

		o.c.sortChildren();

		const x = o.x - this.pos.x;
		const y = - (o.y - this.pos.y);
		o.c.position.x = (gs + 3) * x;
		o.c.position.y = (gs + 3) * y;
	}

	clickGrid(o: Grid, rightMouse: boolean) {
		o.select.visible = !rightMouse;
		this.saveMap();
	}
}
