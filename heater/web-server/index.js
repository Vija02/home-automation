const Gpio = require('pigpio').Gpio

const pin = process.env.PIN || 14
const motor = new Gpio(pin, { mode: Gpio.OUTPUT })

const express = require('express')
const app = express()
const port = process.env.PORT || 3000

// Start on Off by default
motor.servoWrite(500)

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/status', (req, res) => {
	try {
		const location = motor.getServoPulseWidth()
		res.json({ location })
	} catch (e) {
		res.status(500)
	}
})

app.get('/:width', (req, res) => {
	try {
		const width = parseInt(req.params.width)
		console.log(`Writing ${width}`)
		motor.servoWrite(width)
		res.status(200).end()
	} catch (e) {
		res.status(500)
	}
})

app.listen(port, () => console.log(`Server listening on port ${port}!`))
