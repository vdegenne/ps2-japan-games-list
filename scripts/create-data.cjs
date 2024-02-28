const https = require('https');
const {JSDOM} = require('jsdom');
const {writeFile} = require('fs/promises');
const {join} = require('path');

async function main() {
	const document = await fetchDocument(
		'https://archive.org/download/rr-sony-playstation-j3/japan/iso/',
	);
	const names = [
		...document.documentElement
			.querySelector('tbody')
			.querySelectorAll('a:first-of-type'),
	]
		.map((el) => el.textContent.trim().replace(/\.7z$/, ''))
		.slice(1);

	await writeFile(
		join(__dirname, '../src/games-list.json'),
		JSON.stringify(names),
	);
}

main();

function fetchDocument(url) {
	return new Promise((resolve, reject) => {
		https
			.get(url, (res) => {
				let data = '';

				// A chunk of data has been received.
				res.on('data', (chunk) => {
					data += chunk;
				});

				// The whole response has been received.
				res.on('end', () => {
					// Create a DOM-like environment
					const dom = new JSDOM(data);
					// Resolve the promise with the document object
					resolve(dom.window.document);
				});
			})
			.on('error', (err) => {
				reject(err);
			});
	});
}
