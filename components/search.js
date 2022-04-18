import React, { useState, useContext } from "react";

import { AppContext } from '../src/index';

import styles from "./styles/search.module.css";

import SearchIcon from "../assets/search.svg";

const Search = ({ container, searchContainer }) => {

	const searchbox = React.useRef();
	const [data, updateData] = useState();
	const {state, updateState} = useContext(AppContext);

	const Submit = (query) => {
		fetch(`https://api.coingecko.com/api/v3/search?query=${ query }`)
			.then(res => res.json())
			.then(res => updateData(
				res.coins.map(({ name, symbol, large, id }, index) => {
					return (
						<>
							<div className={ styles.container } key={ index } onClick={ () => { updateState({ type: "update", name: id, shown: true }); } }>
								<img className={ styles.image } src={ large.replace("large", "small") }/>
								<h3 className={ styles.name }>{ name }</h3>
								<h3 className={ styles.symbol }>{ symbol }</h3>
							</div>
							{
								index != res.coins.length - 1 ? <div className={ styles.line }/> : null
							}
						</>
						
					);
				})
			));
		container.current.style.display = "none";
	};

	const Hide = () => {
		updateData();
		container.current.style.display = "";
	};

	return (
		<div id={ styles.container } ref={ searchContainer }>
			<div id={ styles.searchContainer }>
				<input ref={ searchbox } id={ styles.searchBox } type="text" placeholder="Type to search" onKeyUp={ (e) => { e.key == "Enter" ? searchbox.current?.value != "" ? Submit(searchbox.current?.value) : Hide() : null } }/>
				<SearchIcon id={ styles.search } onClick={ () => { searchbox.current?.value != "" ? Submit(searchbox.current?.value) : Hide() } }/>
			</div>
			<div id={ styles.response }>
				{
					data
				}
			</div>
		</div>
	);
};

export default Search;