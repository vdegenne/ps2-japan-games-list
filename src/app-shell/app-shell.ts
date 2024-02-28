import {LitElement, html} from 'lit';
import {customElement} from 'lit/decorators.js';
import {withStyles} from 'lit-with-styles';
import styles from './app-shell.css?inline';
import {materialShellLoadingOff} from 'material-shell';
import data from '../games-list.json';
import {googleImagesOpen, googleImagesUrl} from '@vdegenne/links';

@customElement('app-shell')
@withStyles(styles)
export class AppShell extends LitElement {
	firstUpdated() {
		materialShellLoadingOff.call(this);
	}

	render() {
		return html`
			<md-list @click=${this.#handleClick}>
				${data.map(
					(gameName) => html`
						<md-list-item
							href=${googleImagesUrl(`${gameName} PS2 Screenshots`)}
							target="_blank"
						>
							<div slot="headline">${gameName}</div>
							<md-icon-button
								slot="end"
								href="https://archive.org/download/rr-sony-playstation-j3/japan/iso/${encodeURIComponent(
									`${gameName}.7z`,
								)}"
								><md-icon>download</md-icon></md-icon-button
							>
						</md-list-item>
					`,
				)}
			</md-list>
		`;
	}

	#handleClick(event: Event) {
		console.log('lol');
	}
}

declare global {
	interface Window {
		app: AppShell;
	}
	interface HTMLElementTagNameMap {
		'app-shell': AppShell;
	}
}

export const app = window.app; // = new AppShell());
