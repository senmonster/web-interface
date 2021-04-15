'use strict';
import React, { Component } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import styles from './index.less';
import _ from 'i18n';
import { slippage_data } from 'common/config';

const { localStorage } = window;

const {storage_name, defaultIndex, datas} = slippage_data;

export default class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: defaultIndex
        }
    }

    componentDidMount() {
        let v = localStorage.getItem(storage_name);
        if(typeof(v) === 'undefined' || v === null) {
            localStorage.setItem(storage_name, defaultIndex)
        } else {
            this.setState({
                currentIndex: v
            })
        }
    }

    switch = (index) => {
        this.setState({
            currentIndex: index
        })
        localStorage.setItem(storage_name, index)
        this.props.close()
    }

    reset = () => {
        this.setState({
            currentIndex: defaultIndex
        })
        localStorage.setItem(storage_name, defaultIndex)
    }

    render() {
        const { currentIndex } = this.state;
        return <div className={styles.container}>
            <div className={styles.head}>
                <div className={styles.back}><ArrowLeftOutlined onClick={this.props.close} style={{fontSize: 16, color: '#2F80ED', fontWeight: 700}} /></div>
                <div className={styles.title}>{_('tx_settings')}</div>
                <div className={styles.done} onClick={this.props.close}>{_('done')}</div>
            </div>
            <div className={styles.content}>
                <div className={styles.hd}>
                    <div className={styles.title}>{_('slippage_tolerance')}</div>
                    <div className={styles.reset} onClick={this.reset}>{_('reset')}</div>
                </div>
                <div className={styles.desc}>{_('tolerance_desc')}</div>
                <div className={styles.items}>
                    {datas.map((item, index)=> (
                        <div className={index === parseInt(currentIndex) ? styles.current_item : styles.item} key={item} onClick={()=>this.switch(index)}>{item}</div>
                    ))}
                </div>
            </div>
        </div>
    }
}