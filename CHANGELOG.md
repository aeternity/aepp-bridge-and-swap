# Changelog

## [1.2.1](https://github.com/aeternity/aepp-bridge-and-swap/compare/v1.2.0...v1.2.1) (2025-07-18)


### Bug Fixes

* convert private key from old format to new ([280d992](https://github.com/aeternity/aepp-bridge-and-swap/commit/280d992bca5b7c7754558585100312eb75e9f5b5))

## [1.2.0](https://github.com/aeternity/aepp-bridge-and-swap/compare/v1.1.0...v1.2.0) (2025-07-15)


### Features

* change tab title and description ([8edc624](https://github.com/aeternity/aepp-bridge-and-swap/commit/8edc624f8a3c31e33e3d833853f6db4f4ee46e12))

## [1.1.0](https://github.com/aeternity/aepp-bridge-and-swap/compare/v1.0.0...v1.1.0) (2025-07-10)


### Features

* be able to connect to metamask via deep link ([3ed3259](https://github.com/aeternity/aepp-bridge-and-swap/commit/3ed3259e4f5ca99ce9361ff4f628cabd6fecec78))
* force reload when disconnecting from ae wallet to cleanup ([9288680](https://github.com/aeternity/aepp-bridge-and-swap/commit/9288680755a4e49dcb55b135e58e157a72c510d1))
* make next button more prominent when enabled ([bc60260](https://github.com/aeternity/aepp-bridge-and-swap/commit/bc602602f61cdfcd92340209c662dc7150d460c0))


### Bug Fixes

* disconnect issue on mobile ([0f779f5](https://github.com/aeternity/aepp-bridge-and-swap/commit/0f779f5f092cee08e8265106a8fc098df1dad380))
* use correct type on memory account creation ([9b2f6f2](https://github.com/aeternity/aepp-bridge-and-swap/commit/9b2f6f278515af4d9a0243b636606d81533cd1fe))


### CI / CD

* update node version in Dockerfile ([a9bf460](https://github.com/aeternity/aepp-bridge-and-swap/commit/a9bf4608dd5e58ea334b85be9589a7f1006caab4))

## 1.0.0 (2025-06-24)


### Features

* add favicon and optimize logo ([39f3208](https://github.com/aeternity/aepp-bridge-and-swap/commit/39f320832bcd219f5648bed251085e8484756115))
* allow to remove the last 0 of the input ([412c7e8](https://github.com/aeternity/aepp-bridge-and-swap/commit/412c7e84cf1d40f48bc7c8ab0e5b97a4eb4fb525))
* avoid stuck transactions ([9c32889](https://github.com/aeternity/aepp-bridge-and-swap/commit/9c328892b0d2d0e7fb30a51aee64dcbbea90df87))
* be able to connect on mobile ([36d6f38](https://github.com/aeternity/aepp-bridge-and-swap/commit/36d6f383c1224dd4db968803892aee06a5b0fd65))
* be able to connect with different providers ([e9a8c6a](https://github.com/aeternity/aepp-bridge-and-swap/commit/e9a8c6afb03c6cc06a6bcf680818866383834534))
* be able to swap eth/ae with empty and regular account ([4f32f27](https://github.com/aeternity/aepp-bridge-and-swap/commit/4f32f2753069753c1345fb62421ae0417794f3a8))
* be able to swap existing WETH tokens ([c4031de](https://github.com/aeternity/aepp-bridge-and-swap/commit/c4031de6817519114b0a9d5f7e509d4ba2ff9753))
* **ci:** add production release pipeline ([#48](https://github.com/aeternity/aepp-bridge-and-swap/issues/48)) ([dc4a3d5](https://github.com/aeternity/aepp-bridge-and-swap/commit/dc4a3d5d20fda6850a37239878fe06b840b3bace))
* connect wallet button and text updates ([0346d22](https://github.com/aeternity/aepp-bridge-and-swap/commit/0346d225074e2dc2628ba2e59900cf8f17f04e86))
* disconnect wallets action ([355a89e](https://github.com/aeternity/aepp-bridge-and-swap/commit/355a89e3b52bcdd2389fe7e17d3ac881a503b044))
* dont allow multiple leading 0 ([9ef7d2a](https://github.com/aeternity/aepp-bridge-and-swap/commit/9ef7d2ae70e189c27dee18e63623b5232bd45c56))
* fix alignment issues on desktop ([69d8f9c](https://github.com/aeternity/aepp-bridge-and-swap/commit/69d8f9cedf4d06df37c79681983bcc6bd88e604f))
* handle walletconnect-metamask errors ([a359def](https://github.com/aeternity/aepp-bridge-and-swap/commit/a359defd9806ffaace0d31f7618c08bf69411b6d))
* **mobile:** show walletconnect qr code on connect ([1c48de6](https://github.com/aeternity/aepp-bridge-and-swap/commit/1c48de66fd5302db4e88c9a0ff6e7c3e19542e4a))
* polling the balances of connected wallets ([46808f9](https://github.com/aeternity/aepp-bridge-and-swap/commit/46808f9c3cbe312034d90ba1eeebd15c3c8f50cf))
* prevent truncate of input value ([3721abd](https://github.com/aeternity/aepp-bridge-and-swap/commit/3721abdaf99210d3a3f5c60f6136072039f7f42d))
* retry functionality ([e35165c](https://github.com/aeternity/aepp-bridge-and-swap/commit/e35165c9893c6dfc17076bf848033242c89d97bd))
* right alignment of text input ([4999449](https://github.com/aeternity/aepp-bridge-and-swap/commit/49994493d89b36d896c8b40e020a230c300c6dda))
* small ui issue on aeEth -&gt; ae transaction ([1b771fb](https://github.com/aeternity/aepp-bridge-and-swap/commit/1b771fb59a9bc96a20493ad49a2e6bd0984adbd4))
* step navigation visual updates ([8499bd7](https://github.com/aeternity/aepp-bridge-and-swap/commit/8499bd759de506cdfe9bf3cab6598bfa2748d414))
* swap AE/aeETH to ETH ([3c68d6c](https://github.com/aeternity/aepp-bridge-and-swap/commit/3c68d6cb2f44f36ba13f7f318ae2314d6bf1826f))
* use appkit for ethereum ([4695abd](https://github.com/aeternity/aepp-bridge-and-swap/commit/4695abd9842f2d305f59760af93bcba62ab18932))
* v2 ui with eth to ae flow ([6bf81f1](https://github.com/aeternity/aepp-bridge-and-swap/commit/6bf81f16224c619c0311e07e7eb8c5ff2772e88f))
* v2 ui with rest of the flows ([4a103cb](https://github.com/aeternity/aepp-bridge-and-swap/commit/4a103cb705370edfbd6939fcc160e65c2c12d352))


### Bug Fixes

* add correct contract ([d77069b](https://github.com/aeternity/aepp-bridge-and-swap/commit/d77069b96e35213f103d3794ebd95c289d305759))
* alignment issue on swap/bridge amount on mobile ([8ce4ae9](https://github.com/aeternity/aepp-bridge-and-swap/commit/8ce4ae915d704ad546ccf67cd40ab88fb10029d8))
* app gutters on home page and background styling ([9c6f0eb](https://github.com/aeternity/aepp-bridge-and-swap/commit/9c6f0ebcef9b6575bd3ba892f2fa9fd612776bd5))
* await for allowance chage before swapping ([3b8127a](https://github.com/aeternity/aepp-bridge-and-swap/commit/3b8127a53b1387680bc24c7711fb212a2aa9b83d))
* background not taking full height ([0afb716](https://github.com/aeternity/aepp-bridge-and-swap/commit/0afb7168651bcaf7ccab9c4e053de57c1ab62a51))
* be able to bridge ([f1034cb](https://github.com/aeternity/aepp-bridge-and-swap/commit/f1034cb2cf8511ee21c197c1fed29e798ea16c94))
* be able to bridge multiple times ([d753f46](https://github.com/aeternity/aepp-bridge-and-swap/commit/d753f4602f41bebe1258a6cfe038ef6c52244ad7))
* be able to enter decimals ([d1a1b99](https://github.com/aeternity/aepp-bridge-and-swap/commit/d1a1b996b8ce6f184528c4aeff150ad445e718e7))
* be able to use payForTx on mobile ([ac17bc5](https://github.com/aeternity/aepp-bridge-and-swap/commit/ac17bc566b5907c603651a09f9fd38d84e3593c2))
* be able to verify allowance and swap transactions ([8e92042](https://github.com/aeternity/aepp-bridge-and-swap/commit/8e92042dc7869542e7791aa989df27083c95d045))
* be more precise on messages regarding amounts ([4fb9812](https://github.com/aeternity/aepp-bridge-and-swap/commit/4fb98129affa0cad3abc8d51069bfda8efbb966b))
* bridge message ([b1048dc](https://github.com/aeternity/aepp-bridge-and-swap/commit/b1048dc5b6cc2d31aac518dd1c1b0494305f7b62))
* check maximum amount exceed ([95a10e3](https://github.com/aeternity/aepp-bridge-and-swap/commit/95a10e343582ca35cdb7732280095738b9f0f917))
* clear one input when entering 0 on the other ([4e8ca30](https://github.com/aeternity/aepp-bridge-and-swap/commit/4e8ca303942c76504fff2321f74f9d20a2b842cf))
* dark mode background color ([90abdcb](https://github.com/aeternity/aepp-bridge-and-swap/commit/90abdcb701b5ab70d174db6d7ec3b35a46951d27))
* disconnect wallets only on step 1 ([951faba](https://github.com/aeternity/aepp-bridge-and-swap/commit/951faba260dd72c4527a543e90d323fb2fd4e1a4))
* do not wrap div in p ([7c263b7](https://github.com/aeternity/aepp-bridge-and-swap/commit/7c263b74573d5e07d877cbf6edb13e7314f5aa0d))
* failed build ([f7b93a8](https://github.com/aeternity/aepp-bridge-and-swap/commit/f7b93a80d10fd56db97fc9477a7e1a48b991f87a))
* failed build ([68ab067](https://github.com/aeternity/aepp-bridge-and-swap/commit/68ab067d63a5eab47bb32b76c9da2465d733165a))
* messages during step 3 ([302360c](https://github.com/aeternity/aepp-bridge-and-swap/commit/302360cfdca1629e11869b4d3ecda69e124068e8))
* **mobile:** redirect to the chosen flow and step on connect ([bd8c45b](https://github.com/aeternity/aepp-bridge-and-swap/commit/bd8c45b38922c928e20e4ad8461a7dc0de053ccb))
* navigation button hover color on light theme ([c46d52a](https://github.com/aeternity/aepp-bridge-and-swap/commit/c46d52af2d4df53fc299a3edb7f17936bda05264))
* responsiveness ([0f64d84](https://github.com/aeternity/aepp-bridge-and-swap/commit/0f64d84b42071e59d1f47aeafdad5dac71277fa1))
* restrict negative numbers in input ([c10b097](https://github.com/aeternity/aepp-bridge-and-swap/commit/c10b097f54eedb2e55bec6229ab6687b88c23500))
* show actual amount of aeternity to be received ([eea3242](https://github.com/aeternity/aepp-bridge-and-swap/commit/eea32429365acdadf1f41c746f2a7e9c21d21f08))
* sign with correct ethereum provider ([689071a](https://github.com/aeternity/aepp-bridge-and-swap/commit/689071ab42b535fd87d7d0f93ca2c76b49ccf7f7))
* typo in import ([c1cc74e](https://github.com/aeternity/aepp-bridge-and-swap/commit/c1cc74eb5129efde0d05fd96684ec1a38ce2f5bf))


### CI / CD

* be able to build the project ([5987a61](https://github.com/aeternity/aepp-bridge-and-swap/commit/5987a61b0b87817f7b144d3d0f666668dfd454c7))
* be able to pass the environment variables ([5489839](https://github.com/aeternity/aepp-bridge-and-swap/commit/548983944979b1154074ec92544d71698ceb3b8f))


### Refactorings

* back and next button styling ([59d3532](https://github.com/aeternity/aepp-bridge-and-swap/commit/59d353231964dcd9087177b7e32395e85c65f609))
* rename env variables ([c3a9747](https://github.com/aeternity/aepp-bridge-and-swap/commit/c3a974749b9032e099395acfcbe6cbdc65b3bc44))


### Miscellaneous

* missing AE_PRIVATE_KEY definition ([3e766bd](https://github.com/aeternity/aepp-bridge-and-swap/commit/3e766bda3f2cc16b9d235c4c98bcc4e6bc4af773))
