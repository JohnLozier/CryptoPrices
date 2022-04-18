import React, { useContext, useState, useEffect } from "react";

import styles from "./styles/overlay.module.css";

import { AppContext } from '../src/index';
import Chart from "./chart";

import Github from "../assets/github.svg";
import Reddit from "../assets/reddit.svg";

const Overlay = ({ container, searchContainer }) => {

	const [data, updateData] = useState();
	const {state, updateState} = useContext(AppContext);

	useEffect(() => {
		container.current.style.filter = state.shown ? "blur(5px)" : "";
		searchContainer.current.style.filter = state.shown ? "blur(5px)" : "";
		state.name ? fetch(`https://api.coingecko.com/api/v3/coins/${ state.name }?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`)
			.then(res => res.json())
			.then(({ name, links, market_data, image }) => { updateData({ name, links, market_data, image }) }) : null;
	}, [state])

	return (
		<div id={ styles.alignment } style={{ opacity: state.shown ? "1" : "0", visibility: state.shown ? "visible" : "hidden" }} onClick={ () => { updateState({ type: "update", name: undefined, shown: false }); updateData({ image: { small: "" }, links: { subreddit_url: "", repos_url: { github: [ "" ] }, homepage: [ "" ] }, name: "" }) } }>
			<div id={ styles.container }>
				<h2 id={ styles.name }>{ data?.name }</h2>
				{
					data?.market_data?.price_change_percentage_24h != null || data?.market_data?.price_change_percentage_24h != undefined ? <h5 id={ styles.price } style={{ color: parseFloat(data?.market_data?.price_change_percentage_24h.toFixed(2)) > 0 ? "green" : parseFloat(data?.market_data?.price_change_percentage_24h.toFixed(2)) < 0 ? "red" : "grey" }}>{ `$${ data?.market_data?.current_price.usd == 0 ? data?.market_data?.current_price.usd : data?.market_data?.current_price.usd >= 100 ? Math.round(data?.market_data?.current_price.usd) : data?.market_data?.current_price.usd >= 0.1 ? data?.market_data?.current_price.usd.toFixed(2) : data?.market_data?.current_price.usd.toPrecision(2) }` }</h5> : null
				}
				<Chart sparkline={ data?.market_data?.sparkline_7d.price.map(value => { return value >= 100 ? Math.round(value) : parseFloat(value.toPrecision(3)) }) } shown={ state.shown }/>
				<div id={ styles.links }>
					{ data?.links?.repos_url.github[0] ? <a className={ styles.link } href={ data?.links?.repos_url.github[0] }><Github/></a> : null }
					{ data?.links?.homepage[0] ? <a className={ styles.link } href={ data?.links?.homepage[0] }><img className={ styles.logo } src={ data?.image?.small }/></a> : null }
					{ data?.links?.subreddit_url ? <a className={ styles.link } href={ data?.links?.subreddit_url }><Reddit/></a> : null }
				</div>
			</div>
		</div>
		
	);
};

export default Overlay;
