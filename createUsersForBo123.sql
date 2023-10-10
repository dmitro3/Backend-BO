DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
  `email` varchar(255) DEFAULT NULL UNIQUE,
  `password` varchar(255) DEFAULT NULL,
  `permissions` varchar(255) DEFAULT NULL,
  `last_login` varchar(255) DEFAULT NULL,
  `ref_code` varchar(255) DEFAULT NULL UNIQUE,
  `nick_name` varchar(255) DEFAULT NULL UNIQUE,
  `upline_id` varchar(255) DEFAULT NULL UNIQUE,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL UNIQUE,
  `address` varchar(255) DEFAULT NULL,
  `secondary_address` varchar(255) DEFAULT NULL,
  `job_position` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `secondary_phone` varchar(255) DEFAULT NULL,
  `secondary_email` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `skype` varchar(255) DEFAULT NULL,
  `facebook` varchar(255) DEFAULT NULL,
  `twitter` varchar(255) DEFAULT NULL,
  `google_plus` varchar(255) DEFAULT NULL,
  `youtube` varchar(255) DEFAULT NULL,
  `github` varchar(255) DEFAULT NULL,
  `interest` varchar(255) DEFAULT NULL,
  `about` varchar(255) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `personal_quota` varchar(255) DEFAULT NULL,
  `active` int DEFAULT '0',
  `verified` int DEFAULT '0',
  `super_user` int DEFAULT '0',
  `manage_supers` int DEFAULT '0',
  `offer_account` int DEFAULT '0',
  `btc_balance` decimal(18, 8) DEFAULT '0.00000000',
  `eth_balance` decimal(28, 18) DEFAULT '0.000000000000000000',
  `bnb_balance` decimal(18, 8) DEFAULT '0.00000000',
  `matic_balance` decimal(28, 18) DEFAULT '0.000000000000000000',
  `usdt_eth_balance` decimal(16, 6) DEFAULT '0.000000',
  `usdt_bsc_balance` decimal(16, 6) DEFAULT '0.000000',
  `usdt_matic_balance` decimal(16, 6) DEFAULT '0.000000',
  `usdc_eth_balance` decimal(16, 6) DEFAULT '0.000000',
  `usdc_bsc_balance` decimal(16, 6) DEFAULT '0.000000',
  `usdc_matic_balance` decimal(16, 6) DEFAULT '0.000000',
  `money_deposit` decimal(20, 4) DEFAULT '0.0000',
  `money_withdrawal` decimal(20, 4) DEFAULT '0.0000',
  `super_account` int DEFAULT '0',
  `wallet_his` varchar(255) DEFAULT NULL,
  `wallet_order_offer` decimal(20, 2) DEFAULT NULL,
  `sponsor` varchar(255) DEFAULT NULL,
  `money_wallet_his` decimal(20, 4) DEFAULT '0.0000',
  `vip_user` int DEFAULT '0',
  `level_vip` int DEFAULT '0',
  `id_front` varchar(255) DEFAULT NULL,
  `id_back` varchar(255) DEFAULT NULL,
  `pending_commission` int DEFAULT '0',
  `commission_vip` int DEFAULT '0',
  `commission_update` varchar(255) DEFAULT NULL,
  `crypted_evm_native_wallet` varchar(1024) DEFAULT NULL,
  `crypted_evm_erc20_wallet` varchar(1024) DEFAULT NULL,
  `crypted_btc_wallet` varchar(1024) DEFAULT NULL,
  `evm_native_address` varchar(255) DEFAULT NULL,
  `evm_erc20_address` varchar(255) DEFAULT NULL,
  `btc_address` varchar(255) DEFAULT NULL,
  `completed_profile` int DEFAULT '0',
  `active_2fa` int DEFAULT '0',
  `secret_2fa` varchar(255) DEFAULT NULL,
  `code_secure` varchar(255) DEFAULT NULL,
  `pricePlay` decimal(16, 6) DEFAULT '0.000000',
  `priceWin` decimal(16, 6) DEFAULT '0.000000',
  `priceLose` decimal(16, 6) DEFAULT '0.000000',
  `marketing` int DEFAULT '0',
  `so_cmnd` varchar(255) DEFAULT NULL UNIQUE,
  `language` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `created_at` varchar(255) DEFAULT NULL,
  `updated_at` varchar(255) DEFAULT NULL,
  `deleted_at` varchar(255) DEFAULT NULL
);

