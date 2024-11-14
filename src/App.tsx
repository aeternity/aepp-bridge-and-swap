import React, { useCallback, useEffect, useRef, useState } from "react";

import TextInput from "./components/TextInput";
import WalletService from "./services/WalletService";
import TokenPriceService from "./services/TokenPriceService";
import {
  Box,
  Button,
  Container,
  Divider,
  InputAdornment,
  Typography,
  Grid2 as Grid,
  CircularProgress,
} from "@mui/material";

import BridgeService from "./services/BridgeService";
import DexService from "./services/DexService";
import WebsocketService from "./services/WebsocketService";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Stepper from "@mui/material/Stepper";

function App() {
  const effectRan = useRef(false);
  const [ethAmount, setEthAmount] = useState("");
  const [ethBalance, setEthBalance] = useState(0);
  const [ethereumAddress, setEthereumAddress] = useState("");
  const [aeternityAddress, setAeternityAddress] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [swapResult, setSwapResult] = useState({
    aeEthIn: BigInt(0),
    aeOut: BigInt(0),
  });

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
          : event.target.value,
      );
    },
    [ethBalance],
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

    // Waiting for bridge to complete
    setActiveStep(1);

    // await BridgeService.bridgeEthToAe(parseFloat(ethAmount), aeternityAddress);
    // Bridge completed successfully

    // Wait for a moment to let the bridge finalize
    // await WebsocketService.waitForBridgeToComplete(amountInWei, aeternityAddress);
    // console.log("bridge completed successfully");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setActiveStep(2);

    // Change allowance
    await DexService.changeAllowance(amountInWei);

    setActiveStep(3);

    // Then we can swap AE tokens
    const [aeEthIn, aeOut] = await DexService.swapAeEthToAE(
      amountInWei,
      aeternityAddress,
    );
    setSwapResult({ aeOut: aeOut, aeEthIn: aeEthIn });

    setActiveStep(4);
  }, [ethAmount, aeternityAddress]);

  // 1. step: Bridge
  // 2. step: Waiting for bridge to complete
  // 3. step: Change allowance
  // 4. step: Swap AE tokens
  // 5. step: Done

  return (
    <Container sx={{ padding: 2 }}>
      <Grid container>
        <Grid size={12}>
          <Typography textAlign={"center"} variant="h2">
            Buy AE with ETH
          </Typography>
          <Divider sx={{ background: "white", marginY: 3 }} />
          <Typography textAlign={"center"} variant="h6" mb={3}>
            This process will bridge your ETH to AE chain using Acurast bridge
            and then swap it to AE tokens.
          </Typography>
        </Grid>
        <Grid size={6}>
          <Typography fontWeight={"normal"} variant="h5">
            Aeternity Address:
          </Typography>
          {aeternityAddress || "Waiting for wallet connection..."}
          <br />
          <br />
          <Typography fontWeight={"normal"} variant="h5">
            Ethereum Address:
          </Typography>
          {ethereumAddress || "Waiting for wallet connection..."}
          <br />
          {ethereumAddress && (
            <Typography fontWeight={"normal"}>
              Balance: {ethBalance} ETH
            </Typography>
          )}
        </Grid>
        <Grid size={6}>
          {areWalletsConnected && (
            <Stepper activeStep={activeStep} orientation="vertical">
              <Step>
                <StepLabel>
                  <Typography variant="h5" color="white">
                    Enter Amount
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems={"left"}
                  >
                    <Typography textAlign={"left"} mb={2}>
                      Enter the amount of ETH you want to bridge:
                    </Typography>
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
                            <InputAdornment
                              sx={{ color: "white" }}
                              position="end"
                            >
                              ETH
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                    <Typography textAlign={"left"} mt={1}>
                      Approximate exchange rate:
                      <br />1 ETH(@{prices?.ETH} USD) ={" "}
                      {exchangeRatio?.toFixed(0)} AE(@
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
                </StepContent>
              </Step>

              <Step>
                <StepLabel>
                  <Typography variant="h5" color="white">
                    Bridge Tokens
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Typography textAlign={"left"} mb={2}>
                    <CircularProgress size={16} /> Waiting for bridge to
                    complete...
                    <br />
                    <br />
                    Please confirm the transaction in your Ethereum wallet
                  </Typography>
                </StepContent>
              </Step>

              <Step>
                <StepLabel>
                  <Typography variant="h5" color="white">
                    Change Allowance
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Typography textAlign={"left"} mb={2}>
                    <CircularProgress size={16} /> Waiting for allowance
                    change...
                    <br />
                    <br />
                    Please confirm the transaction in your Aeternity wallet
                  </Typography>
                </StepContent>
              </Step>
              <Step>
                <StepLabel>
                  <Typography variant="h5" color="white">
                    Swap Tokens
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Typography textAlign={"left"} mb={2}>
                    <CircularProgress size={16} /> Swapping AE tokens...
                    <br />
                    <br />
                    Please confirm the transaction in your Aeternity wallet
                  </Typography>
                </StepContent>
              </Step>
            </Stepper>
          )}
        </Grid>
        {activeStep === 4 && (
          <Grid size={12}>
            <Divider sx={{ background: "white", marginY: 3 }} />
            <Typography textAlign={"center"} variant="h6">
              You swapped {ethAmount} ETH to ~
              {exchangeRatio ? Number(swapResult.aeOut) / 10 ** 18 : 0} AE
              tokens successfully!
              <br />
              <Button onClick={() => setActiveStep(0)}>Swap again</Button>
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default App;
