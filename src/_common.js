/**
 *
 * Common Functions (JS)
 *
 * @author Takuto Yanagida
 * @version 2021-10-03
 *
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


// -----------------------------------------------------------------------------


document.addEventListener('DOMContentLoaded', () => {
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


function relativeOffsetTop(ancestor, target) {
	return target.getBoundingClientRect().top - ancestor.getBoundingClientRect().top;
}

function getCmsBarHeight() {
	return parseFloat(getComputedStyle(document.documentElement).marginTop);
}
