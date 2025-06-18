import { Constants } from '../constants';

export default class WebsocketService {
  static client: WebSocket;

  public static async waitForBridgeToComplete(
    amountWei: bigint,
    aeAddress: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log("waiting for bridge to complete");
      this.client.addEventListener("message", async (rawMessage) => {
        const data = JSON.parse(rawMessage.data.toString());
        if (data.source === "mdw" && data.subscription === "Object") {
          // validate parameter
          console.debug(data);
          const args = data.payload.tx.arguments;
          const [arg] = args || [];
          if (
            args.length === 1
            && arg.value[1]?.value === Constants.eth_native_eth_placeholder_address
            && arg.value[2]?.value === aeAddress
            && arg.value[3]?.value?.toString() === amountWei.toString()
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
      this.client = new WebSocket(Constants.ae_web_socket_url);
      this.client.addEventListener("open", () => {
        console.log("websocket connected");

        this.client.send(
          JSON.stringify({
            op: "Subscribe",
            payload: "Object",
            target: Constants.ae_bridge_address,
          }),
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
    WebsocketService.init();
  }
}
