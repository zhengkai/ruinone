import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
// import { Go } from './go-wasm';

declare const WebAssembly: any;
declare const Go: any;
declare const goFibonacci: any;

@Injectable({
	providedIn: 'root'
})
export class WasmService {

	module: any;

	wasmReady = new BehaviorSubject<boolean>(false);

	constructor() {

		console.log('WasmService load');

		this.instantiateWasm('/assets/main.wasm');
	}

	test() {
		console.log('wasm test');
	}

	private async instantiateWasm(url: string) {
		// fetch the wasm file
		const wasmFile = await fetch(url);
		// console.log('wasmFile', url, wasmFile);

		const source = await wasmFile.arrayBuffer();
		// console.log('source', source);

		const go = new Go();

		const result = await WebAssembly.instantiate(source, go.importObject);

		// console.log('result', result);

		go.run(result.instance);

		for (let i = 1; i < 10; i++) {
			const x = goFibonacci(i);
			console.log('fibonacci', i, x);
		}
	}

	/*
	public fibonacci(input: number): Observable<number> {
		return this.wasmReady.pipe(filter(value => value === true)).pipe(
			map(() => {
				return this.module._fibonacci(input);
			})
		);
	}
	 */
}
