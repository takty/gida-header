/**
 * Common Functions
 *
 * @author Takuto Yanagida
 * @version 2022-09-14
 */


const resizeListeners = [];
const scrollListeners = [];

function onResize(fn, doFirst = false) {
	if (doFirst) fn();
	resizeListeners.push(throttle(fn));
}

function onScroll(fn, doFirst = false) {
	if (doFirst) fn();
	scrollListeners.push(throttle(fn));
}

function onLoad(fn) {
	if ('loading' === document.readyState) {
		document.addEventListener('DOMContentLoaded', fn);
	} else {
		setTimeout(fn, 0);
	}
}


// -----------------------------------------------------------------------------


onLoad(() => {
	window.addEventListener('resize', () => { for (const l of resizeListeners) l(); }, { passive: true });
	window.addEventListener('scroll', () => { for (const l of scrollListeners) l(); }, { passive: true });
});

function throttle(fn) {
	let isRunning;
	function run() {
		isRunning = false;
		fn();
	}
	return () => {
		if (isRunning) return;
		isRunning = true;
		requestAnimationFrame(run);
	};
}


// -----------------------------------------------------------------------------


function getStaticBoundingClientRect(elm) {
	const origPos = elm.style.position;
	elm.style.position = 'static';
	const r = elm.getBoundingClientRect();
	elm.style.position = origPos;
	return r;
}

function remainingHeight(ancestor, target) {
	return target.getBoundingClientRect().top - ancestor.getBoundingClientRect().top;
}

function getCmsBarHeight() {
	return parseFloat(getComputedStyle(document.documentElement).marginTop);
}

function getViewHeight() {
	const el = document.createElement('div');
	const es = document.createElement('div');
	el.style.opacity  = es.style.opacity  = 0;
	el.style.position = es.style.position = 'absolute';
	el.style.height   = '100lvh'
	es.style.height   = '100svh';
	document.body.appendChild(el);
	document.body.appendChild(es);
	const lvh = el.clientHeight;
	const svh = es.clientHeight;
	document.body.removeChild(el);
	document.body.removeChild(es);
	return [lvh, svh];
}


// -----------------------------------------------------------------------------


function scrollToHash() {
	const hash = window.location.hash;
	if (!hash || hash.length < 2 || '#' !== hash[0]) return;
	const t = document.getElementById(hash.substring(1));
	if (!t) return;
	setTimeout(() => {
		const spt = parseInt(document.documentElement.style.scrollPaddingTop, 10);
		window.scrollTo(0, t.getBoundingClientRect().top + window.pageYOffset - spt);
	}, 0);
}
