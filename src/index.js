import React, { useReducer } from "react";
import { createRoot } from "react-dom/client";

import "./global.css";

import Prices from "../components/prices";
import Overlay from "../components/overlay";
import Settings from "../components/settings";
import Search from "../components/search";

export const AppContext = React.createContext();

const initialState = {
	name: undefined,
	shown: false
};

const Reducer = (state, action) => {
    return action.type == "update" ? { name: action.name, shown: action.shown } : initialState;
}

const Index = () => {

	const [state, updateState] = useReducer(Reducer, initialState);
	const container = React.createRef();
	const searchContainer = React.createRef();

	return (
		<AppContext.Provider value={{ state, updateState }}>
			<Search container={ container } searchContainer={ searchContainer }/>
			<Prices container={ container }/>
			<Overlay container={ container } searchContainer={ searchContainer }/>
			<Settings/>
		</AppContext.Provider>
	);
};

createRoot(document.querySelector("#React-Container")).render(<Index/>);