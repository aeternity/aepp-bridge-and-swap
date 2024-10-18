import { useCallback, useEffect, useRef, useState } from "react";

import TextInput from "../base/TextInput";
import WalletService from "../../services/WalletService";
import TokenPriceService from "../../services/TokenPriceService";
import {
  Box,
  Button,
  Container,
  Divider,
  InputAdornment,
  Typography,
} from "@mui/material";
import BridgeService from "../../services/BridgeService";
import DexService from "../../services/DexService";
import WebsocketService from "../../services/WebsocketService";


function App() {
  const effectRan = useRef(false);
  const [ethAmount, setEthAmount] = useState("");
  const [ethBalance, setEthBalance] = useState(0);
  const [ethereumAddress, setEthereumAddress] = useState("");
  const [aeternityAddress, setAeternityAddress] = useState("");

  const [prices, setPrices] = useState<{ AE: number; ETH: number }>();

  const handleConnectMetamask = useCallback(async (address: string) => {
    const balance = await WalletService.getEthBalance(address);
    setEthBalance(balance);
    setEthereumAddress(address);
  }, []);

  const handleAmountChange = useCallback(
    (event: any) => {
      setEthAmount(
        parseFloat(event.target.value) >= ethBalance
          ? ethBalance
          : event.target.value
      );
    },
    [ethBalance]
  );

  useEffect(() => {
    if (!effectRan.current) {
      TokenPriceService.getPrices().then(setPrices);

      WalletService.connectMetamask().then(handleConnectMetamask);
      WalletService.connectSuperHero().then(setAeternityAddress);

      WebsocketService.init();
    }

    return () => {
      effectRan.current = true;
    };
  }, [handleConnectMetamask]);



  const areWalletsConnected = ethereumAddress && aeternityAddress;
  const exchangeRatio = prices ? prices.ETH / prices.AE : null;

  const handleBridgeClick = useCallback(async () => {
    if (!ethAmount) {
      return;
    }

    const amountInWei = BigInt(parseFloat(ethAmount) * 10 ** 18);

    // await BridgeService.bridgeEthToAe(parseFloat(ethAmount), aeternityAddress);
    // Bridge completed successfully
    // Wait for a moment to let the bridge finalize
    // await WebsocketService.waitForBridgeToComplete(amountInWei, aeternityAddress);
    // console.log("bridge completed successfully");
    // Then we can swap AE tokens
    await DexService.swapAeEthToAE(amountInWei, aeternityAddress);

  }, [ethAmount, aeternityAddress]);

  return (
    <Container sx={{ paddingY: 5 }}>
      <Typography textAlign={"center"} variant="h2">
        Buy AE with ETH
      </Typography>
      <Divider sx={{ background: "white", marginY: 3 }} />
      <Typography textAlign={"center"} variant="h6" mb={3}>
        This process will bridge your ETH to AE chain using Acurast bridge and
        then swap it to AE tokens.
      </Typography>

      {areWalletsConnected ? (
        <Typography textAlign={"center"} variant="h5">
          Aeternity address: {aeternityAddress}
          <br />
          Ethereum address: {ethereumAddress}
          <br />
          <br />
          Account balance: {ethBalance} ETH
        </Typography>
      ) : (
        <Typography textAlign={"center"} variant="h4">
          Connect your wallets to start
        </Typography>
      )}

      {areWalletsConnected && (
        <Box display="flex" flexDirection="column" alignItems={"center"} mt={5}>
          <TextInput
            sx={{ width: "375px" }}
            value={ethAmount || ""}
            onChange={handleAmountChange}
            label="Enter Amount"
            type="number"
            slotProps={{
              htmlInput: { min: 0, max: ethBalance, step: 0.0001 },
              input: {
                sx: { color: "white" },
                endAdornment: (
                  <InputAdornment sx={{ color: "white" }} position="end">
                    ETH
                  </InputAdornment>
                ),
              },
            }}
          />

          <Typography textAlign={"center"} mt={5} variant="h5">
            Approximate exchange rate:
            <br />1 ETH(@{prices?.ETH} USD) = {exchangeRatio?.toFixed(0)} AE(@
            {prices?.AE} USD)
          </Typography>

          {!!parseFloat(ethAmount) && (
            <>
              <Typography textAlign={"center"} mt={5} variant="h5">
                You will receive: ~
                {exchangeRatio
                  ? (parseFloat(ethAmount) * exchangeRatio).toFixed(0)
                  : 0}{" "}
                AE
              </Typography>

              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handleBridgeClick}
              >
                Bridge
              </Button>
            </>
          )}
        </Box>
      )}
    </Container>
  );
}

export default App;
