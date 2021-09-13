import { Signer } from '@waves/signer';
import { ProviderWeb } from '@waves.exchange/provider-web';
import {ProviderCloud} from "@waves.exchange/provider-cloud";


export class SignerWebHandler {
    public signer: any;

    constructor() {
        this.signer = new Signer({
            NODE_URL: 'https://nodes.wavesnodes.com'
        });
        this.signer.setProvider(new ProviderWeb('https://waves.exchange/signer/'));
    }
}

export class SignerEmailHandler {
    public signer: any;

    constructor() {
        this.signer = new Signer();
        this.signer.setProvider(new ProviderCloud());
    }
}


export const signerWeb = new SignerWebHandler();
export const signerEmail = new SignerEmailHandler();

