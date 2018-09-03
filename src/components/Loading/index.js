import React, {Component} from 'react'
import styles from './index.less'
export default class Loading extends Component {
    constructor(props) {
        super(props)
        this.state = {
            children: new Array(12).fill().map((val, index) => index + 1)
        }
    }
    render() {
        return <div>
            <div className={styles.circle}>
                {
                    this.state.children.map(val =>
                        <div className={`${styles.child + ' ' + styles['circle-' + val]}`} key={val}></div>)
                }
            </div>
        </div>
    }
}