DROP TABLE IF EXISTS `account`;

CREATE TABLE `account` (
  `id` int NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
  `email` varchar(255) DEFAULT NULL,
  `u_id` varchar(255) DEFAULT NULL UNIQUE,
  `type` int DEFAULT '0',
  `win` decimal(16, 6) DEFAULT '0.000000',
  `lose` decimal(16, 6) DEFAULT '0.000000',
  `balance` decimal(16, 6) DEFAULT '0.000000',
  `deposit` int DEFAULT '0',
  `withdrawal` int DEFAULT '0',
  `order_amount` decimal(16, 6) DEFAULT '0.000000',
  `created_at` varchar(255) DEFAULT NULL,
  `updated_at` varchar(255) DEFAULT NULL,
  `deleted_at` varchar(255) DEFAULT NULL
);

DROP TABLE IF EXISTS `add_money_history`;

CREATE TABLE `add_money_history` (
  `id` int NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
  `nick_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `type` int DEFAULT '0',
  `price_USDT` decimal(20, 4) DEFAULT '0.0000',
  `price_USDC` decimal(20, 4) DEFAULT '0.0000',
  `price_ETH` decimal(20, 4) DEFAULT '0.0000',
  `price_BNB` decimal(20, 4) DEFAULT '0.0000',
  `price_MATIC` decimal(20, 4) DEFAULT '0.0000',
  `price_BTC` decimal(20, 4) DEFAULT '0.0000',
  `price_VN` decimal(20, 4) DEFAULT '0.0000',
  `price_PAYPAL` decimal(20, 4) DEFAULT '0.0000',
  `created_at` varchar(255) DEFAULT NULL,
  `updated_at` varchar(255) DEFAULT NULL,
  `deleted_at` varchar(255) DEFAULT NULL
);

DROP TABLE IF EXISTS `bet_history`;

CREATE TABLE `bet_history` (
  `id` int NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
  `email` varchar(255) DEFAULT NULL,
  `id_account` varchar(255) DEFAULT NULL,
  `type_account` int DEFAULT '0',
  `buy_sell` varchar(255) DEFAULT NULL,
  `currency` varchar(255) DEFAULT NULL,
  `amount_win` decimal(16, 6) DEFAULT '0.000000',
  `amount_lose` decimal(16, 6) DEFAULT '0.000000',
  `amount_bet` decimal(16, 6) DEFAULT '0.000000',
  `open` decimal(28, 18) DEFAULT '0.000000000000000000',
  `close` decimal(28, 18) DEFAULT '0.000000000000000000',
  `session` int NOT NULL DEFAULT '0',
  `marketing` int DEFAULT '0',
  `status` int DEFAULT '1',
  `created_at` varchar(255) DEFAULT NULL
);

DROP TABLE IF EXISTS `commission_history`;

CREATE TABLE `commission_history` (
  `id` int NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
  `email` varchar(255) DEFAULT NULL,
  `from_upid` varchar(255) DEFAULT NULL,
  `ref_id` varchar(255) DEFAULT NULL,
  `upline_id` varchar(255) DEFAULT NULL,
  `pending_commission` decimal(16, 6) DEFAULT '0.000000',
  `personal_trading_volume` decimal(16, 6) DEFAULT '0.000000',
  `vip_commission` varchar(20) DEFAULT '0',
  `type` varchar(255) DEFAULT NULL,
  `marketing` int DEFAULT '0',
  `session` int DEFAULT '0',
  `created_at` varchar(255) DEFAULT NULL,
  `status` int DEFAULT '1'
);

DROP TABLE IF EXISTS `exchange_history`;

CREATE TABLE `exchange_history` (
  `id` int NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
  `email` varchar(255) DEFAULT NULL,
  `nick_name` varchar(255) DEFAULT NULL,
  `from_e` varchar(255) DEFAULT NULL,
  `to_e` varchar(255) DEFAULT NULL,
  `send` varchar(255) DEFAULT NULL,
  `receive` varchar(255) DEFAULT NULL,
  `status` int DEFAULT '0',
  `delete_status` int DEFAULT '0',
  `created_at` varchar(255) DEFAULT NULL
);

DROP TABLE IF EXISTS `notifi`;

CREATE TABLE `notifi` (
  `id` int NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
  `cu_email` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `views` int DEFAULT '0',
  `created_at` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL
);

DROP TABLE IF EXISTS `telegram`;

CREATE TABLE `telegram` (
  `id` int NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
  `form` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL
);

DROP TABLE IF EXISTS `trade_history`;

CREATE TABLE `trade_history` (
  `id` int NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
  `email` varchar(255) DEFAULT NULL,
  `from_u` varchar(255) DEFAULT NULL,
  `to_u` varchar(255) DEFAULT NULL,
  `type_key` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `network` varchar(255) DEFAULT NULL,
  `paypal` decimal(20, 4) DEFAULT '0.0000',
  `paypal_order_id` decimal(20, 4) DEFAULT '0.0000',
  `pay_fee` decimal(20, 4) DEFAULT '0.0000',
  `fee_withdraw` decimal(20, 4) DEFAULT '0.0000',
  `currency` varchar(255) DEFAULT NULL,
  `amount` decimal(20, 4) DEFAULT '0.0000',
  `real_amount` decimal(20, 4) DEFAULT '0.0000',
  `note` varchar(255) DEFAULT NULL,
  `status` int DEFAULT '0',
  `delete_status` int DEFAULT '0',
  `created_at` varchar(255) DEFAULT NULL,
  `bank` varchar(255) DEFAULT NULL
);

DROP TABLE IF EXISTS `gather_crypto_history`;

CREATE TABLE gather_crypto_history (
  `id` int NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
  `user_id` int NOT NULL,
  `token_name` varchar(255) NOT NULL,
  -- btc, eth, bnb, matic, usdt, usdc
  `network` varchar(255) NOT NULL,
  -- btc, eth, bnb, matic
  `amount` decimal(28, 18) DEFAULT '0.000000000000000000',
  `tx_hash` varchar(512) NOT NULL UNIQUE,
  `is_settle` boolean DEFAULT false,
  `created_at` varchar(255) DEFAULT NULL,
  `settled_at` varchar(255) DEFAULT NULL
);

DROP TABLE IF EXISTS `handle_after_gather_crypto`;

CREATE TABLE handle_after_gather_crypto (
  `id` int NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
  `withdrawCryptoMap` JSON,
  `usersHaveMoney` JSON,
  `unMatchBalanceUserIds` JSON,
  `unsettleTxsUserIds` JSON,
  `created_at` varchar(255) DEFAULT NULL,
  `settled_at` varchar(255) DEFAULT NULL
);

DROP TABLE IF EXISTS `deposit_crypto_history`;

CREATE TABLE deposit_crypto_history (
  `id` int NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
  `user_id` int NOT NULL,
  `token_name` varchar(255) NOT NULL,
  `amount` decimal(28, 18) DEFAULT '0.000000000000000000',
  `tx_hash` varchar(512) NOT NULL UNIQUE,
  `crypto_price` decimal(14, 2) DEFAULT '0.00',
  `created_at` varchar(255) DEFAULT NULL
);

-- btc_balance, eth_balance, bnb_balance, matic_balance, usdt_eth_balance, usdt_bsc_balance, usdt_matic_balance, usdc_eth_balance, usdc_bsc_balance, usdc_matic_balance, crypted_evm_native_wallet, crypted_evm_erc20_wallet, crypted_btc_wallet, evm_native_address, evm_erc20_address, btc_address