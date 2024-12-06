<p align="center"><h1 align="center">CHAIN-FUSION-POC</h1></p>
<p align="center">
	<em>Seamless Swaps, Boundless Bridges!</em>
</p>
<p align="center">
	<!-- local repository, no metadata badges. --></p>
<p align="center">Built with the tools and technologies:</p>
<p align="center">
	<img src="https://img.shields.io/badge/npm-CB3837.svg?style=default&logo=npm&logoColor=white" alt="npm">
	<img src="https://img.shields.io/badge/HTML5-E34F26.svg?style=default&logo=HTML5&logoColor=white" alt="HTML5">
	<img src="https://img.shields.io/badge/Prettier-F7B93E.svg?style=default&logo=Prettier&logoColor=black" alt="Prettier">
	<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=default&logo=JavaScript&logoColor=black" alt="JavaScript">
	<img src="https://img.shields.io/badge/React-61DAFB.svg?style=default&logo=React&logoColor=black" alt="React">
	<br>
	<img src="https://img.shields.io/badge/Yarn-2C8EBB.svg?style=default&logo=Yarn&logoColor=white" alt="Yarn">
	<img src="https://img.shields.io/badge/Docker-2496ED.svg?style=default&logo=Docker&logoColor=white" alt="Docker">
	<img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=default&logo=TypeScript&logoColor=white" alt="TypeScript">
	<img src="https://img.shields.io/badge/GitHub%20Actions-2088FF.svg?style=default&logo=GitHub-Actions&logoColor=white" alt="GitHub%20Actions">
</p>
<br>

##  Table of Contents

