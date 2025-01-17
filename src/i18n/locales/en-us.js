const texts = {
  wallet: 'Wallet',
  swap: 'Swap',
  pool: 'Pool',
  explore: 'Explore',

  market: 'Market',
  limit: 'Limit',
  done: 'Done',

  about: 'About',
  txs: 'transactions',
  website: 'Website',
  per: 'per',
  pair_stat: 'Pair statistics',
  total_liq: 'Total liquidity',
  volume: 'Volume',
  hrs: 'hrs',
  pooled_tokens: 'Pooled tokens',

  name: 'Name',
  total_value: 'Total_value',
  time: 'Time',

  connect_wallet: 'Connect Wallet',
  connected_account: 'Connected Account',
  show_qr_code: 'Show address QR code',
  qr_code: 'Address QR',
  copy_account: 'Copy account address',
  switch_wallet: 'Switch wallet',
  go_to_infopage: 'Go to account page',
  disconnect_account: 'Disconnect account',
  copied: 'Copied',

  you_pay: 'You Pay',
  your_balance: 'Your balance',
  you_receive: 'You Receive',
  estimated: 'estimated',
  price: 'Price',
  slippage_tolerance: 'Slippage Tolerance',
  enter_amount: 'Enter an amount',
  minimum_received: 'Minimum received',
  price_impact: 'Price impact',
  fee: 'Fee',

  tx_settings: 'Transaction settings',
  reset: 'Reset',
  tolerance_desc:
    'You will be notified in the Swap UI if the price impact of a trade is bigger than slippage tolerance',

  select_token: 'Select a token',

  search_token_holder: 'Search Genesis ID or name',
  swapping_for: 'Swapping %1 for %2',
  time_left: 'Estimated %s time left',
  view_tx_detail: 'View transaction details',
  tx_details: 'Transaction details',
  status: 'Status',
  paid: 'Paid',
  received: 'Received',
  swap_fee: 'Miners fee',
  date: 'Date',
  onchain_tx: 'Onchain Transaction',
  confirmation: 'confirmation',

  pair_liq_pool: 'Pair Liquidity Pool',
  add_liq: 'Add Liquidity',
  add_liq_short: 'Deposit',
  remove_liq: 'Remove Liquidity',
  remove_liq_short: 'Withdraw',
  create_pair: 'Create a pair',
  select_pair: 'Select pair',
  promote: 'Promote',
  input: 'Input',
  balance: 'Balance',
  pool_share: 'Prices and pool share',
  pooled: 'Pooled %s',
  your_share: 'Your share of Pool',
  volume_24h: 'Volume(24h) in SPACE',
  fee_24h: 'LP Fees(24h) in SPACE',
  select_a_token_pair: 'Select a token pair',
  supply_liq: 'Supply liquidity',
  pair_created: 'Pair successfully created',
  share_pair: 'Share link to %s pair',

  volume_24: 'Volume 24h',
  txs_24: 'TXs 24h',
  fees_24: 'Fees 24h',
  users_24: 'Users 24h',
  tokens_coins: 'Tokens and Coins',
  asset: 'Asset',
  change_24: 'Change 24h',
  last_7: 'Last 7 days',
  market_cap: 'Market cap',

  select_wallet_title: 'Select a wallet to connect',
  permission_request: 'MVCSwap permission request',
  agree_switch: 'Agree and switch',
  cancel: 'Cancel',

  your_account: 'Your Account',
  your_active: 'Your activity',
  your_balances: 'Your balances',
  your_liq: 'Your liquidity provision',
  manage: 'Manage',
  no_liq: 'You have not provided any liquidity',
  your_open_order: 'Your open limit orders',
  no_order: 'You have no open limit orders',
  open_order: 'Open a limit order',
  no_active: 'You have no recent activity',
  explore_tokens: 'Explore tokens',
  adds: 'Adds',
  swaps: 'Swaps',
  liq: 'Liquidity',
  all: 'All',
  pair: 'Pair',
  expires_in: 'Expires in',
  cancel_all: 'Cancel all',
  total: 'Total',

  back_prort: 'Back to Your Portfolio',
  your_total_liq: 'Your total liquidity',
  include_fees: 'Including fees',
  fees_earned: 'Fees earned',
  cumulative: 'Cumulative',

  back: 'Back',
  add: 'Add',
  remove: 'Remove',
  max: 'Max',
  liq_removed: 'Liquidity removed',
  your_pos: 'Your removed position',
  your_re_liq: 'Your redeemed liquidity',
  earned: 'Earned',

  launch_app: 'Launch APP',
  mvcswap: 'Welcome To MVCSwap',
  mvcswap_desc:
    'Experience UTXO-Based DEX with unmatched Security, Scalability, and Speed',
  documentation: 'Learn More',
  comparisons: 'Comparisons',
  feature: 'Features',
  feature_h5: 'Features',
  feature_privacy: 'Privacy',
  privacy_desc:
    "UTXO model can provide enhanced privacy features for DEX due to its unique transaction structure. In UTXO-based blockchains, transactions do not directly reference the sender's and receiver's addresses. Instead, they consume and create UTXOs, which are associated with the addresses. This makes it more difficult to track the flow of tokens and link transactions to specific users.",
  feature_security: 'Security',
  security_desc:
    'By employing UTXO-based chain transactions, front-running can be eliminated, ensuring users no longer need to worry about sandwich attacks. Tokens that use the UTXO model do not require pre-authorization for contracts, thereby avoiding potential malicious attacks from contracts.',
  feature_speed: 'Speed',
  speed_desc:
    'Utilizing zero-confirmation technology enables transactions to receive instant responses, significantly improving the user experience. This rapid response time allows users to enjoy a smoother and more efficient trading process, which in turn encourages higher engagement and satisfaction with the platform.',
  feature_scalability: 'Scalability',
  scalability_desc:
    'Each UTXO contract can operate and validate independently on the chain, allowing for the full utilization of modern multi-core processors to execute and verify contracts in parallel. This significantly enhances the TPS (Transactions Per Second) of smart contracts.',
  cex: 'CEX',
  other_dex: 'Other DEX',
  lb_1: 'Funds kept in non-custodial wallet',
  lb_2: 'Onchain trading',
  lb_3: '0 confirmation on deposit/instant deposit',
  lb_4: 'Instant withdrawal',
  lb_5: '0 withdrawal fee',
  lb_6: 'Unlimited TPS (compared with ETH)',
  lb_7: 'Free from exchange hacks because of account information leakage',
  lb_8: 'Free of unplug, manipulation from exchanges that fake or delete user data for their own favor',
  lb_9: 'No front-running, which happens on ETH DEXs that causes loss to users',
  lb_10:
    'Instant matching between users or user-pool with low fees, instant settlement',

  refresh_url: 'Click Refresh QR Code',
  swap_anyway: 'Swap Anyway',
  select: 'Select',
  login: 'Log In',
  lac_balance: 'Insufficient Balance',
  lac_token_balance: 'Insufficient %s Balance',
  need_token: 'Need',
  you_have: 'You have',
  no_pair: 'No such pair',
  not_enough: 'Insufficient %s liquidity',
  lower_amount: 'Minimum %s Sats required',
  pay: 'Pay',
  just: 'Just Now',
  minute_ago: ' minute ago',
  minutes_ago: ' minutes ago',
  hour_ago: ' hour ago',
  hours_age: ' hours ago',
  day_ago: ' day ago',
  days_ago: ' days ago',
  week_ago: ' week ago',
  weeks_ago: ' weeks ago',
  month_ago: ' month ago',
  months_ago: ' months ago',
  year_ago: ' year ago',
  years_ago: ' years ago',
  start_swapping: 'Start Swapping',
  start_pooling: 'Start Pooling',
  wallet_connected: 'Connected wallet',
  account: 'Account',
  withdraw: 'Withdraw',

  web_wallet: 'Web Wallet',
  web_wallet_tips:
    'Note：Note：Web wallet is generated by hashing username + password combination, the private key is neither stored locally nor uploaded to any server. Web wallet is supposed to be only used for testing, not suitable for storing large amounts, please keep well of your username + password, remove your funds to other wallets recommened after testing. Loss of username + password  combination will leads to loss of funds associated with it.',
  deposit_title: 'Deposit Web Wallet',
  withdraw_title: 'Withdraw',
  availabel: 'Availabel',
  money: 'Amount',
  address: 'Address',
  paymail: 'paymail',
  all_balance: 'Max',
  back_to_swap: 'Back to Swap',
  swap_question:
    'You have to add both MVC and pair token into the pool according to current MVC/Token share',
  withdraw_success: 'Withdraw success!',
  add_success: 'Success',
  swap_price_change_title: 'Price change alert',
  swap_price_change_content:
    'You are swapping %1 for %2, price of tokenA changed %3 in last 30 seconds',
  liq_price_change_title: 'Pool ratio change alert',
  liq_price_change_contnet:
    'There is transaction happened, your input amount changed from %1 to %2',
  liq_remove_price_change_content:
    'Transaction happened within last few seconds, your withdrawable fund changed from %1 to %2',
  continue_add_liq: 'Continue',
  continue_remove_liq: 'Continue',
  your_lp: 'Your LP(%s)  balance',
  total_lp: 'Total LP(%s) supply',
  txs_fail: 'Transaction failed',
  notice: 'Notice',
  notice2709:
    '⚠️ MVCSwap trading pairs are created by users permissionless. Be aware of potential risks when trading',

  cant_remove: 'You have no liquidity to remove',
  insufficient_balance: 'Exceeded available balance',
  test_only: 'Keep the private key safe',
  swap_success: 'Swap success',
  lp_balance: 'Available to withdraw',
  added: 'Added',

  farm: 'Farm',
  lock_earn: 'Lock and earn',
  depositors: 'Depositors',
  crop: 'Yield',
  harvest: 'Harvest',
  farm_desc:
    'Provide liquidity and deposit your LP tokens to earn and harvest tokens',
  last_block_height: 'Latest MVC block height:',
  your_deposited_lp: 'Your deposited LP',
  abandoned_deposited_lp:
    'Withdraw all your LP token and yield, deposit LP token to the new contract',
  apy_info:
    'APR = rewardTokenAmountPerBlock * 144 * 365 *  Token price / TVL * 100%',
  deposit: 'Deposit',
  earn: 'Earn',
  deposit_success: 'Deposit successful',
  deposited: 'deposited',
  deposit_earn: 'Deposit & Earn',
  start_deposit: 'Start Deposit',
  start_withdraw: 'Start Withdraw',
  farm_withdraw: 'Withdraw',
  farm_withdraw_success: 'Withdraw successful',
  withdrew: 'Withdrew',
  tvl: 'TVL',
  apy: 'APR',
  yield_tips: 'your withdrawable yield: %s',
  harvest_success: 'Yield Withdrawal successful',
  amount: 'Amount',
  payout: 'Payout',
  payout_tips: 'Payout per MVC block',
  deposit_lp: 'Deposit LP',
  withdraw_lp: 'Withdraw LP',

  create_new_pair: 'Create',
  create_newpair: 'Create new token pair',
  newpair_title: 'MVCSwap requirements to create a new token pair',
  newpair_desc1: 'Agree you’re not a scammer or rug puller',
  newpair_desc2: '5 SPACE to pay for the creating one pair',
  newpair_desc3: 'The SensibleId of the new token',
  newpair_desc4: 'Tokens to add to the genesis liquidity',
  newpair_note1:
    'Note: MVCSwap reserves the right to hide any pairs at any time',
  newpair_note2: 'Learn more about possible reasons for delistings here',
  add_details: 'Add details',
  pay_fee: 'Pay fee',
  finish: 'Finish',
  enter_tokenid: 'Enter Token SensibleId',
  enter_mvc_or_tokenid: 'Enter MVC or Token Genesis ID',
  find_tokenid: 'Token SensibleId can be found on',
  check_create_doc: 'Learn how to create trading pairs',
  select_token_pair: 'Input a token',
  next_step: 'Next step',
  pay_listing_fee: 'Pay creating fee',
  confirm_and_pay: 'Confirm details and pay fee',
  choose_fee_tier: 'Choose fee tier',
  confirm_pair_desc:
    'A single payment of 5 SPACE is required to create this token pair on MVCSwap',
  edit: 'Edit',
  create_success: 'Pair successfully created',
  curated_tokens: 'Curated Tokens',
  unverified_zone: 'Unverified Zone',
  risks_dis: 'Risks and Disclaimers',
  risks_desc:
    'Please read, review and acknowledge the Risks and Disclaimers documentation before proceeding to use MVCSwap.',
  acknowlege: 'Acknowlege',
  not_acknowlege: 'Do not acknowledge',
  download_metalet:
    'Install Metalet extention. Refresh the page if you have installed.',

  //创建自定义交易对
  create_farm_pair: 'Create liquidity mining program',
  enter_details: 'Enter details',
  deposit_rewards: 'Deposit rewards',
  lptoken_genesis_id: 'Genesis ID of LP token',
  reward_genesis_id: 'Genesis ID of reward token',
  reward_per_block: 'Reward per block',
  duration_in_days: 'Duration in days',
  avg_per_block: 'Avg. 10 mins per MVC block',
  minimum_days: 'Minimum %s days',
  create_farm_tips: 'Please have your reward tokens ready for next step',
  reward_estimate: 'Approx. %s reward tokens to be deposited',
  check_create_farm_title: 'Deposit reward token into contract',
  check_create_farm_desc:
    'You will not be able to withdraw while liquidity mining is active',
  reward: 'Reward',
  duration: 'Duration',
  deposit_and_create: 'Deposit and create program',
  create_farm_success: 'Successfully created',
  create_farm_success_desc: 'Your liquidity mining program (LMP) is now live',
  network_fee: 'Network fee',
  only_custom_token: 'Token should be your project token',

  tokenb_tips: 'Token should be your project token',
  tmp_tips:
    'This is a test pair, remove your liquidity, the pair will be delisted after a week.',

  //stake
  stake: 'Stake',
  stake_desc: 'Stake %s to earn %1 and voting power',
  your_staked: 'Your staked',
  total_staked: 'Total Staked',
  unstaked: 'Unstaked',
  withdraw_stake: 'Unstaked',
  vesting_term: 'Vesting term',
  staking_yield: 'Staking Yield',
  unstake: 'Unstake',
  stake_amount: 'Stake amount',
  unstake_amount: 'Unstake amount',
  stake_successful: 'Stake successful',
  staked: 'Staked',
  done: 'Done',
  unstake_by_repaying: 'Unstake by Repaying',
  start_stake: 'Start stake',
  unstake_successful: 'Unstake successful',
  cant_unlock: 'cant unlock',

  block_later: 'block later',
  blocks_later: 'blocks later',

  vote: 'Vote',
  pending: 'Pending',
  cancelled: 'Cancelled',
  ongoing: 'Ongoing',
  passed: 'Passed',
  rejected: 'Rejected',
  agreed: 'Agreed',
  reject: 'Reject',
  change_vote: 'you can change your vote during the voting period',
  no_stake: 'do not have stake tokens',
  payout_per_block: 'Payout per block',
  total_votes: 'Total Votes:',
  min_vote_amount: 'Min Vote Amount:',
  vesting_term: 'Voting ends: %s blocks later',
  from_block: 'from block',
  to_block: 'to block',
};
module.exports = texts;
