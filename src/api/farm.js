'use strict';
import BaseAPI from './base';
import { isTestNet } from 'common/utils';

class Farm extends BaseAPI {
  constructor(props) {
    super(props);
    this.baseUrl = 'https://api.tswap.io/farm/';
    if (isTestNet()) {
      this.baseUrl = 'https://api.tswap.io/farm/test/';
    }
  }

  queryAllPairs(address) {
    if (address) {
      return this._request('allpairs', { address });
    }
    return this._request('allpairs');
  }

  querySwapInfo(symbol) {
    return this._request('farminfo', { symbol });
  }

  reqSwap(params) {
    return this._request('reqfarmargs', params, 'POST');
  }

  deposit(params) {
    return this._request('deposit', params, 'POST');
  }

  withdraw(params) {
    return this._request('withdraw', params, 'POST');
  }

  withdraw2(params) {
    return this._request('withdraw2', params, 'POST');
  }

  harvest(params) {
    return this._request('harvest', params, 'POST');
  }

  harvest2(params) {
    return this._request('harvest2', params, 'POST');
  }
}

export default new Farm();