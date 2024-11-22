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

const SKIP_ETH = !!process.env.NEXT_PUBLIC_SKIP_ETH;

function App() {
  const effectRan = useRef(false);
  const [ethAmount, setEthAmount] = useState("");
  const [ethBalance, setEthBalance] = useState(0);
  const [ethereumAddress, setEthereumAddress] = useState("");
  const [aeternityAddress, setAeternityAddress] = useState("");
  const [isEthereumConnecting, setIsEthereumConnecting] = useState(false);
  const [isAeternityConnecting, setIsAeternityConnecting] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [swapResult, setSwapResult] = useState({
    aeEthIn: BigInt(0),
    aeOut: BigInt(0),
  });

  const [prices, setPrices] = useState<{ AE: number; ETH: number }>();

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
      WebsocketService.init();
    }

    return () => {
      effectRan.current = true;
    };
  }, []);

  const connectSuperhero = async () => {
    try {
      setIsAeternityConnecting(true);
      const address = await WalletService.connectSuperHero();
      setAeternityAddress(address);
      setIsAeternityConnecting(false);
    } catch (error) {
      console.error(error);
      setAeternityAddress(
        "Error connecting wallet, check that you have your wallet installed and accept the connection.",
      );
      setIsAeternityConnecting(false);
    }
  };

  const connectMetamask = async () => {
    try {
      setIsEthereumConnecting(true);
      const address = await WalletService.connectMetamask();
      const balance = await WalletService.getEthBalance(address);
      setEthBalance(balance);
      setEthereumAddress(address);
      setIsEthereumConnecting(false);
    } catch (error) {
      console.error(error);
      setEthereumAddress(
        "Error connecting wallet, check that you have your wallet installed and accept the connection.",
      );
      setIsEthereumConnecting(false);
    }
  };

  const areWalletsConnected = ethereumAddress && aeternityAddress;
  const exchangeRatio = prices ? prices.ETH / prices.AE : null;

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue =
        "Buying AE with ETH is currently in progress. If you leave the funds will not be lost but the process will be interrupted and can currently not be picked up again.";
    };

    if (activeStep > 0 && activeStep < 4) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [activeStep]);

  const handleBridgeClick = useCallback(async () => {
    if (!ethAmount) {
      return;
    }

    const amountInWei = BigInt(parseFloat(ethAmount) * 10 ** 18);
    console.log("Skip", SKIP_ETH, process.env.NEXT_PUBLIC_SKIP_ETH);
    if (!SKIP_ETH) {
      await BridgeService.bridgeEthToAe(
        parseFloat(ethAmount),
        aeternityAddress,
      );
    }
    // Waiting for bridge to complete
    setActiveStep(1);

    if (!SKIP_ETH) {
      // Wait for a moment to let the bridge finalize
      await WebsocketService.waitForBridgeToComplete(
        amountInWei,
        aeternityAddress,
      );
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

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
            Aeternity:
          </Typography>
          {!isAeternityConnecting && !aeternityAddress ? (
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={connectSuperhero}
            >
              Connect Superhero Wallet
            </Button>
          ) : (
            aeternityAddress || "Waiting for wallet connection..."
          )}
          <br />
          <br />
          <Typography fontWeight={"normal"} variant="h5">
            Ethereum:
          </Typography>
          {!isEthereumConnecting && !ethereumAddress ? (
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={connectMetamask}
            >
              Connect Metamask Wallet
            </Button>
          ) : (
            ethereumAddress || "Waiting for wallet connection..."
          )}
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
