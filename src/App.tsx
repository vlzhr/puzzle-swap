import React from 'react';
import './App.css';
import {ExampleClass} from "./ExampleClass";
import {SwapInterface} from "./SwapInterface";
import ReactNotification from "react-notifications-component";

export const tokenIds = [
    "CE5cxMvz7865CyFZPFUmDiL4KRkYXP6b6oYgN3vmWdV5",
    "DG2xFkPdDwKUoBkzGAhQtLpSGzfXLiCYPEzeKH2Ad24p"
]
export const tokenNames = [
    "STREET",
    "USDN"
]
export const tokenShares = [
    0.5,
    0.5
]
export const tokenDecimals = [
    10**8,
    10**6
]
export const contractAddress = "3PL3TvgimsLFWs3xW4kpVmvRf3c8HX7JMS7"

declare global {
    interface Window {
        // add you custom properties and methods
        WavesKeeper: any
    }
}


function App() {
  return (
    <div className="App">
        <header>
            <div><span className="logo">🧩</span>&nbsp;&nbsp;<span>Puzzle Swap</span></div>
        </header>
        <ReactNotification className="notificationWindow"/>
        {/*<ExampleClass helloWord="Привет" clickHandler={() => signer.invoke()} />*/}
        <SwapInterface />

    </div>
  );
}

export default App;
