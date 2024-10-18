/*
Bridge contract address: ct_2wP1RMbbEdCTdystsvYx4ZDXMsqFrH72RRrBqbd5JBoi9EFjN2
Token contract address: ct_mZPohW4DSd4EDQDoYesyo4Nd5Kbok76oV4EepKm45XLyBoQgL
 */


export default class WebsocketService {

    static client: WebSocket;

    public static async waitForBridgeToComplete(amountWei: bigint, aeAddress: string): Promise<void> {
        return new Promise((resolve, reject) => {
            console.log("waiting for bridge to complete");
            this.client.addEventListener("message", async (rawMessage) => {
                const data = JSON.parse(rawMessage.data.toString());
                if (
                    data.source === "mdw" &&
                    (data.subscription === "Object")
                ) {
                    // validate parameter
                    console.log("data", data);
                    console.log( data.payload.tx.arguments.length);
                    console.log( data.payload.tx.arguments[0].value[1]?.value);
                    console.log( data.payload.tx.arguments[0].value[2]?.value);
                    console.log( data.payload.tx.arguments[0].value[3]?.value);
                    debugger;

                    console.log( data.payload.tx.arguments.length === 1 &&
                        data.payload.tx.arguments[0].value[1]?.value === '0xabae76f98a84d1dc3e0af8ed68465631165d33b2' &&
                        data.payload.tx.arguments[0].value[2]?.value === aeAddress &&
                        data.payload.tx.arguments[0].value[3]?.value.toString() === amountWei.toString())
                    if (
                        data.payload.tx.arguments.length === 1 &&
                        data.payload.tx.arguments[0].value[1]?.value === '0xabae76f98a84d1dc3e0af8ed68465631165d33b2' &&
                        data.payload.tx.arguments[0].value[2]?.value === aeAddress &&
                        data.payload.tx.arguments[0].value[3]?.value?.toString() === amountWei.toString()
                    ) {
                        resolve();
                    }
                }
            });
        });
    }


    public static async init(): Promise<void> {
        return new Promise((resolve) => {
            // no need to init if already connected
            if (this.client) {
                return;
            }
            // TODO switch to mainnet
            this.client = new WebSocket('wss://testnet.aeternity.io/mdw/v2/websocket');
            this.client.addEventListener("open", () => {
                console.log("websocket connected");

                this.client.send(
                    // JSON.stringify({ op: "Subscribe", payload: "Transactions" }),
                    JSON.stringify({
                        op: "Subscribe",
                        payload: "Object",
                        target: 'ct_2wP1RMbbEdCTdystsvYx4ZDXMsqFrH72RRrBqbd5JBoi9EFjN2'
                    })
                );
                resolve();
            });
            this.client.addEventListener("error", (e) => {
                console.error("websocket error, retrying in 10s", e);
                this.client.close();
                setTimeout(() => this.init(), 10 * 1000);
            });
            this.client.addEventListener("close", WebsocketService.onClose);
        });
    }

    static onClose() {
        console.error("websocket closed, reconnecting");
        WebsocketService.init()
    }

    static close() {
        this.client.removeEventListener("close", WebsocketService.onClose);
        this.client.close();
    }
}