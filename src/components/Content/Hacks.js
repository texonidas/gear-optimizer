import React, {Component} from 'react';
import ReactGA from 'react-ga';
import {Hack} from '../../Hack';
import {Hacks} from '../../assets/ItemAux';
import {shorten, to_time} from '../../util';

class HackComponent extends Component {
        constructor(props) {
                super(props);
                this.state = {
                        hackoption: this.props.hackstats.hackoption
                };
                this.handleChange = this.handleChange.bind(this);
                this.handleSubmit = this.handleSubmit.bind(this);
        }

        handleSubmit(event) {
                event.preventDefault();
        }

        handleChange(event, name, idx = -1) {
                let val = event.target.value;
                let hackstats = {
                        ...this.props.hackstats
                };
                if (idx < 0) {
                        hackstats = {
                                ...hackstats,
                                [name]: val
                        };
                        this.props.handleHackSettings(hackstats);
                        return;
                }
                let hacks = [...hackstats.hacks];
                let hack = {
                        ...hacks[idx],
                        [name]: val
                };
                hack.goal = this.level(hack.goal, idx);
                hack.level = this.level(hack.level, idx);
                hack.reducer = this.reducer(hack);
                hacks[idx] = hack;
                hackstats = {
                        ...hackstats,
                        hacks: hacks
                };
                this.props.handleHackSettings(hackstats);
                return;
        }

        level(level, idx) {
                level = Number(level)
                if (level <= 0) {
                        return level;
                }
                const levelCap = Hacks[idx][5];
                if (level > levelCap) {
                        return levelCap;
                }
                return level;
        }

        startlevel(data) {
                data.level = Number(data.level)
                if (data.level <= 0) {
                        return 0;
                }
                let levelCap = Hacks[data.hackidx][5];
                if (data.level > levelCap) {
                        return levelCap;
                }
                return data.level;
        }

        reducer(data) {
                data.reducer = Number(data.reducer)
                if (data.reducer < 1) {
                        return 0;
                }
                let milestone = Hacks[data.hackidx][4];
                if (data.reducer > milestone - 2) {
                        return milestone - 2;
                }
                return data.reducer;
        }

