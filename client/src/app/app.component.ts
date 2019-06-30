import { Component, ElementRef, HostListener } from '@angular/core';
import { Application } from 'pixi.js';
import { GameService } from './game/game.service';
import { Input } from './game/input';

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

		a.renderer.backgroundColor = 0x112233;
	}

	@HostListener('click', ['$event'])
	click(e) {
		// console.log('mouse click', e);
	}

	@HostListener('window:keydown', ['$event'])
	keyDown(e: KeyboardEvent) {
		Input.key(e.keyCode, true);
		// console.log('keydown', e.keyCode, e);
	}

	@HostListener('window:keyup', ['$event'])
	keyUp(e: KeyboardEvent) {
		Input.key(e.keyCode, false);
		// console.log('keyup', e.keyCode, e);
	}
}
