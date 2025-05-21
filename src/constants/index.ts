const bridgeDexSwapConfig = {
    mainnet: {
      chain_id: '0x1',
      eth_mock_address: '0xAbaE76F98A84D1DC3E0af8ed68465631165d33B2',
      eth_bridge_address: '0xd099E3Ab65d6294d1d2D1Ad92897Cc29286F8cA5',
      ae_bridge_address: 'ct_2Xdym95f2i998W9Zoh1NgAB7pVuQ34ztEsema7u4XwSoq5VKUJ' as `ct_${string}`,
      ae_wae_address: 'ct_J3zBY8xxjsRr3QojETNw48Eb38fjvEuJKkQ6KzECvubvEcvCa' as `ct_${string}`,
      ae_dex_router_address: 'ct_azbNZ1XrPjXfqBqbAh1ffLNTQ1sbnuUDFvJrXjYz7JQA1saQ3' as `ct_${string}`,
      ae_weth_address: 'ct_ryTY1mxqjCjq1yBn9i6HDaCSdA6thXUFZTA84EMzbWd1SLKdh' as `ct_${string}`,
      eth_native_eth_placeholder_address : '0xabae76f98a84d1dc3e0af8ed68465631165d33b2',
      ae_web_socket_url: 'wss://mainnet.aeternity.io/mdw/v2/websocket',
      ae_node_url: 'https://mainnet.aeternity.io',
      ae_network_id: 'ae_mainnet',      
      ae_middleware_url: 'https://mainnet.aeternity.io/mdw/v3',      
    },
  testnet: {
    chain_id: '0xaa36a7',
    eth_mock_address: '',
    eth_bridge_address: '0xa2E1f5E1f2721Ae935ac7b0799BC108963276dBA',
    ae_bridge_address: 'ct_2C5nHYyzUMiqU9HE32XNLN47pFEDL2bNpVTAsG5XmZNigvM4Fv' as `ct_${string}`,
    ae_wae_address: 'ct_JDp175ruWd7mQggeHewSLS1PFXt9AzThCDaFedxon8mF8xTRF' as `ct_${string}`,
    ae_dex_router_address: 'ct_MLXQEP12MBn99HL6WDaiTqDbG4bJQ3Q9Bzr57oLfvEkghvpFb' as `ct_${string}`,
    ae_weth_address: 'ct_WVqAvLQpvZCgBg4faZLXA1YBj43Fxj91D33Z8K7pFsY8YCofv' as `ct_${string}`,
    eth_native_eth_placeholder_address: '0xd57aafdc9615835e1f75bcdbde1c7b1aa6e4cb10',
    ae_web_socket_url: 'wss://testnet.aeternity.io/mdw/v2/websocket',
    ae_node_url: 'https://testnet.aeternity.io',
    ae_network_id: 'ae_uat',    
    ae_middleware_url: 'https://testnet.aeternity.io/mdw/v3',
    },
};

const isMainnet = !!process.env.MAINNET;

export const Constants = {
  isMainnet,
  bridge_eth_action_type: 1,
  ae_balance_threshold: 1000000000n,
  allowance_slippage: 10n, // 10% allowance slippage
  name: isMainnet ? 'mainnet' : 'testnet', 
  chain_id: bridgeDexSwapConfig[isMainnet ? 'mainnet' : 'testnet'].chain_id,
  ae_network_id: bridgeDexSwapConfig[isMainnet ? 'mainnet' : 'testnet'].ae_network_id,
  eth_mock_address: bridgeDexSwapConfig[isMainnet ? 'mainnet' : 'testnet'].eth_mock_address,
  eth_bridge_address: bridgeDexSwapConfig[isMainnet ? 'mainnet' : 'testnet'].eth_bridge_address,
  ae_bridge_address: bridgeDexSwapConfig[isMainnet ? 'mainnet' : 'testnet'].ae_bridge_address,
  ae_wae_address: bridgeDexSwapConfig[isMainnet ? 'mainnet' : 'testnet'].ae_wae_address,
  ae_dex_router_address: bridgeDexSwapConfig[isMainnet ? 'mainnet' : 'testnet'].ae_dex_router_address,
  ae_weth_address: bridgeDexSwapConfig[isMainnet ? 'mainnet' : 'testnet'].ae_weth_address,
  eth_native_eth_placeholder_address: bridgeDexSwapConfig[isMainnet ? 'mainnet' : 'testnet'].eth_native_eth_placeholder_address,
  ae_web_socket_url: bridgeDexSwapConfig[isMainnet ? 'mainnet' : 'testnet'].ae_web_socket_url,
  ae_node_url: bridgeDexSwapConfig[isMainnet ? 'mainnet' : 'testnet'].ae_node_url,
  ae_middleware_url: bridgeDexSwapConfig[isMainnet ? 'mainnet' : 'testnet'].ae_middleware_url,
};

