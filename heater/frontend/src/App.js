import React, { Component } from 'react'
import Slider from 'react-rangeslider'
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios'

import thermometer from './thermometer.svg'

import './App.css'

const base_url = process.env.REACT_BACKEND_URL

class App extends Component {
	constructor(props) {
		super(props)
		this.state = { value: 0 }

		this.checkCurrentTemp = this.checkCurrentTemp.bind(this)
	}
	componentDidMount() {
		this.checkCurrentTemp()
		setInterval(() => {
			this.checkCurrentTemp()
		}, 10000)
	}

	checkCurrentTemp() {
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
		const originalMin = 500
		const originalMax = 2500

		const minVal = 0
		const maxVal = 180

		const mapVal = input => minVal + ((maxVal - minVal) / (originalMax - originalMin)) * (input - originalMin)

		let verticalLabels = {
			500: '* - OFF',
			833: '1',
			1166: '2',
			1500: '3',
			1833: '4',
			2166: '5',
			2500: '6',
		}
		verticalLabels = Object.entries(verticalLabels)
			.map(([key, value]) => {
				return [mapVal(key), value]
			})
			.reduce((acc, val) => ({ ...acc, [val[0]]: val[1] }), {})

		return (
			<div className="App">
				<ToastContainer
					position="bottom-right"
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop
					closeOnClick
					rtl={false}
					pauseOnVisibilityChange
					draggable
					pauseOnHover
				/>
				<h1>
					<img src={thermometer} width={30} alt="thermometer" />
					Heater
				</h1>
				<div className="slider-vertical">
					<Slider
						min={0}
						max={180}
						value={this.state.value}
						orientation="vertical"
						labels={verticalLabels}
						format={val => Math.floor((val / 180) * 100) + '%'}
						onChange={value => {
							this.setState({ value })
							axios.get(`${base_url}/set?angle=${value}`).catch(() => {
								toast.error('Error: Failed to set heater', { toastId: 'errorset' })
								this.checkCurrentTemp()
							})
						}}
						className="container-height"
					/>
					<div className="value">{Math.floor((this.state.value / 180) * 100) + '%'}</div>
				</div>
			</div>
		)
	}
}

export default App
