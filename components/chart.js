import React, { useEffect } from "react";
import Chartjs from "chart.js/auto";
import Moment from "moment";

import styles from "./styles/chart.module.css";

const Chart = ({ sparkline, shown }) => {

	const canvas = React.useRef();

	shown ? null : Chartjs.getChart(canvas.current)?.destroy();
	
	useEffect(() => {
		if (sparkline) {
			//Animation Modified From https://www.chartjs.org/docs/latest/samples/animations/progressive-line.html
			const animation = {
				x: {
					type: "number",
					easing: "linear",
					duration: 1000 / sparkline.length,
					from: NaN,
					delay(ctx) {
						if (ctx.type !== "data" || ctx.yStarted) return 0;
						ctx.yStarted = true;
						return ctx.index * 1000 / sparkline.length;
					}
				},
				y: {
					type: "number",
					easing: "linear",
					duration: 10000 / sparkline.length,
					from: (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y,
					delay(ctx) {
						if (ctx.type !== "data" || ctx.yStarted) return 0;
						ctx.yStarted = true;
						return ctx.index * 1000 / sparkline.length;
					}
				}
			};

			new Chartjs(canvas.current, {
				type: "line",
				data: {
					labels: Object.keys(sparkline).map(hour => Moment().subtract(167 - hour, "hours").format("MMM Do ha")),
					datasets: [{ 
						data: sparkline,
						borderColor: sparkline[0] < sparkline[sparkline.length - 1] ? "green" : sparkline[0] > sparkline[sparkline.length - 1] ? "red" : "darkgrey",
						pointRadius: false,
						pointHoverRadius: false,
						fill: false,
						lineTension: 0.6
					}]
				},
				options: {
					animation,
					scales: {
						x: {
							display: false
						},
						y: {
							display: false
						}
					},
					plugins: {
						legend: {
							display: false
						},
						tooltip: {
							callbacks: {
							  	label: ({ raw }) => { return `$${ raw }` }
							}
						}
					},
					interaction: {
						axis: "x",
						intersect: false
					},
					aspectRatio: 1
				}
			});
		};
	}, [sparkline]);

	return (
		<canvas id={ styles.chart } ref={ canvas }/>
	);
};

export default Chart;