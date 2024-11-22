import {
  AE_BRIDGE_ADDRESS,
  AE_WEB_SOCKET_URL,
  ETH_NATIVE_ETH_PLACEHOLDER_ADDRESS,
} from "../constants";

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
          if (
            data.payload.tx.arguments.length === 1 &&
            data.payload.tx.arguments[0].value[1]?.value ===
              ETH_NATIVE_ETH_PLACEHOLDER_ADDRESS &&
            data.payload.tx.arguments[0].value[2]?.value === aeAddress &&
            data.payload.tx.arguments[0].value[3]?.value?.toString() ===
              amountWei.toString()
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
      this.client = new WebSocket(AE_WEB_SOCKET_URL);
      this.client.addEventListener("open", () => {
        console.log("websocket connected");

        this.client.send(
          JSON.stringify({
            op: "Subscribe",
            payload: "Object",
            target: AE_BRIDGE_ADDRESS,
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
