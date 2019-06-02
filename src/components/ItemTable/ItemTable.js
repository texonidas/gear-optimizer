import React from 'react';
import ReactTooltip from 'react-tooltip'

import Item from '../Item/Item'
import './ItemTable.css';

function compare_factory(key) {
        return function(prop) {
                return function(a, b) {
                        a = prop[a];
                        b = prop[b];
                        if (a === undefined || a[key] === undefined || b === undefined || b[key] === undefined) {
                                return true;
                        }
                        let result;
                        if (a[key][1] !== b[key][1]) {
                                if (a[key][1] * b[key][1] < 0) {
                                        result = a[key][1] - b[key][1];
                                } else {
                                        result = b[key][1] - a[key][1];
                                }
                        } else {
                                result = a.slot[1] - b.slot[1]
                        }
                        //                        console.log(a[key][1], b[key][1], result)
                        return result;
                }
        }
}

function group(a, b, g) {
        if (a === undefined || b === undefined) {
                return false;
        }
        return a[g][1] !== b[g][1];
}

export default class ItemTable extends React.Component {
        constructor(props) {
                super(props);
                this.localbuffer = [];
        }
        componentDidUpdate() {
                ReactTooltip.rebuild();
        }

        create_section(buffer, last, class_idx) {
                if (this.localbuffer.length > 0) {
                        buffer.push(<div className='item-section' key={class_idx++}>
                                <span onClick={() => this.props.handleHideZone(last.zone[1])}>{last[this.props.group][0]}<br/></span>
                                {
                                        this.props.hidden[last.zone[1]]
                                                ? undefined
                                                : this.localbuffer
                                }
                        </div>);
                        this.localbuffer = [];
                }
                return class_idx;
        }

        render() {
                //TODO: sorting on every change is very inefficient
                let buffer = [];
                let sorted;
                let class_idx = 0;
                {
                        let compare = compare_factory(this.props.group)(this.props[this.props.type]);
                        sorted = [...this.props[this.props.type].names].sort(compare);
                        let last = undefined;
                        for (let idx = 0; idx < sorted.length; idx++) {
                                let name = sorted[idx];
                                const item = this.props[this.props.type][name];
                                let next = group(last, item, this.props.group);
                                if (next) {
                                        class_idx = this.create_section(buffer, last, class_idx)
                                }
                                if (item.zone[1] <= this.props.zone) {
                                        this.localbuffer.push(<Item item={item} handleClickItem={this.props.handleClickItem} handleRightClickItem={this.props.handleRightClickItem} handleDoubleClickItem={this.props.handleDoubleClickItem} key={name}/>);
                                }
                                last = item;
                        }
                        class_idx = this.create_section(buffer, last, class_idx);
                }
                return (<div className='item-table'>
                        {buffer}
                </div>);
        }
}