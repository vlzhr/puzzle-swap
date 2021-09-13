import React from "react";
import axios from 'axios';
import {tokenDecimals, tokenIds, tokenNames, tokenShares} from "./App";
import classNames from "classnames";
import ModalWindow from "./AuthInterface";
export const API_URL = 'https://wavesducks.wavesnodes.com'

interface IState{
    data: Map<any, any>;
    tokenOut: number;
    amountIn: number;
}

interface IProps{}

export interface IContractStateKey{
    key: string;
    value: number | boolean | string;
    type: 'integer' | 'string' | 'boolean';
}

export class SwapInterface extends React.Component<IProps, IState>{

    constructor(props: any) {
        super(props);
        this.state = {
            data: new Map<any, any>(),
            tokenOut: 0,
            amountIn: 0
        }
    }

    async componentDidMount() {
        setInterval(async () => {
            const s = await this.downloadState()
            this.setState({
                data: s
            })
        }, 1000);
    }

    async downloadState(){
        const data: Array<IContractStateKey> = (await axios.get(`${API_URL}/addresses/data/3PL3TvgimsLFWs3xW4kpVmvRf3c8HX7JMS7`)).data;
        const dataMap = new Map();
        data.forEach((kv) => {
            dataMap.set(kv.key, kv.value);
        });
        return dataMap
    }

    calculateCurrentPrice(t1: number, t2: number){
        return  Math.round(10000 * (this.state.data.get("global_"+[tokenIds[t1]]+"_balance") / 0.5 / tokenDecimals[t1]) /
                (this.state.data.get("global_"+[tokenIds[t2]]+"_balance") / 0.5 / tokenDecimals[t2])) / 10000;
    }

    calculateAmountOut(){
        const tokenOut = this.state.tokenOut
        const tokenIn = this.state.tokenOut === 0 ? 1 : 0;
        const BalanceIn = this.state.data.get("global_"+[tokenIds[tokenIn]]+"_balance")
        const BalanceOut = this.state.data.get("global_"+[tokenIds[tokenOut]]+"_balance")

        const amountOut = BalanceOut / tokenDecimals[tokenOut] *
            (1 - (BalanceIn / (BalanceIn + tokenDecimals[tokenIn] * this.state.amountIn))
            ** (tokenShares[tokenIn] / tokenShares[tokenOut]))
        return Math.round(amountOut * tokenDecimals[tokenOut]) / tokenDecimals[tokenOut]
    }

    calculateLiquidity() {
        return Math.floor(
            100* (this.state.data.get("global_"+[tokenIds[0]]+"_balance") * 1 / tokenDecimals[0] +
            this.state.data.get("global_"+[tokenIds[1]]+"_balance") * this.calculateCurrentPrice(1, 0) / tokenDecimals[1])) / 100;

    }

    getTokenIn() {
        return this.state.tokenOut === 0 ? 1 : 0
    }

    handleInput(e: any) {
        const floatVal = parseFloat(e.target.value);
        const value = !isNaN(floatVal) ? floatVal : 0;
        this.setState({
            amountIn: value
        });
    }

    render(){
        return <div className="swap-window">
            <div className="choose">
                <div className={classNames("choose-option", {"chosen": this.state.tokenOut === 0})} onClick={() => this.setState({tokenOut: 0})}>
                    USDN to STREET: {this.calculateCurrentPrice(0, 1)}</div>
                <div className={classNames("choose-option", {"chosen": this.state.tokenOut === 1})} onClick={() => this.setState({tokenOut: 1})}>
                    STREET to USDN: {this.calculateCurrentPrice(1, 0)}</div>
            </div>
            <div>
                <input onChange={(e) => this.handleInput(e)} type="text" placeholder={tokenNames[this.getTokenIn()]+" amount"}/>
                <div>You will receive {this.calculateAmountOut()} {tokenNames[this.state.tokenOut]}</div>
                {/*<button onClick={() => this.swap()}>Exchange</button>*/}
                <ModalWindow txData={
                    {
                        pmt: {assetId: tokenIds[this.getTokenIn()], amount: this.state.amountIn * tokenDecimals[this.getTokenIn()]},
                        tokenOut: tokenIds[this.state.tokenOut]
                    }
                }/>
            </div>
            <div className="pool-data">
                Pool liquidity: ${this.calculateLiquidity()}
            </div>
        </div>
    }
}