import { Component, ElementRef } from '@angular/core';
import { Application } from 'pixi.js';
import { GameService } from './game/game.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {

	app: Application;

	title = 'RuinOne';

	constructor(
		private el: ElementRef,
		private game: GameService,
	) {
		this.init();
	}

	init() {

		const app = new Application({
			resolution: window.devicePixelRatio || 1,
			resizeTo: window,
		});
		this.el.nativeElement.appendChild(app.view);
		this.app = app;
		this.game.app = app;

		app.ticker.add((delta) => {
			this.game.tick(delta);
		});

		const a = this.app;

		a.renderer.backgroundColor = 0x061639;
	}
}
