/**
 * Common Functions
 *
 * @author Takuto Yanagida
 * @version 2022-07-23
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

function relativeOffsetTop(ancestor, target) {
	return target.getBoundingClientRect().top - ancestor.getBoundingClientRect().top;
}

function getCmsBarHeight() {
	return parseFloat(getComputedStyle(document.documentElement).marginTop);
}