        render() {
                ReactGA.pageview('/hacks/');
                let hackOptimizer = new Hack(this.props.hackstats);
                const hacktime = this.props.hackstats.hacktime;
                const options = [0, 1, 2];
                const option = this.props.hackstats.hackoption;
                const classTarget = option === '0'
                        ? ''
                        : 'hide';
                const classLevel = option === '1'
                        ? ''
                        : 'hide';
                const classMS = option === '2'
                        ? ''
                        : 'hide';
                //HACK: this sets the dropdown to the correct value after loading
                if (this.state.hackoption !== this.props.hackstats.hackoption) {
                        /* eslint-disable-next-line react/no-direct-mutation-state */
                        this.state.hackoption = this.props.hackstats.hackoption;
                }
                return (<div className='center'>
                        <form onSubmit={this.handleSubmit}>
                                <table className='center'>
                                        <tbody>
                                                <tr>
                                                        <td>{'R power'}</td>
                                                        <td>
                                                                <label >
                                                                        <input style={{
                                                                                        width: '100px',
                                                                                        margin: '5px'
                                                                                }} type="number" value={this.props.hackstats['rpow']} onChange={(e) => this.handleChange(e, 'rpow')}/>
                                                                </label>
                                                        </td>
                                                </tr>
                                                <tr>
                                                        <td>{'R cap'}</td>
                                                        <td>
                                                                <label >
                                                                        <input style={{
                                                                                        width: '100px',
                                                                                        margin: '5px'
                                                                                }} type="number" value={this.props.hackstats['rcap']} onChange={(e) => this.handleChange(e, 'rcap')}/>
                                                                </label>
                                                        </td>
                                                </tr>
                                                <tr>
                                                        <td>{'Hack speed'}</td>
                                                        <td>
                                                                <label>
                                                                        <input style={{
                                                                                        width: '100px',
                                                                                        margin: '5px'
                                                                                }} type="number" value={this.props.hackstats.hackspeed} onChange={(e) => this.handleChange(e, 'hackspeed')} onFocus={this.handleFocus}/>
                                                                </label>
                                                        </td>
                                                </tr>
                                                <tr>
                                                        <td>{'Hack time (minutes)'}</td>
                                                        <td>
                                                                <label>
                                                                        <input style={{
                                                                                        width: '100px',
                                                                                        margin: '5px'
                                                                                }} type="number" value={hacktime} onChange={(e) => this.handleChange(e, 'hacktime')} onFocus={this.handleFocus}/>
                                                                </label>
                                                        </td>
                                                </tr>
                                                <tr>
                                                        <td>{'Hack Optimizer Mode'}</td>
                                                        <td>
                                                                <label key='hackoption'>
                                                                        <select value={this.state.hackoption} onChange={(e) => this.handleChange(e, 'hackoption')}>
                                                                                {
                                                                                        options.map((option, idx) => (<option value={idx} key={idx}>{
                                                                                                        [
                                                                                                                'level target.', 'max level in ' + to_time(hacktime * 60 * 50),
                                                                                                                'max MS in ' + to_time(hacktime * 60 * 50)
                                                                                                        ][idx]
                                                                                                }</option>))
                                                                                }
                                                                        </select>
                                                                </label>
                                                        </td>
                                                </tr>
                                        </tbody>
                                </table>
                                <table className='center'>
                                        <tbody>
                                                <tr>
                                                        <th>Hack</th>
                                                        <th>MS Reducer</th>
                                                        <th>Level</th>
                                                        <th>Bonus</th>
                                                        <th className={classTarget}>Target</th>
                                                        <th className={classLevel}>Max Level<br/>in {hacktime}min</th>
                                                        <th className={classMS}>Max MS<br/>in {hacktime}min</th>
                                                        <th>Time</th>
                                                        <th>Bonus</th>
                                                        <th>Change</th>
                                                </tr>
                                                {
                                                        Hacks.map((hack, pos) => {
                                                                const reducer = this.props.hackstats.hacks[pos].reducer;
                                                                const level = this.props.hackstats.hacks[pos].level;
                                                                const target = this.props.hackstats.hacks[pos].goal;
                                                                const currBonus = hackOptimizer.bonus(level, pos);
                                                                let bonus,
                                                                        time,
                                                                        reachableLevel,
                                                                        reachableMS;
                                                                if (option === '0') {
                                                                        bonus = hackOptimizer.bonus(target, pos);
                                                                        time = hackOptimizer.time(level, target, pos);
                                                                } else {
                                                                        reachableLevel = hackOptimizer.reachable(level, hacktime, pos);
                                                                        time = hackOptimizer.time(level, reachableLevel, pos);
                                                                        if (option === '1') {
                                                                                bonus = hackOptimizer.bonus(reachableLevel, pos);
                                                                        } else {
                                                                                reachableMS = hackOptimizer.milestoneLevel(reachableLevel, pos);
                                                                                time = hackOptimizer.time(level, reachableMS, pos);
                                                                                bonus = hackOptimizer.bonus(reachableMS, pos);
                                                                        }
                                                                }
                                                                const change = bonus / currBonus;
                                                                return <tr key={pos}>
                                                                        <td>{hack[0]}</td>
                                                                        <td>
                                                                                <label>
                                                                                        <input style={{
                                                                                                        width: '40px',
                                                                                                        margin: '5px'
                                                                                                }} type="number" value={reducer} onChange={(e) => this.handleChange(e, 'reducer', pos)} onFocus={this.handleFocus}/>
                                                                                </label>
                                                                        </td>
                                                                        <td>
                                                                                <label>
                                                                                        <input style={{
                                                                                                        width: '60px',
                                                                                                        margin: '5px'
                                                                                                }} type="number" value={level} onChange={(e) => this.handleChange(e, 'level', pos)} onFocus={this.handleFocus}/>
                                                                                </label>
                                                                        </td>
                                                                        <td>{shorten(currBonus, 2)}%</td>
                                                                        <td className={classTarget}>
                                                                                <label>
                                                                                        <input style={{
                                                                                                        width: '60px',
                                                                                                        margin: '5px'
                                                                                                }} type="number" value={target} onChange={(e) => this.handleChange(e, 'goal', pos)} onFocus={this.handleFocus}/>
                                                                                </label>
                                                                        </td>
                                                                        <td className={classLevel}>{reachableLevel}</td>
                                                                        <td className={classMS}>{reachableMS}</td>
                                                                        <td>{to_time(time)}</td>
                                                                        <td>{shorten(bonus, 2)}%</td>
                                                                        <td>×{shorten(change, 3)}</td>
                                                                </tr>;
                                                        })
                                                }
                                        </tbody>
                                </table>
                        </form>
                        <br/>
                </div>);
        };
}
export default HackComponent;