- [ Overview](#overview)
- [ Getting Started](#getting-started)
  - [ Prerequisites](#prerequisites)
  - [ Installation](#installation)
  - [ Usage](#usage)
    - [ Testing](#testing)
- [ Development](#development)
- [ Contributing](#contributing)


---

##  Overview

The **ChainFusion-PoC** project addresses the challenge of cross-chain asset transfers between Ethereum and Aeternity. The main feature of the application is swapping Ethereum to Aeternity, accomplished by leveraging the [ae-bridge](https://ae-bridge.com/) and the [Superhero DEX](https://aepp.dex.superhero.com/) while automating the process. It features a user-friendly interface for bridging and swapping tokens, real-time price updates, and seamless wallet integration. Ideal for cryptocurrency enthusiasts and developers, this project enhances interoperability in decentralized finance, simplifying transactions across blockchain networks.

---
##  Getting Started

###  Prerequisites

Before getting started with chain-fusion-poc, ensure your runtime environment meets the following requirements:

- **Programming Language:** TypeScript
- **Package Manager:** Yarn
- **Container Runtime:** Docker


###  Installation

Install aepp-bridge-and-swap using one of the following methods:

**Build from source:**

1. Clone the aepp-bridge-and-swap repository:
```shx
❯ git clone https://github.com/aeternity/aepp-bridge-and-swap.git
```

2. Navigate to the project directory:
```sh
❯ cd aepp-bridge-and-swap
```

3. Install the project dependencies:

**Using `yarn`** &nbsp; [<img align="center" src="https://img.shields.io/badge/yarn-117cad.svg?style={badge_style}&logo=yarn&logoColor=white" />](https://www.yarnpkg.com/)

```sh
❯ yarn
```


**Using `docker`** &nbsp; [<img align="center" src="https://img.shields.io/badge/Docker-2CA5E0.svg?style={badge_style}&logo=docker&logoColor=white" />](https://www.docker.com/)

```sh
❯ docker build -t aeternity/aepp-bridge-and-swap .
```




###  Usage
Run aepp-bridge-and-swap using the following command:


**Using `yarn`** &nbsp; [<img align="center" src="https://img.shields.io/badge/yarn-117cad.svg?style={badge_style}&logo=yarn&logoColor=white" />](https://www.yarnpkg.com/)

```sh
❯ yarn start
```


**Using `docker`** &nbsp; [<img align="center" src="https://img.shields.io/badge/Docker-2CA5E0.svg?style={badge_style}&logo=docker&logoColor=white" />](https://www.docker.com/)

```sh
❯ docker run -it aeternity/aepp-bridge-and-swap
```


###  Testing
Run the test suite using the following command:



**Using `yarn`** &nbsp; [<img align="center" src="https://img.shields.io/badge/yarn-117cad.svg?style={badge_style}&logo=yarn&logoColor=white" />](https://www.yarnpkg.com/)

```sh
❯ yarn test
```

---
##  Configuration

### Environment Variables

- `NEXT_PUBLIC_SKIP_ETH`: Skip the Ethereum-related bridge operations. This a development setting as transaction on the Ethereum Network can be expensive. If the flag is present with any value, the operations will be skipped.
- `AE_PRIVATE_KEY`: Private key for the Aeternity account used for paying for the dex swap transactions. This account should be funded with some AE. 1 AE is enough for around 1500 bridge & swap calls. It needs to be in hex format similar to `4d60aca4542c2...c3676a7c1ccf`. Use the [sdk](https://docs.aeternity.com/aepp-sdk-js/v13.3.3/quick-start/) to generate a new account.

### Configuration Variables

The project uses the following configuration variables, defined in the `src/constants/index.ts` file, to manage cross-chain operations and connections. These variables are predefined with sensible defaults and can be adjusted to suit your specific deployment requirements:

- **`ETH_MOCK_ADDRESS`**: The mock Ethereum token address used for testing purposes.
- **`ETH_BRIDGE_ADDRESS`**: The Ethereum bridge contract address for transferring assets to Aeternity.
- **`AE_BRIDGE_ADDRESS`**: The Aeternity bridge contract address for receiving bridged assets.
- **`AE_WAE_ADDRESS`**: The wrapped Aeternity token (WAE) contract address.
- **`AE_DEX_ROUTER_ADDRESS`**: The Superhero DEX router contract address for facilitating token swaps.
- **`AE_WETH_ADDRESS`**: The wrapped Ethereum token (WETH) contract address on Aeternity.
- **`ETH_NATIVE_ETH_PLACEHOLDER_ADDRESS`**: A placeholder address representing Ethereum’s native token; must be in lowercase.
- **`AE_WEB_SOCKET_URL`**: The WebSocket endpoint for Aeternity's middleware to listen for real-time updates.
- **`AE_NODE_URL`**: The URL for interacting with the Aeternity blockchain node.
- **`AE_NETWORK_ID`**: The identifier for the Aeternity network (e.g., `ae_mainnet`).
- **`AE_MIDDLEWARE_URL`**: The URL for Aeternity's middleware API to query blockchain data.

Ensure they are correctly configured in your environment before deploying the application.

---

## Development

There are a few scripts within the `/scripts` folder that can be used to help with development:

- `callDEX.js`: Swaps AE for tokens using the AE DEX; requires a mnemonic private key as the `MNEMONIC` environment variable.
- `deployTestnetBridge.js`: Deploys and configures bridge and token contracts on AE testnet; requires `MNEMONIC`.
- `fakeBridgeIn.js`: Simulates a bridge_in transaction on the AE testnet bridge contract; requires `MNEMONIC`.

In general there is no setup required for development, just run the application and start developing:

```sh
yarn dev
```

---

##  Contributing

- **💬 [Join the Discussions](https://github.com/aeternity/aepp-bridge-and-swap/discussions)**: Share your insights, provide feedback, or ask questions.
- **🐛 [Report Issues](https://github.com/aeternity/aepp-bridge-and-swap/issues)**: Submit bugs found or log feature requests for the `aepp-bridge-and-swap` project.

### Contributing Guidelines

1. **Fork the Repository**: Start by forking the project repository to your github.com account.
2. **Clone Locally**: Clone the forked repository to your local machine using a git client.
   ```sh
   git clone https://github.com/your-fork/aepp-bridge-and-swap.git
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.
   ```sh
   git commit -m 'Implemented new feature x.'
   ```
6. **Push to github.com**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.
8. **Review**: Once your PR is reviewed and approved, it will be merged into the main branch. Congratulations on your contribution!
