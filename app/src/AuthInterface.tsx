/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-notifications-component/dist/theme.css'
import {signerEmail, signerWeb} from "./SignerHandler";
import {contractAddress, tokenDecimals, tokenIds} from "./App";
import ReactNotification from 'react-notifications-component'
import { store } from 'react-notifications-component';


function handleExchangePromise(tx: any) {
    store.addNotification({
        title: "Congratulations!",
        message: "You successfully performed an exchange.",
        // "<a target='_blank' href='https://wavesexplorer.com/transaction/"+tx.id+"}'>Swap transaction.</a>",
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {duration: 5000, onScreen: true}
    });
    console.log(tx);
}

function handleExchangeError(error: any) {
    store.addNotification({
        title: "Error while completing exchange!",
        message: JSON.stringify(error),
        type: "danger",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {duration: 5000, onScreen: true}
    });
    console.log(error)
}

function exchangeWithSigner(txData: any, signer: any) {
    return signer
        .invoke({
            dApp: contractAddress,
            fee: 500000,
            payment: [txData.pmt],
            call: {
                function: 'swap',
                args: [
                    { "type": "string", "value": txData.tokenOut },
                    { "type": "integer", "value": 0 }
                ],
            },
        })
        .broadcast()
        .then((tx: any) => handleExchangePromise(tx))
        .catch((error: any) => handleExchangeError(error) );
}

function exchangeWithKeeper(txData: any) {
    return window.WavesKeeper.signAndPublishTransaction({
        type: 16,
        data: {
            "fee": { "tokens": "0.05", "assetId": "WAVES" },
            "dApp": contractAddress,
            "call": {
                function: 'swap',
                args: [
                    { "type": "string", "value": txData.tokenOut },
                    { "type": "integer", "value": 0 }
                ],
            }, "payment": [{
                "assetId": txData.pmt.assetId,
                "tokens": txData.pmt.amount / tokenDecimals[tokenIds.indexOf(txData.pmt.assetId)]}]
        }
    })
        .then((tx: any) => handleExchangePromise(tx))
        .catch((error: any) => handleExchangeError(error) );
}

const ModalWindow = (props: any) => {
    let buttonLabel = "Exchange";
    let className = "modal-window";
    const txData = props.txData;

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    return (
        <div>
            <button onClick={toggle}>{buttonLabel}</button>
            <Modal isOpen={modal} toggle={toggle} className={className+" mt-5"}>
                <ModalHeader toggle={toggle}>Authorize with your Waves wallet</ModalHeader>
                <ModalBody className="text-center">
    <div><Button className="mt-4 mb-2" color="success" size="lg"
                 onClick={() => exchangeWithSigner(txData, signerEmail.signer).then(toggle)}>Waves Exchange Email</Button></div>
    <div><Button className="mb-2" color="success" size="lg"
                 onClick={() => exchangeWithSigner(txData, signerWeb.signer).then(toggle)}>Waves Exchange Seed</Button></div>
    <div><Button className="mb-5" color="success" size="lg"
                 onClick={() => exchangeWithKeeper(txData).then(toggle)}>Waves Keeper</Button></div>
                </ModalBody>
            </Modal>
        </div>
);
}

export default ModalWindow;