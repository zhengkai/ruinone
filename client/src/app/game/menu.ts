import { Application, Container, Text, Graphics, TextStyle, Rectangle } from 'pixi.js';
import { GamePart } from './game.part';
import { Camera } from './camera';

export class Menu extends GamePart {

	topMenu: Container;

	menuCount = 0;

	gridSize = 10;

	style = new TextStyle();

	init() {
		this.buildTop();
	}

	buildTop() {

		if (this.topMenu) {
			this.topMenu.destroy();
		}

		const gs = Camera.gridSize;

		const c = new Container();
		c.zIndex = 300000;
		this.topMenu = c;
		this.n.app.stage.addChild(c);

		const margin = gs * 0.2;

		this.menuCount = 0;

		this.addMenu('Game', () => {
			this.n.switch('world');
		});
		this.addMenu('Editor', () => {
			this.n.switch('editor');
		});

		this.addMenuBg(c);

		c.position.x = Camera.centerX - c.width / 2;
		// console.log('Camera.centerX', Camera.centerX, c.position.x);
		c.position.y = margin;
	}

	addMenuBg(o: Container) {

		const gs = Camera.gridSize / 2;

		const border = gs * 0.2;

		const width = (gs * 3 + border) * this.menuCount - border;

		const bg = (new Graphics())
			.beginFill(0x3d5c3d)
			.drawRect(0, 0, width + border * 2, gs + border * 2);
		bg.zIndex = -10;
		bg.alpha = 0.8;
		bg.position.x = - border;
		bg.position.y = - border;
		bg.interactive = true;

		o.addChild(bg);
		o.sortChildren();
	}

	addMenu(name: string, clickCb: any) {

		const gs = Camera.gridSize / 2;

		const a = new Container();
		this.topMenu.addChild(a);

		const width = gs * 3;

		a.position.x = (width + gs * 0.2) * this.menuCount;
		this.menuCount++;

		const bg = (new Graphics())
			.beginFill(0x669966)
			.drawRect(0, 0, width, gs);
		a.addChild(bg);

		const hover = (new Graphics())
			.beginFill(0xccddcc)
			.drawRect(0, 0, width, gs);
		a.addChild(hover);

		hover.visible = false;

		a.interactive = true;
		a.hitArea = new Rectangle(0, 0, width, gs);

		const text = new Text(name, {
			fontFamily: 'Roboto',
			fontSize: gs / 2,
			fontWeight: 'bold',
			fill: 0x000000,
			align: 'center',
			stroke: '#ffffff',
			strokeThickness: gs / 20,
		});
		text.anchor.x = 0.5;
		text.anchor.y = 0.5;
		text.position.x = width / 2;
		text.position.y = gs / 2;
		a.addChild(text);

		a.buttonMode = true;

		a.on('pointerdown', clickCb);

		a.on('pointerover', (d) => {
			hover.visible = true;
			bg.visible = false;
			// console.log(name, 'over', d);
		});

		a.on('pointerout', (d) => {
			hover.visible = false;
			bg.visible = true;
			// console.log(name, 'out', d);
		});
	}

	run() {
		if (Camera.resize) {
			this.buildTop();
		}
	}
}
