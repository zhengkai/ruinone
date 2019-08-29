import { Application, Container, Text, Graphics, TextStyle, Rectangle } from 'pixi.js';
import { GameService } from './game.service';

export class Menu {

	topMenu = new Container();

	game: GameService;

	gridSize = 10;

	style = new TextStyle({
		fontFamily: 'Roboto Mono',
		fontSize: 32,
		fill: 0x000000,
		align: 'center',
	});

	constructor() {
	}

	init(game: GameService) {
		game.app.stage.addChild(this.topMenu);
		this.game = game;

		this.topMenu.position.x = 10;
		this.topMenu.position.y = 10;
		this.topMenu.zIndex = 100000;

		this.buildTop();
	}

	buildTop() {
		const a = new Container();
		this.topMenu.addChild(a);
		a.alpha = 0.5;

		// const gs = this.game.screen.gridSize;
		const gs = 64;

		console.log('gs', gs);

		const o = (new Graphics())
			.beginFill(0xffffff)
			.drawRect(0, 0, gs * 5, gs);
		a.addChild(o);
		a.interactive = true;
		a.hitArea = new Rectangle(0, 0, gs * 5, gs);

		const text = new Text('button', this.style);
		text.anchor.x = 0.5;
		text.anchor.y = 0.5;
		text.position.x = gs * 2.5;
		text.position.y = gs * 0.5;
		a.addChild(text);

		a.buttonMode = true;

		a.on('pointerdown', (d) => {
			console.log('click', d);
		});

		a.on('pointerover', (d) => {
			console.log('over', d);
			a.alpha = 1;
		});

		a.on('pointerout', (d) => {
			console.log('out', d);
			a.alpha = 0.5;
		});
	}

	run() {
	}
}
