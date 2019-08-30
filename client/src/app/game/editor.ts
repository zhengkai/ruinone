import { Application, Container, Graphics, Rectangle } from 'pixi.js';
import { GameService } from './game.service';

export interface Grid {
	x: number;
	y: number;
	id: number;
	c: Container;
	select: Graphics;
}

export class Editor {

	game: GameService;

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
	}

	init(game: GameService) {

		this.game = game;

		const s = game.screen;
		const gs = s.gridSize;

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
		this.refreshMap();
	}

	refreshMap() {
		for (const a of this.mapGrid) {
			this.putGrid(a);
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

	putGrid(o: Grid) {

		const x = o.x - this.pos.x;

		const y = - (o.y - this.pos.y);

		const gs = this.game.screen.gridSize / 2;

		o.c.position.x = (gs + 3) * x;
		o.c.position.y = (gs + 3) * y;
	}

	genGrid(x: number, y: number) {

		if (x === 0 && y === 0) {
			return;
		}

		const gs = this.game.screen.gridSize / 2;

		const c = new Container();

		const select = (new Graphics())
			.beginFill(0xddeeff)
			.drawRect(0, 0, gs, gs);
		select.visible = false;
		select.zIndex = 1;
		c.addChild(select);

		const o = {
			x,
			y,
			id: x * this.size.w + y,
			c,
			select,
		} as Grid;

		c.interactive = true;
		c.hitArea = new Rectangle(0, 0, gs, gs);

		const cover = (new Graphics())
			.beginFill(0xccffff)
			.drawRect(0, 0, gs, gs);
		cover.alpha = 0.1;
		cover.zIndex = 1000;

		c.addChild(cover);

		this.map.addChild(o.c);
		this.mapGrid.push(o);

		c.on('pointerdown', (d) => {
			const e = d.data.originalEvent;
			const rightMouse = e.which === 3 || e.button === 2;
			this.clickGrid(o, rightMouse);
		});

		c.on('pointerover', (d) => {
			cover.alpha = 0.3;
		});

		c.on('pointerout', (d) => {
			cover.alpha = 0.1;
		});
	}

	clickGrid(o: Grid, rightMouse: boolean) {
		o.select.visible = !rightMouse;
		this.saveMap();
	}
}
