'use strict';
import React, { Component } from 'react';
import 'whatwg-fetch';
import * as echarts from 'echarts';
import BigNumber from 'bignumber.js';
import { connect } from 'umi';
import { Spin } from 'antd';
import { formatNumberForDisplay, formatAmount } from 'common/utils';
import EventBus from 'common/eventBus';
import { USDT_PAIR, COLOR1, COLOR2 } from 'common/const';
import TimeRangeTabs from './timeRangeTabs';
import styles from './index.less';
import _ from 'i18n';

const dateInterval = {
  '1m': 3600 * 24 * 1000 * 30,
  '1w': 3600 * 24 * 1000 * 7,
  '1d': 3600 * 24 * 1000,
};

@connect(({ pair, records, farm, loading }) => {
  const { effects } = loading;
  return {
    ...pair,
    ...records,
    ...farm,
    loading: effects['pair/getAllPairs'] || effects['records/query'],
  };
})
export default class Chart extends Component {
  constructor(props) {
    super(props);
    const { currentPair, bsvPrice } = props;
    this.state = {
      chart_index: 0,
      cur_price: '',
      cur_amount: '',
      chartData: [],
    };
    this.option = {
      grid: {
        top: 10,
        bottom: 30,
        left: 0,
        right: 0,
      },
      xAxis: {
        type: 'time',
        show: true,
      },
      yAxis: [
        {
          type: 'value',
          show: false,
          min: (v) => v.min * 0.5,
          max: (v) => v.max * 1.5,
        },
        {
          type: 'value',
          show: false,
          max: (v) => v.max * 2,
        },
      ],
      tooltip: {
        trigger: 'axis',
        className: styles.tooltip,
        renderMode: 'html',
        formatter: function (params) {
          const lines = [{ label: _('date'), value: params[0].value[0] }];
          if (props.type === 'pool') {
            lines.push({
              label: 'TVL',
              value: formatNumberForDisplay({
                value: params[0].value[1],
                suffix: 'BSV',
              }),
            });
          } else {
            lines.push({
              label: _('volume'),
              value: formatNumberForDisplay({
                value: params[1].value[1],
                suffix: 'BSV',
              }),
            });
            lines.push({
              label: _('price'),
              value: formatNumberForDisplay({
                value: params[0].value[1],
                suffix:
                  currentPair === USDT_PAIR
                    ? 'USDT'
                    : `BSV ($${formatAmount(
                        BigNumber(params[0].value[1]).multipliedBy(bsvPrice),
                        4,
                      )})`,
              }),
            });
          }
          return lines
            .map((line) => `<span>${line.label}</span> ${line.value}`)
            .join('<br />');
        },
      },
      series: [
        {
          data: [],
          type: 'line',
          showSymbol: false,
          lineStyle: {
            color: COLOR1,
            width: 2,
          },
          itemStyle: {
            color: COLOR1,
          },
          emphasis: {
            lineStyle: {
              color: COLOR1,
              width: 2,
            },
          },
          yAxisIndex: 0,
        },
        {
          data: [],
          type: props.type === 'pool' ? 'line' : 'bar',
          showSymbol: false,
          lineStyle: {
            color: COLOR2,
            width: 2,
          },
          itemStyle: {
            color: COLOR2,
          },
          emphasis: {
            lineStyle: {
              color: COLOR2,
              width: 2,
            },
          },
          yAxisIndex: 1,
        },
      ],
    };
    this.polling = true;
  }

  componentDidMount() {
    this._isMounted = true;
    this.init();
  }

  async init() {
    const chartDom = document.getElementById('J_Chart');
    this.myChart = echarts.init(chartDom);
    EventBus.on('reloadChart', (type) => this.handleData(type));
  }

  handleData = async (type) => {
    if (type !== this.props.type || !this._isMounted) return;
    const chartData = await this.getChartData(type);
    if (chartData.length > 1) {
      if (type === 'pool') {
        this.option.series[0].data = chartData.map((d) => ({
          name: d.timestamp,
          value: [d.formattedTime, d.amount],
        }));
      } else {
        // console.log(chartData.map((d) => (
        //   d.formattedTime
        // )))
        // this.option.xAxis.data = chartData.map((d) => (
        //   d.timestamp
        // ))
        this.option.series[0].data = chartData.map((d) => ({
          name: d.timestamp,
          value: [d.formattedTime, d.price],
        }));
        console.log(this.props.timeRange, dateInterval[this.props.timeRange]);
        this.option.xAxis.minInterval = dateInterval[this.props.timeRange];
        this.option.series[1].data = chartData.map((d) => ({
          name: d.timestamp,
          value: [d.formattedTime, d.volumn],
        }));
      }
    } else {
      this.option.series[0].data = [];
    }

    this.myChart.setOption(this.option);
    this.setState({
      chartData,
    });
  };

  async getChartData(type) {
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'records/query',
      payload: {
        type,
      },
    });

    if (res.msg) {
      message.error(res.msg);
      return [];
    }
    return res;
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.myChart.dispose();
  }

  render() {
    const { loading, type } = this.props;
    const { chartData } = this.state;
    return (
      <Spin spinning={chartData.length < 1 && loading}>
        <div id="J_Chart" className={styles.chart}></div>

        <div className={styles.time_picker_bottom}>
          <TimeRangeTabs type={type} />
        </div>
      </Spin>
    );
  }
}
