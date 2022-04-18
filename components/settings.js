import React, { useEffect, useState } from "react";

import styles from "./styles/settings.module.css";

import Sun from "../assets/sun.svg";
import Moon from "../assets/moon.svg";
import Maximize from "../assets/maximize.svg";
import Minimize from "../assets/minimize.svg";

const Settings = () => {

	const [theme, updateTheme] = useState(localStorage.theme ?? "light");
	const [mode, updateMode] = useState(localStorage.mode ?? "expand");

	useEffect(() => {
		localStorage.theme = theme;
		localStorage.mode = mode;
		document.documentElement.style.setProperty("--theme-text", theme == "light" ? "black" : "white");
		document.documentElement.style.setProperty("--theme-background", theme == "light" ? "white" : "#272a2a");
		document.documentElement.style.setProperty("--theme-popup", theme == "light" ? "#BABABA99" : "#00000099");
		document.documentElement.style.setProperty("--theme-title", theme == "light" ? "#7a7a7a" : "#c3c3c3");
		document.documentElement.style.setProperty("--theme-search", theme == "light" ? "#787878" : "white");
		document.documentElement.style.setProperty("--mode-spacing", mode == "expand" ? "5px" : "0");
	}, [mode, theme] )

	return (
		<div id={ styles.container }>
			{
				theme == "light" ? <Moon className={ styles.icon } onClick={ () => { updateTheme(theme == "light" ? "dark" : "light") } }/> : <Sun className={ styles.icon } onClick={ () => { updateTheme(theme == "light" ? "dark" : "light") } }/>
			}
			{
				mode == "expand" ? <Minimize className={ styles.icon } onClick={ () => { updateMode(mode == "expand" ? "contract" : "expand") } }/> : <Maximize className={ styles.icon } onClick={ () => { updateMode(mode == "expand" ? "contract" : "expand") } }/>
			}
		</div>
	);
};

export default Settings;