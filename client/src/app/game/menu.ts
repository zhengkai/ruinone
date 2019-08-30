import { Application, Container, Text, Graphics, TextStyle, Rectangle } from 'pixi.js';
import { GameService } from './game.service';

export class Menu {

	topMenu: Container;

	game: GameService;

	menuCount = 0;

	gridSize = 10;

	style = new TextStyle();

	constructor() {
	}

	init(game: GameService) {

		this.game = game;

		this.buildTop();
	}

	buildTop() {

		if (this.topMenu) {
			this.topMenu.destroy();
		}

		const g = this.game;
		const s = g.screen;
		const gs = s.gridSize;

		const c = new Container();
		this.topMenu = c;
		this.game.app.stage.addChild(c);

		const margin = gs * 0.2;

		c.zIndex = 300000;
		this.menuCount = 0;

		this.addMenu('Game', () => {
			g.switch('world');
		});
		this.addMenu('Editor', () => {
			g.switch('editor');
		});

		c.position.x = s.centerW - c.width / 2;
		c.position.y = margin;

		// console.log(c.width, c.position.x, s.centerW);
	}

	addMenu(name: string, clickCb: any) {

		const gs = this.game.screen.gridSize / 2;

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
		if (this.game.screen.resize) {
			this.buildTop();
		}
	}
}
