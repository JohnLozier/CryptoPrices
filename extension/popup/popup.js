const colorMode = () => {
	document.querySelector('#light, #dark')?.remove()
	chrome.storage.local.set({'colorTheme' : colorTheme});
	document.querySelector('#color-mode').src = (colorTheme == 'dark' ? '../assets/img/sun.png' : '../assets/img/moon.png');
	let colorThemeCSS = document.createElement("link");
		colorThemeCSS.href = colorTheme + ".css";
		colorThemeCSS.type = "text/css";
		colorThemeCSS.rel = "stylesheet";
		colorThemeCSS.id = colorTheme;
	document.documentElement.appendChild(colorThemeCSS)
}

const spaceMode = () => {
	document.querySelector('#contract, #expand')?.remove();
	chrome.storage.local.set({'spaceTheme' : spaceTheme});
	document.querySelector('#space-mode').src = (spaceTheme == 'contract' ? '../assets/img/expand.png' : '../assets/img/contract.png');
	let spaceThemeCSS = document.createElement("link");
		spaceThemeCSS.href = spaceTheme + ".css";
		spaceThemeCSS.type = "text/css";
		spaceThemeCSS.rel = "stylesheet";
		spaceThemeCSS.id = spaceTheme;
	document.documentElement.appendChild(spaceThemeCSS)
}

chrome.storage.local.get(['colorTheme'], (data) => { colorTheme = (data["colorTheme"] ? data['colorTheme'] : 'light'); colorMode(); })
document.querySelector('#color-mode').addEventListener('click', (e) => {colorTheme = (colorTheme == 'light' ? 'dark' : 'light'); e.target.src = (colorTheme == 'light' ? '../assets/img/moon.png' : '../assets/img/sun.png'); colorMode(); })

chrome.storage.local.get(['spaceTheme'], (data) => { spaceTheme = (data["spaceTheme"] ? data['spaceTheme'] : 'contract'); spaceMode(); })
document.querySelector('#space-mode').addEventListener('click', (e) => {spaceTheme = (spaceTheme == 'contract' ? 'expand' : 'contract'); e.target.src = (spaceTheme == 'contract' ? '../assets/img/expand.png' : '../assets/img/contract.png'); spaceMode(); })

var chart = undefined;

const removeCoinPreview = () => {
	document.querySelectorAll('#coin-preview, #coin-preview-background').forEach(element => {element.classList.add('hidden')});
	document.querySelector('#container').style.filter = "";
	chart?.destroy();
	document.querySelector('#coin-preview-name').innerText = "";
	document.querySelectorAll('.coin-preview-links').forEach(element => {element.href = element.parentNode.style.display = element.children[0].src = ""});
	document.querySelector("#coin-preview-background").removeEventListener('click', removeCoinPreview);
}

const coinPreview = (name) => {
	document.querySelectorAll('#coin-preview, #coin-preview-background').forEach(element => {element.classList.remove('hidden')});
	document.querySelector("#coin-preview-background").addEventListener('click', removeCoinPreview);
	document.querySelector('#container').style.filter = "blur(4px)";
	fetch("https://api.coingecko.com/api/v3/coins/" + name + "?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true").then(result => result.json()).then(data => {
		document.querySelector('#coin-preview-name').innerText = data["name"];
		for (element of document.querySelectorAll('.coin-preview-links')) {
			element.children[0].src = element.id == "homepage" ? data["image"]["small"] : element.id == "subreddit" ? "https://www.redditinc.com/assets/images/site/reddit-logo.png" : "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png";
			element.href = element.id == "homepage" ? data["links"]["homepage"][0] : element.id == "subreddit" ? data["links"]["subreddit_url"] : data["links"]["repos_url"]["github"][0];
			element.parentNode.style.display = element.href.split('/')[4] == "undefined" ? 'none' : '';
		} 

		data["market_data"]["sparkline_7d"]["price"] = data["market_data"]["sparkline_7d"]["price"].map( (element) => {return roundval(element, 3)})
		const keys = Object.keys(data["market_data"]["sparkline_7d"]["price"]).map( () => {return ""})
		chart?.destroy()
		//Animation Modified From https://www.chartjs.org/docs/latest/samples/animations/progressive-line.html
		const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
		const animation = {
			x: {
				type: 'number',
				easing: 'linear',
				duration: 10000 / data.length,
				from: NaN,
				delay(ctx) {
				if (ctx.type !== 'data' || ctx.xStarted) {
					return 0;
				}
				ctx.xStarted = true;
				return ctx.index * 10000 / data.length;
				}
			},
			y: {
				type: 'number',
				easing: 'linear',
				duration: 10000 / data.length,
				from: previousY,
				delay(ctx) {
				if (ctx.type !== 'data' || ctx.yStarted) {
					return 0;
				}
				ctx.yStarted = true;
				return ctx.index * 10000 / data.length;
				}
			}
		};
		chart = new Chart(document.getElementById("coin-preview-chart"), {
			type: 'line',
			data: {
			  	labels: keys,
			  	datasets: [{ 
					data: data["market_data"]["sparkline_7d"]["price"],
					borderColor: data["market_data"]["sparkline_7d"]["price"][0] < data["market_data"]["sparkline_7d"]["price"][data["market_data"]["sparkline_7d"]["price"].length - 1] ? 'green' : data["market_data"]["sparkline_7d"]["price"][0] - data["market_data"]["sparkline_7d"]["price"][data["market_data"]["sparkline_7d"]["price"].length - 1] == 0 ? 'gray' : 'red',
					pointRadius: false,
					pointHoverRadius: false,
					fill: false
				}]
			},
			options: {
				animation,
				scales: {
					xAxes: [{
						display: false,
					}],
					yAxes: [{
						display: false,
					}]
				},
				legend: {
					display: false
				},
				tooltips: {
					mode: 'index',
					axis: 'y',
					intersect: false,
				},
				interaction: {
					mode: 'point'
				},
				padding: 0,
			}
		});
	})
}

