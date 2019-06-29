import { Component, ElementRef } from '@angular/core';
import { Application } from 'pixi.js';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	app: any;
	title = 'RuinOne';

	constructor(private el: ElementRef) {
		this.app = new Application({
			width: 800,
			height: 600
		});

		el.nativeElement.appendChild(this.app.view);

		console.log('yes rpg', this.app);
		this.run();
	}

	run() {
		const a = this.app;

		a.renderer.backgroundColor = 0x061639;
	}
}
