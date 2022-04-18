import React, { useEffect, useState, useContext } from "react";

import { AppContext } from '../src/index';

import styles from "./styles/prices.module.css";

const Prices = ({ container }) => {

	const [data, updateData] = useState();
	const {state, updateState} = useContext(AppContext);

	useEffect(() => {
		fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1")
		.then(res => res.json())
		.then(res => updateData(
			res.map(({ id, image, name, current_price, price_change_percentage_24h }, index) => {
				return (
					<>
						<div className={ styles.container } key={ index } onClick={ () => { updateState({ type: "update", name: id, shown: true }); } }>
							<img className={ styles.image } src={ image.replace("large", "small") }/>
							<h3 className={ styles.name }>{ name }</h3>
							<h3 className={ styles.price } style={{ color: parseFloat(price_change_percentage_24h.toFixed(2)) > 0 ? "green" : parseFloat(price_change_percentage_24h.toFixed(2)) < 0 ? "red" : "grey" }}>{ `$${ current_price == 0 ? current_price : current_price >= 100 ? Math.round(current_price) : current_price >= 0.1 ? current_price.toFixed(2) : current_price.toPrecision(2) }` }</h3>
							<h4 className={ styles.percentage } style={{ color: parseFloat(price_change_percentage_24h.toFixed(2)) > 0 ? "green" : parseFloat(price_change_percentage_24h.toFixed(2)) < 0 ? "red" : "grey" }}>{ `${ parseFloat(price_change_percentage_24h.toFixed(2)) }%` }</h4>
						</div>
						{
							index != 19 ? <div className={ styles.line }/> : null
						}
					</>
					
				);
			})
		));
	}, []);

	return (
		<div id={ styles.container } ref={ container }>
			{ data }
		</div>
	);
};

export default Prices;