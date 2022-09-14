/**
 * Gida Header - Fixed
 *
 * @author Takuto Yanagida
 * @version 2022-09-14
 */


window['GIDA'] = window['GIDA'] ?? {};


window['GIDA'].header_fixed = function (id = null, opts = {}) {
	const CLS_ELM     = 'gida-header';
	const CLS_ELM_TOP = 'gida-header-top';

	const CLS_STICKY   = 'sticky';
	const CLS_FLOATING = 'floating';
	const CLS_OFFSET   = 'offset';

	const minWindowWidth      = opts['minWindowWidth']      ?? 600;
	const maxHeaderHeightRate = opts['maxHeaderHeightRate'] ?? 0.2;
	const minSwitchingOffset  = opts['minSwitchingOffset']  ?? 100;
	const minSwitchingTime    = opts['minSwitchingTime']    ?? 200;
	const scrollPaddingOffset = opts['scrollPaddingOffset'] ?? 8;
	const margin              = opts['margin']              ?? 100;

	let elm;
	let elmTop;

	let isEnabled     = false;
	let cmsBarHeight  = 0;
	let lastSwitchedY = 0;
	let lastSwitchedT = Number.MAX_SAFE_INTEGER;
	let origTop       = 0;
	let origMid       = 0;
	let offsetTop     = 0;

	let safePaddingOffset = 0;
	let lvh               = 0;
	let svh               = 0;
	let lastResizedWidth  = 0;

	const isIos = null !== navigator.userAgent.match(/iPad|iPhone|iPod/) || (navigator.platform === 'MacIntel' && 1 < navigator.maxTouchPoints);


	// -------------------------------------------------------------------------


	// @include __scroll-padding-top.js
	// @include _common.js


	// -------------------------------------------------------------------------


	onLoad(() => {
		initializeScrollPaddingTop();

		elm = id ? document.getElementById(id) : document.getElementsByClassName(CLS_ELM)[0];
		if (!elm) return;
		elmTop = elm.getElementsByClassName(CLS_ELM_TOP)[0] ?? elm;

		onResize(onResizeHandler, true);
		onScroll(update, true);

		scrollToHash();
	});

	function onResizeHandler() {
		if (lastResizedWidth !== window.innerWidth) {
			[lvh, svh] = isIos ? getViewHeight() : [window.innerHeight, window.innerHeight];
			lastResizedWidth = window.innerWidth;
		}
		setEnabled(isStickable());
		if (isEnabled) {
			cmsBarHeight = getCmsBarHeight();
			adjustFloating();
			update(true);
		}
	}

	function setEnabled(flag) {
		if (flag === isEnabled) return;
		if (flag) {
			elm.classList.add(CLS_STICKY);
			elm.style.position = 'sticky';
		} else {
			elm.classList.remove(CLS_STICKY, CLS_FLOATING, CLS_OFFSET);
			elm.style.position = null;
			elm.style.top      = null;

			setScrollPaddingTop('gida-header', null);
		}
		isEnabled = flag;
	}

	function adjustFloating() {
		const r  = getStaticBoundingClientRect(elm);
		const rh = remainingHeight(elm, elmTop);

		origTop   = r.top + window.scrollY;
		origMid   = r.top + window.scrollY + rh;
		offsetTop = Math.ceil(cmsBarHeight - rh);

		safePaddingOffset = Math.ceil(r.bottom + window.scrollY + scrollPaddingOffset);
	}

	function update(force = false) {
		if (!isEnabled) return;
		setFloating(10 < window.pageYOffset);
		setOffset(origMid + margin <= window.scrollY + cmsBarHeight, force);

		setTimeout(() => {
			let po = safePaddingOffset;
			if (elm.classList.contains(CLS_OFFSET)) {
				po = Math.ceil(elm.getBoundingClientRect().height + offsetTop + scrollPaddingOffset);
			}
			setScrollPaddingTop('gida-header', po + (lvh - svh));
		}, 0);
	}

	function setFloating(flag) {
		if (elm.classList.contains(CLS_FLOATING) === flag) return;
		if (flag) {
			elm.classList.add(CLS_FLOATING);
		} else {
			elm.classList.remove(CLS_FLOATING);
		}
	}

	function setOffset(flag, force) {
		if (!force) {
			if (elm.classList.contains(CLS_OFFSET) === flag) return;
			if (Math.abs(lastSwitchedY - window.scrollY) <= minSwitchingOffset) return;
			lastSwitchedY = window.scrollY;
			if (Math.abs(lastSwitchedT - performance.now()) <= minSwitchingTime) return;
			lastSwitchedT = performance.now();
		}
		if (flag) {
			elm.classList.add(CLS_OFFSET);
			elm.style.top = offsetTop + 'px';
		} else {
			elm.classList.remove(CLS_OFFSET);
			elm.style.top = origTop + 'px';
		}
	}


	// Common ------------------------------------------------------------------


	function isStickable() {
		if (window.innerWidth < minWindowWidth) return false;
		if (svh * maxHeaderHeightRate < elmTop.clientHeight) return false;
		return true;
	}

};
