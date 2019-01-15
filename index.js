#!/usr/bin/env node

argv = { throttle: 300, queue: 1000, ...require('minimist')(process.argv.slice(2)) }

if (argv.t)
    argv.throttle=argv.t

if (argv.q)
    argv.queue=argv.q

process.stdin.resume()
process.stdin.setEncoding('utf8')

class Throttler {
    constructor(options) {
        this.lastTime = 0
        this.lines = []
        this.finished = false
        setInterval(() => this.processLine(), 10)
    }

    finish() {
        this.finished = true
        this.checkFinished()
    }

    pushLine(line) {
        this.lines.length < argv.queue && this.lines.push(line)
    }
    
    checkFinished() {
        this.lines.length == 0 && this.finished && process.exit(0)
    }

    processLine() {
        if (this.lines.length == 0)
            return this.checkFinished()
        if (Date.now() > this.lastTime + argv.throttle) {
            this.lastTime = Date.now()
            console.log(this.lines.shift())
        }
    }
}

const throttler = new Throttler(argv)

let lingeringLine = ""

process.stdin.on('data', function(chunk) {
    const lines = chunk.split('\n')
    lines[0] = lingeringLine + lines[0]
    lingeringLine = lines.pop()
    for (const line of lines) {
        throttler.pushLine(line)
    }
})

process.stdin.on('end', function() {
    if(lingeringLine.length > 0)
        throttler.pushLine(lingeringLine)
    throttler.finish()
})
