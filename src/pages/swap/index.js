'use strict';
import React, { Component } from 'react';
import { connect } from 'umi';
import debug from 'debug';
import EventBus from 'common/eventBus';
import { gzip } from 'node-gzip';
import BigNumber from 'bignumber.js';
import { Button, Form, Input, message, Spin } from 'antd';
import { slippage_data, feeRate, FEE_FACTOR, MINAMOUNT } from 'common/config';
import { formatAmount, formatSat, jc, formatTok } from 'common/utils';
import CustomIcon from 'components/icon';
import FormatNumber from 'components/formatNumber';
import PairIcon from 'components/pairIcon';
import Loading from 'components/loading';
import SelectToken from '../selectToken';
import styles from './index.less';
import _ from 'i18n';
import { BtnWait } from 'components/btns';
import { SuccessResult } from 'components/result';
import { Arrow2 } from '../../components/ui';

const log = debug('swap');

const { slippage_tolerance_value, defaultSlipValue } = slippage_data;

const FormItem = Form.Item;

@connect(({ user, pair, loading }) => {
  const { effects } = loading;
  return {
    ...user,
    ...pair,
    loading: effects['pair/getAllPairs'] || effects['pair/getPairData'],
    submiting:
      effects['pair/reqSwap'] ||
      effects['pair/token1toToken2'] ||
      effects['pair/token2toToken1'] ||
      effects['user/transferBsv'] ||
      effects['user/transferAll'] ||
      false,
  };
})
export default class Swap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 'form',
      formFinish: false,
      origin_amount: 0,
      aim_amount: 0,
      slip: 0,
      fee: 0,
      txFee: 0,
      lastMod: '',
      dirForward: true, //交易对方向，true正向 false反向
      // bsvToToken: true,
      modalVisible: false,
      tol:
        window.localStorage.getItem(slippage_tolerance_value) ||
        defaultSlipValue,
    };
    this.formRef = React.createRef();
  }

  switch = async () => {
    let { dirForward } = this.state;
    this.setState(
      {
        dirForward: !dirForward,
      },
      () => {
        const { current } = this.formRef;
        const { origin_amount, aim_amount } = current.getFieldsValue([
          'origin_amount',
          'aim_amount',
        ]);
        const { lastMod } = this.state;
        const { token1, token2 } = this.props;
        const decimal = !dirForward ? token1.decimal : token2.decimal;
        if (lastMod === 'origin') {
          current.setFieldsValue({
            aim_amount: origin_amount,
          });
          const { newOriginAddAmount } = this.calcAmount(0, origin_amount);
          const fee = formatAmount(
            BigNumber(newOriginAddAmount).multipliedBy(feeRate),
            decimal,
          );
          this.setState({
            lastMod: 'aim',
            aim_amount: origin_amount,
            fee,
          });
        } else if (lastMod === 'aim') {
          current.setFieldsValue({
            origin_amount: aim_amount,
          });
          this.calcAmount(aim_amount, 0);
          const fee = formatAmount(
            BigNumber(aim_amount).multipliedBy(feeRate),
            decimal,
          );
          this.setState({
            lastMod: 'origin',
            origin_amount: aim_amount,
            fee,
          });
        }
      },
    );
  };

  showUI = (name) => {
    this.setState({
      page: name,
    });
  };

  changeOriginAmount = (e) => {
    let value = e.target.value;
    const { token1, token2 } = this.props;
    const { dirForward } = this.state;
    const decimal = dirForward ? token1.decimal : token2.decimal;
    if (value > 0) {
      value = formatAmount(value, token1.decimal);
      this.formRef.current.setFieldsValue({
        origin_amount: value,
      });
      const fee = formatAmount(BigNumber(value).multipliedBy(feeRate), decimal);
      this.setState({
        origin_amount: value,
        fee,
        lastMod: 'origin',
      });
      // this.calc(value - fee);
      this.calcAmount(value, 0);
    } else {
      this.formRef.current.setFieldsValue({
        aim_amount: 0,
      });
      this.setState({
        fee: 0,
        slip: 0,
        lastMod: '',
        aim_amount: 0,
      });
    }
  };

  changeAimAmount = (e) => {
    let value = e.target.value;
    const { decimal } = this.props.token2;
    if (value > 0) {
      value = formatAmount(value, decimal);
      this.formRef.current.setFieldsValue({
        aim_amount: value,
      });
      this.setState({
        aim_amount: value,
        lastMod: 'aim',
      });
      this.calcAmount(0, value);
    } else {
      this.formRef.current.setFieldsValue({
        origin_amount: 0,
      });
      this.setState({
        fee: 0,
        slip: 0,
        lastMod: '',
        origin_amount: 0,
      });
    }
  };

  renderOriginToken() {
    const { pairData } = this.props;
    const { swapToken1Amount, swapToken2Amount } = pairData;
    const { dirForward } = this.state;
    return (
      <div className={styles.box}>
        <div className={styles.coin} onClick={() => this.showUI('selectToken')}>
          <PairIcon keyword={dirForward ? 'token1' : 'token2'} size={40} />
          <div className={styles.arrow}>
            <CustomIcon type="iconDropdown" />
          </div>
        </div>
        <FormItem name="origin_amount">
          <Input
            className={styles.input}
            onChange={this.changeOriginAmount}
            disabled={swapToken1Amount === '0' || swapToken2Amount === '0'}
          />
        </FormItem>
      </div>
    );
  }

  renderAimToken() {
    const { pairData } = this.props;
    const { swapToken1Amount, swapToken2Amount } = pairData;
    const { dirForward } = this.state;
    return (
      <div className={styles.box}>
        <div className={styles.coin} onClick={() => this.showUI('selectToken')}>
          <PairIcon keyword={dirForward ? 'token2' : 'token1'} size={40} />
          <div className={styles.arrow}>
            <CustomIcon type="iconDropdown" />
          </div>
        </div>
        <FormItem name="aim_amount">
          <Input
            className={styles.input}
            onChange={this.changeAimAmount}
            disabled={swapToken1Amount === '0' || swapToken2Amount === '0'}
          />
        </FormItem>
      </div>
    );
  }

  setOriginBalance = () => {
    const { accountInfo, token1, token2, pairData } = this.props;
    const { userBalance } = accountInfo;
    const { swapToken1Amount, swapToken2Amount } = pairData;
    const { dirForward } = this.state;
    const decimal = dirForward ? token1.decimal : token2.decimal;
    if (swapToken1Amount === '0' || swapToken2Amount === '0') {
      return;
    }

    let origin_amount = this.state.dirForward
      ? token1.isBsv
        ? userBalance.BSV * 0.98 || 0
        : userBalance[token1.tokenID]
      : userBalance[token2.tokenID] || 0;
    origin_amount = formatAmount(origin_amount, decimal);
    this.formRef.current.setFieldsValue({
      origin_amount,
    });
    this.setState({
      origin_amount,
    });
    this.calcAmount(origin_amount, 0);
    if (origin_amount > 0) {
      this.setState({
        // origin_amount,
        lastMod: 'origin',
        fee: formatAmount(
          BigNumber(origin_amount).multipliedBy(feeRate),
          decimal,
        ),
      });
    } else {
      this.setState({
        lastMod: '',
      });
    }
  };
  calcAmount = (originAddAmount = 0, aimAddAmount = 0, pairData) => {
    if (!pairData) pairData = this.props.pairData;
    const { token1, token2 } = this.props;
    const { dirForward } = this.state;
    const { swapToken1Amount, swapToken2Amount, swapFeeRate } = pairData;
    let amount1 = dirForward ? swapToken1Amount : swapToken2Amount;
    let amount2 = dirForward ? swapToken2Amount : swapToken1Amount;
    let decimal1 = dirForward ? token1.decimal : token2.decimal;
    let decimal2 = dirForward ? token2.decimal : token1.decimal;
    let _originAddAmount = BigNumber(originAddAmount).multipliedBy(
      Math.pow(10, decimal1),
    );
    let _aimAddAmount = BigNumber(aimAddAmount).multipliedBy(
      Math.pow(10, decimal2),
    );
    let newAmount1 = BigNumber(amount1),
      newAmount2 = BigNumber(amount2);
    let newOriginAddAmount, newAimAddAmount;
    if (originAddAmount > 0) {
      _originAddAmount = BigInt(_originAddAmount.toFixed(0));
      const addAmountWithFee =
        _originAddAmount * BigInt(FEE_FACTOR - swapFeeRate);
      newAmount1 = BigInt(amount1) + _originAddAmount;
      let removeAmount =
        (addAmountWithFee * BigInt(amount2)) /
        ((BigInt(amount1) + _originAddAmount) * BigInt(FEE_FACTOR));
      removeAmount = BigNumber(removeAmount);
      newAmount2 = BigNumber(amount2).minus(removeAmount);

      removeAmount = formatAmount(
        removeAmount.div(Math.pow(10, decimal2)),
        decimal2,
      );

      this.formRef.current.setFieldsValue({
        aim_amount: removeAmount,
      });
      this.setState({
        aim_amount: removeAmount,
      });
      newOriginAddAmount = originAddAmount;
      newAimAddAmount = removeAmount;
    } else if (aimAddAmount > 0) {
      newAmount2 = BigNumber(amount2).minus(_aimAddAmount);
      _aimAddAmount = BigInt(_aimAddAmount.toString());
      let addAmount =
        (_aimAddAmount * BigInt(FEE_FACTOR) * BigInt(amount1)) /
        (BigInt(FEE_FACTOR - swapFeeRate) * BigInt(amount2) -
          _aimAddAmount * BigInt(FEE_FACTOR));

      addAmount = BigNumber(addAmount);
      addAmount = addAmount.div(Math.pow(10, decimal1));
      newAmount1 = addAmount.plus(amount1);
      let addAmountN = formatAmount(addAmount, decimal1);
      if (!addAmount.isGreaterThan(0)) {
        addAmountN = 0;
        newAmount1 = amount1;
        newAmount2 = BigNumber(amount2);
      }

      this.formRef.current.setFieldsValue({
        origin_amount: addAmountN,
      });
      this.setState({
        origin_amount: addAmountN,
        fee:
          addAmount > 0
            ? formatAmount(addAmount.multipliedBy(feeRate), decimal1)
            : 0,
      });
      newOriginAddAmount = addAmountN;
      newAimAddAmount = aimAddAmount;
    } else {
      //两个值都没有大于0
      this.formRef.current.setFieldsValue({
        origin_amount: originAddAmount,
        aim_amount: aimAddAmount,
      });
      this.setState({
        origin_amount: originAddAmount,
        aim_amount: aimAddAmount,
      });
      newOriginAddAmount = originAddAmount;
      newAimAddAmount = aimAddAmount;
    }

    const p = BigNumber(amount2).dividedBy(amount1);
    const p1 = newAmount2.dividedBy(newAmount1);
    const slip = p1.minus(p).dividedBy(p);

    this.setState({
      slip: slip.multipliedBy(100).abs().toFixed(2).toString() + '%',
    });
    return {
      newOriginAddAmount,
      newAimAddAmount,
    };
  };

  renderForm = () => {
    const { token1, token2, pairData, accountInfo, submiting } = this.props;
    const { userBalance } = accountInfo;
    const { swapToken1Amount, swapToken2Amount } = pairData;
    const { dirForward, tol } = this.state;
    const origin_token = dirForward ? token1 : token2;
    const aim_token = dirForward ? token2 : token1;
    const { slip, fee } = this.state;
    const symbol1 = origin_token.symbol;
    const symbol2 = aim_token.symbol;
    const _swapToken1Amount = formatSat(swapToken1Amount, token1.decimal);
    const _swapToken2Amount = formatSat(swapToken2Amount, token2.decimal);
    const price = dirForward
      ? formatAmount(_swapToken2Amount / _swapToken1Amount, token2.decimal)
      : formatAmount(_swapToken1Amount / _swapToken2Amount, token1.decimal);

    const beyond = parseFloat(slip) > parseFloat(tol);

    return (
      <div className={styles.content}>
        <Spin spinning={submiting}>
          <Form onSubmit={this.handleSubmit} ref={this.formRef}>
            <div className={styles.title}>
              <h3>{_('you_pay')}</h3>
              <div
                className={jc(styles.balance, styles.can_click)}
                onClick={this.setOriginBalance}
              >
                {_('your_balance')}:{' '}
                <span>
                  <FormatNumber
                    value={userBalance[origin_token.tokenID || 'BSV'] || 0}
                    suffix={symbol1}
                  />
                </span>
              </div>
            </div>
            {this.renderOriginToken()}

            <Arrow2 onClick={this.switch} />

            <div className={styles.title}>
              <h3>{_('you_receive')} </h3>
              <div className={styles.balance} style={{ cursor: 'default' }}>
                {_('your_balance')}:{' '}
                <span>
                  <FormatNumber
                    value={userBalance[aim_token.tokenID || 'BSV'] || 0}
                    suffix={symbol2}
                  />
                </span>
              </div>
            </div>

            {this.renderAimToken()}

            <div className={styles.my_pair_info}>
              <div className={styles.key_value}>
                <div className={styles.key}>{_('price')}</div>
                <div className={styles.value}>
                  1 {symbol1} = {price} {symbol2}
                </div>
              </div>
              <div className={styles.key_value}>
                <div className={styles.key}>{_('slippage_tolerance')}</div>
                <div className={styles.value}>
                  <Input
                    value={tol}
                    suffix="%"
                    className={styles.tol}
                    onChange={this.changeTol}
                  />
                </div>
              </div>
              <div className={styles.key_value}>
                <div className={styles.key}>{_('price_impact')}</div>
                <div
                  className={styles.value}
                  style={beyond ? { color: 'red' } : {}}
                >
                  {slip}
                </div>
              </div>
              <div className={styles.key_value}>
                <div className={styles.key}>{_('fee')}</div>
                <div className={styles.value}>
                  <FormatNumber value={fee} suffix={symbol1} />
                </div>
              </div>
            </div>
            {this.renderButton()}
          </Form>
        </Spin>
      </div>
    );
  };

  changeTol = (e) => {
    const value = e.target.value;
    this.setState({
      tol: value,
    });
    localStorage.setItem(slippage_tolerance_value, value);
  };

  renderButton() {
    const { isLogin, pairData, token1, token2, accountInfo } = this.props;
    const { userBalance } = accountInfo;
    const { swapToken1Amount, swapToken2Amount } = pairData;
    const {
      slip,
      lastMod,
      origin_amount,
      aim_amount,
      dirForward,
      tol,
    } = this.state;
    const origin_token = dirForward ? token1 : token2;
    const balance = userBalance[origin_token.tokenID || 'BSV'];

    const beyond = parseFloat(slip) > parseFloat(tol);

    const conditions = [
      { key: 'login', cond: !isLogin },
      {
        cond: swapToken1Amount === '0' || swapToken2Amount === '0',
        txt: _('pair_init'),
      },
      {
        key: 'enterAmount',
        cond:
          !lastMod ||
          (parseFloat(origin_amount) <= 0 && parseFloat(aim_amount) <= 0),
      },
      {
        key: 'lowerAmount',
        cond: parseFloat(origin_amount) <= formatSat(MINAMOUNT),
      },
      {
        key: 'lackBalance',
        cond: parseFloat(origin_amount) > parseFloat(balance || 0),
        txtParam: origin_token.symbol,
      },
    ];

    let _btn = BtnWait(conditions);
    if (_btn) {
      return _btn;
    }
    if (beyond) {
      // 超出容忍度
      return (
        <Button
          className={styles.btn_warn}
          shape="round"
          onClick={this.handleSubmit}
        >
          {_('swap_anyway')}
        </Button>
      );
    } else {
      return (
        <Button
          className={styles.btn}
          type="primary"
          shape="round"
          onClick={this.handleSubmit}
        >
          {_('swap')}
        </Button>
      );
    }
  }

  handleSubmit = async () => {
    const { dirForward, origin_amount } = this.state;
    const {
      dispatch,
      currentPair,
      token1,
      token2,
      rabinApis,
      accountInfo,
    } = this.props;
    const { userBalance, changeAddress, userAddress } = accountInfo;

    const res = await dispatch({
      type: 'pair/reqSwap',
      payload: {
        symbol: currentPair,
        address: userAddress,
        op: dirForward ? 3 : 4,
      },
    });
    const { code, data, msg } = res;
    if (code) {
      return message.error(msg);
    }

    const { bsvToAddress, tokenToAddress, txFee, requestIndex } = data;
    let payload = {
      symbol: currentPair,
      requestIndex: requestIndex,
      op: dirForward ? 3 : 4,
    };
    if (dirForward) {
      // let amount = BigNumber(origin_amount)
      //   .multipliedBy(Math.pow(10, token1.decimal))
      //   .toString();
      let amount = formatTok(origin_amount, token1.decimal);
      // console.log(amount, formatTok(origin_amount, token1.decimal))

      if (token1.isBsv) {
        const userTotal = BigNumber(userBalance.BSV).multipliedBy(1e8);
        let total = BigInt(amount) + BigInt(txFee);
        const _allBalance = total > BigInt(userTotal);
        if (_allBalance) {
          total = userTotal;
          amount = BigInt(userTotal) - BigInt(txFee);
        }
        if (amount < MINAMOUNT) {
          return message.error(_('lower_amount', MINAMOUNT));
        }
        const ts_res = await dispatch({
          type: 'user/transferBsv',
          payload: {
            address: bsvToAddress,
            amount: total.toString(),
            changeAddress,
            note: 'tswap.io(swap)',
            noBroadcast: true,
          },
        });

        if (ts_res.msg) {
          return message.error(ts_res.msg);
        }
        if (_allBalance) {
          amount = amount - BigInt(ts_res.fee || 0);
        }

        payload = {
          ...payload,
          // token1TxID: ts_res.txid,
          bsvOutputIndex: 0,
          bsvRawTx: ts_res.list ? ts_res.list[0].txHex : ts_res.txHex,
          token1AddAmount: amount.toString(),
        };
      } else {
        let tx_res = await dispatch({
          type: 'user/transferAll',
          payload: {
            datas: [
              {
                type: 'bsv',
                address: bsvToAddress,
                amount: txFee,
                changeAddress,
                note: 'tswap.io(swap)',
              },
              {
                type: 'sensibleFt',
                address: tokenToAddress,
                amount,
                changeAddress,
                codehash: token1.codeHash,
                genesis: token1.tokenID,
                rabinApis,
                note: 'tswap.io(swap)',
              },
            ],
            noBroadcast: true,
          },
        });
        if (!tx_res) {
          return message.error(_('txs_fail'));
        }
        if (tx_res.msg) {
          return message.error(tx_res.msg);
        }
        if (tx_res.list) {
          tx_res = tx_res.list;
        }
        if (!tx_res[0] || !tx_res[0].txHex || !tx_res[1] || !tx_res[1].txHex) {
          return message.error(_('txs_fail'));
        }

        payload = {
          ...payload,
          bsvRawTx: tx_res[0].txHex,
          bsvOutputIndex: 0,
          token1RawTx: tx_res[1].txHex,
          token1OutputIndex: 0,
          amountCheckRawTx: tx_res[1].routeCheckTxHex,
        };
      }
    } else {
      // const amount = BigNumber(origin_amount)
      //   .multipliedBy(Math.pow(10, token2.decimal))
      //   .toString();
      const amount = formatTok(origin_amount, token2.decimal);
      // console.log(amount, formatTok(origin_amount, token2.decimal))
      let tx_res = await dispatch({
        type: 'user/transferAll',
        payload: {
          datas: [
            {
              type: 'bsv',
              address: bsvToAddress,
              amount: txFee,
              changeAddress,
              note: 'tswap.io(swap)',
            },
            {
              type: 'sensibleFt',
              address: tokenToAddress,
              amount,
              changeAddress,
              codehash: token2.codeHash,
              genesis: token2.tokenID,
              rabinApis,
              note: 'tswap.io(swap)',
            },
          ],
          noBroadcast: true,
        },
      });
      if (!tx_res) {
        return message.error(_('txs_fail'));
      }
      if (tx_res.msg) {
        return message.error(tx_res.msg);
      }
      if (tx_res.list) {
        tx_res = tx_res.list;
      }
      if (!tx_res[0] || !tx_res[0].txHex || !tx_res[1] || !tx_res[1].txHex) {
        return message.error(_('txs_fail'));
      }

      payload = {
        ...payload,
        bsvRawTx: tx_res[0].txHex,
        bsvOutputIndex: 0,
        token2RawTx: tx_res[1].txHex,
        token2OutputIndex: 0,
        amountCheckRawTx: tx_res[1].routeCheckTxHex,
      };
    }
    let swap_data = JSON.stringify(payload);

    swap_data = await gzip(swap_data);

    const swap_res = await dispatch({
      type: dirForward ? 'pair/token1toToken2' : 'pair/token2toToken1',
      payload: {
        data: swap_data,
      },
    });

    if (swap_res.code && !swap_res.data) {
      return message.error(swap_res.msg);
    }
    message.success('success');
    this.updateData();
    this.setState({
      formFinish: true,
      txid: swap_res.data.txid,
      txFee: txFee,
      realSwapAmount: dirForward
        ? formatSat(swap_res.data.token2Amount, token2.decimal)
        : formatSat(swap_res.data.token1Amount, token1.decimal),
    });
  };

  async updateData() {
    const { dispatch } = this.props;

    await dispatch({
      type: 'pair/getPairData',
      payload: {
        // currentPair,
      },
    });
    setTimeout(() => {
      dispatch({
        type: 'user/loadingUserData',
        payload: {},
      });
    }, 3000);
    EventBus.emit('reloadChart', 'swap');
  }

  renderResult() {
    const {
      origin_amount,
      txFee,
      dirForward,
      txid,
      realSwapAmount,
    } = this.state;
    const { token1, token2 } = this.props;
    const origin_token = dirForward ? token1 : token2;
    const aim_token = dirForward ? token2 : token1;
    const symbol1 = origin_token.symbol;
    const symbol2 = aim_token.symbol;
    return (
      <div className={styles.content}>
        <SuccessResult success_txt={_('swap_success')} done={this.finish}>
          <div className={styles.detail}>
            <div className={styles.line}>
              <div className={styles.detail_item}>
                <div className={styles.item_label}>{_('paid')}</div>
                <div className={styles.item_value}>
                  <FormatNumber value={origin_amount} suffix={symbol1} />
                </div>
              </div>
              <div
                className={styles.detail_item}
                style={{ textAlign: 'right' }}
              >
                <div className={styles.item_label}>{_('received')}</div>
                <div className={styles.item_value}>
                  {realSwapAmount} {symbol2}
                </div>
              </div>
            </div>
            <div className={styles.detail_item}>
              <div className={styles.item_label}>{_('swap_fee')}</div>
              <div className={styles.item_value}>
                <FormatNumber value={formatSat(txFee)} suffix="BSV" />
              </div>
            </div>
            <div className={styles.detail_item}>
              <div className={styles.item_label}>{_('onchain_tx')}</div>
              <div className={styles.item_value}>{txid}</div>
            </div>
          </div>
        </SuccessResult>
      </div>
    );
  }
  componentDidMount() {
    EventBus.on('reloadPair', () => {
      const { hash } = window.location;
      if (hash.indexOf('swap') > -1) {
        this.setState({ page: 'form' });
      }
    });
  }
  finish = () => {
    this.setState({
      formFinish: false,
      origin_amount: 0,
      aim_amount: 0,
      lastMod: '',
      fee: 0,
      slip: 0,
    });
  };

  renderSwap() {
    const { formFinish } = this.state;

    return (
      <div className={styles.container}>
        {formFinish ? this.renderResult() : this.renderForm()}
      </div>
    );
  }

  selectedToken = () => {
    this.setState({
      origin_amount: 0,
      aim_amount: 0,
    });

    this.showUI('form');
  };

  render() {
    const { currentPair, loading } = this.props;
    if (loading) return <Loading />;
    if (!currentPair) return 'No pair';
    const { page } = this.state;
    return (
      <div style={{ position: 'relative' }}>
        {this.renderSwap()}

        {page === 'selectToken' && (
          <div className={styles.selectToken_wrap}>
            <SelectToken finish={() => this.selectedToken()} />
          </div>
        )}
      </div>
    );
  }
}