export const BRIDGE_ABI = [
  {
    type: "error",
    name: "AddressEmptyCode",
    inputs: [
      {
        type: "address",
        name: "target",
      },
    ],
  },
  {
    type: "error",
    name: "AddressInsufficientBalance",
    inputs: [
      {
        type: "address",
        name: "account",
      },
    ],
  },
  {
    type: "error",
    name: "FailedInnerCall",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidInitialization",
    inputs: [],
  },
  {
    type: "error",
    name: "NotInitializing",
    inputs: [],
  },
  {
    type: "error",
    name: "SafeERC20FailedOperation",
    inputs: [
      {
        type: "address",
        name: "token",
      },
    ],
  },
  {
    type: "event",
    anonymous: false,
    name: "BridgeIn",
    inputs: [
      {
        type: "address",
        name: "asset",
        indexed: false,
      },
      {
        type: "address",
        name: "destination",
        indexed: false,
      },
      {
        type: "uint256",
        name: "amount",
        indexed: false,
      },
      {
        type: "uint256",
        name: "action_type",
        indexed: false,
      },
      {
        type: "uint256",
        name: "in_nonce",
        indexed: false,
      },
    ],
  },
  {
    type: "event",
    anonymous: false,
    name: "BridgeOut",
    inputs: [
      {
        type: "address",
        name: "asset",
        indexed: false,
      },
      {
        type: "address",
        name: "sender",
        indexed: false,
      },
      {
        type: "string",
        name: "destination",
        indexed: false,
      },
      {
        type: "uint256",
        name: "amount",
        indexed: false,
      },
      {
        type: "uint256",
        name: "action_type",
        indexed: false,
      },
      {
        type: "uint256",
        name: "out_nonce",
        indexed: false,
      },
    ],
  },
  {
    type: "event",
    anonymous: false,
    name: "Initialized",
    inputs: [
      {
        type: "uint64",
        name: "version",
        indexed: false,
      },
    ],
  },
  {
    type: "function",
    name: "add_processor",
    constant: false,
    payable: false,
    inputs: [
      {
        type: "address",
        name: "processor",
      },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "bridge_actions",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [
      {
        type: "uint256",
        name: "",
      },
    ],
    outputs: [
      {
        type: "address",
        name: "asset",
      },
      {
        type: "address",
        name: "sender",
      },
      {
        type: "string",
        name: "destination",
      },
      {
        type: "uint256",
        name: "amount",
      },
      {
        type: "uint8",
        name: "action_type",
      },
      {
        type: "uint256",
        name: "nonce",
      },
    ],
  },
  {
    type: "function",
    name: "bridge_in",
    constant: false,
    payable: false,
    inputs: [
      {
        type: "uint256",
        name: "nonce",
      },
      {
        type: "address",
        name: "asset",
      },
      {
        type: "address",
        name: "destination",
      },
      {
        type: "uint256",
        name: "amount",
      },
      {
        type: "uint8",
        name: "action_type",
      },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "bridge_out",
    constant: false,
    stateMutability: "payable",
    payable: true,
    inputs: [
      {
        type: "address",
        name: "asset",
      },
      {
        type: "string",
        name: "destination",
      },
      {
        type: "uint256",
        name: "amount",
      },
      {
        type: "uint8",
        name: "action_type",
      },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "change_owner",
    constant: false,
    payable: false,
    inputs: [
      {
        type: "address",
        name: "new_owner",
      },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "confirm_new_owner",
    constant: false,
    payable: false,
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "disable",
    constant: false,
    payable: false,
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "enable",
    constant: false,
    payable: false,
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "getAddress",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [],
    outputs: [
      {
        type: "address",
        name: "",
      },
    ],
  },
  {
    type: "function",
    name: "in_action_status",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [
      {
        type: "uint256",
        name: "id",
      },
    ],
    outputs: [
      {
        type: "uint8",
        name: "",
      },
    ],
  },
  {
    type: "function",
    name: "in_action_submitted",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [
      {
        type: "uint256",
        name: "id",
      },
    ],
    outputs: [
      {
        type: "bool",
        name: "",
      },
    ],
  },
  {
    type: "function",
    name: "in_actions",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [
      {
        type: "uint256",
        name: "",
      },
    ],
    outputs: [
      {
        type: "uint8",
        name: "status",
      },
    ],
  },
  {
    type: "function",
    name: "initialize",
    constant: false,
    payable: false,
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "isEnabled",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [],
    outputs: [
      {
        type: "bool",
        name: "",
      },
    ],
  },
  {
    type: "function",
    name: "is_enabled",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [],
    outputs: [
      {
        type: "bool",
        name: "",
      },
    ],
  },
  {
    type: "function",
    name: "movement_action_type",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [
      {
        type: "uint256",
        name: "id",
      },
    ],
    outputs: [
      {
        type: "uint8",
        name: "",
      },
    ],
  },
  {
    type: "function",
    name: "movement_amount",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [
      {
        type: "uint256",
        name: "id",
      },
    ],
    outputs: [
      {
        type: "uint256",
        name: "",
      },
    ],
  },
  {
    type: "function",
    name: "movement_asset",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [
      {
        type: "uint256",
        name: "id",
      },
    ],
    outputs: [
      {
        type: "address",
        name: "",
      },
    ],
  },
  {
    type: "function",
    name: "movement_destination",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [
      {
        type: "uint256",
        name: "id",
      },
    ],
    outputs: [
      {
        type: "string",
        name: "",
      },
    ],
  },
  {
    type: "function",
    name: "movement_nonce",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [
      {
        type: "uint256",
        name: "id",
      },
    ],
    outputs: [
      {
        type: "uint256",
        name: "",
      },
    ],
  },
  {
    type: "function",
    name: "movement_sender",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [
      {
        type: "uint256",
        name: "id",
      },
    ],
    outputs: [
      {
        type: "address",
        name: "",
      },
    ],
  },
  {
    type: "function",
    name: "native_eth_placeholder",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [],
    outputs: [
      {
        type: "address",
        name: "",
      },
    ],
  },
  {
    type: "function",
    name: "out_counter",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [],
    outputs: [
      {
        type: "uint256",
        name: "",
      },
    ],
  },
  {
    type: "function",
    name: "owner",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [],
    outputs: [
      {
        type: "address",
        name: "",
      },
    ],
  },
  {
    type: "function",
    name: "pending_owner",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [],
    outputs: [
      {
        type: "address",
        name: "",
      },
    ],
  },
  {
    type: "function",
    name: "processors",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [
      {
        type: "uint256",
        name: "",
      },
    ],
    outputs: [
      {
        type: "address",
        name: "",
      },
    ],
  },
  {
    type: "function",
    name: "processors_threshold",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [],
    outputs: [
      {
        type: "uint16",
        name: "",
      },
    ],
  },
  {
    type: "function",
    name: "remove_processor",
    constant: false,
    payable: false,
    inputs: [
      {
        type: "address",
        name: "processor",
      },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "set_native_eth_placeholder",
    constant: false,
    payable: false,
    inputs: [
      {
        type: "address",
        name: "placeholder",
      },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "set_processors_threshold",
    constant: false,
    payable: false,
    inputs: [
      {
        type: "uint16",
        name: "threshold",
      },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "set_wrapped_ae",
    constant: false,
    payable: false,
    inputs: [
      {
        type: "address",
        name: "wae",
      },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "wrapped_ae",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [],
    outputs: [
      {
        type: "address",
        name: "",
      },
    ],
  },
];