//API from https://coingecko.com
fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1").then(result => result.json()).then(data => buildData(data))

const wrapper = document.createElement('div');
	wrapper.className = 'cryptoWrapper';

const wrapperBar = document.createElement('div');
	wrapperBar.className = 'wrapperBar';

const coinTextContainer = document.createElement('div');
	coinTextContainer.className = 'coinTextContainer';

const coinName = document.createElement('h3');
	coinName.className = 'coinName';

const coinPriceUSD = document.createElement('h3');
	coinPriceUSD.className = 'coinPrice';

const coinPerChange = document.createElement('h4');
	coinPerChange.className = 'coinPerChange';

const coinImg = document.createElement('img');
	coinImg.className = 'coinImg';
	coinImg.height = '40';
	coinImg.width = '40';

const roundval = (val, length) => {
	const roundedVal = val.toString().split('.')[0].length > 2 ? val.toString().split('.')[0] : parseFloat(val.toString().split('.')[0]) > 0 ? parseFloat(val).toPrecision(length) : parseFloat(val).toPrecision(length - 1);
	return parseFloat(parseFloat(roundedVal.toString().split('.')[1] == 0 ? roundedVal.toString().split('.')[0] : roundedVal).toFixed(val.toString().length));
}

const createElement = (name, valueusd, perchange, img, id) => {
	coinName.innerText = name;
	coinPriceUSD.innerText = "$" + roundval(valueusd, 3);
	coinPerChange.innerText = roundval(perchange, 2) + "%";
	coinPriceUSD.style.color = coinPerChange.style.color = perchange.toString().split('-').length == 1 ? perchange != 0 ? 'green' : 'gray' : 'red';
	coinImg.src = img;
	wrapper.id = name;
	delayedSelector(wrapper).then(() => {
		document.getElementById(name).addEventListener('click', () => {coinPreview(id)})
	});
	wrapper.appendChild(coinImg);
	coinTextContainer.appendChild(coinName);
	coinTextContainer.appendChild(coinPriceUSD);
	wrapper.appendChild(coinTextContainer);
	wrapper.appendChild(coinPerChange);
}

const buildData = (data) => {
	for (el of data) {
		createElement(el['name'], el['current_price'], el['price_change_percentage_24h'], el['image'], el['id']);
		document.querySelector('#container').appendChild(wrapper.cloneNode(true));
		document.querySelector('#container').appendChild(wrapperBar.cloneNode(true));
	}
}

//modified from https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
const delayedSelector = (selector) => {
	const selectElement = () => {
		return (typeof selector == 'string' ? document.querySelectorAll(selector) : selector);
	}
	return new Promise(resolve => {
		if (selectElement()) {
			return resolve(selectElement());
		}

		const observer = new MutationObserver(mutations => {
			if (selectElement()) {
				resolve(selectElement());
				observer.disconnect();
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	});
}