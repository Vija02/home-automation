import React, { Component } from 'react'
import Slider from 'react-rangeslider'
import axios from 'axios'

import thermometer from './thermometer.svg'

import './App.css'

const base_url = 'http://raspberrypi:3000'

class App extends Component {
	constructor(props) {
		super(props)
		this.state = { value: 500 }
	}
	componentDidMount() {
		axios
			.get(`${base_url}/status`)
			.then(res => {
				this.setState({ value: res.data.location })
			})
			.catch(e => {
				console.log(e)
				console.log('No last recorded')
			})
	}
	render() {
		const verticalLabels = {
			500: '* - OFF',
			833: '1',
			1166: '2',
			1500: '3',
			1833: '4',
			2166: '5',
			2500: '6',
		}
		return (
			<div className="App">
				<h1>
					<img src={thermometer} width={30} alt="thermometer" />
					Heater
				</h1>
				<div className="slider-vertical">
					<Slider
						min={500}
						max={2500}
						value={this.state.value}
						orientation="vertical"
						labels={verticalLabels}
						format={val => Math.floor(((val - 500) / 2000) * 100) + '%'}
						onChange={value => {
							this.setState({ value })
							fetch(`${base_url}/${value}`)
						}}
						className="container-height"
					/>
					<div className="value">{Math.floor(((this.state.value - 500) / 2000) * 100) + '%'}</div>
				</div>
			</div>
		)
	}
}

export default App
