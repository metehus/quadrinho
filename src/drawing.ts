/**
 * Canvas drawing.
 * Based on https://github.com/shuding/apple-pencil-safari-api-test/
 */


const canvas = document.getElementById('drawing-canvas')! as HTMLCanvasElement
const ctx = canvas.getContext('2d')!
ctx.strokeStyle = 'black'
ctx.lineWidth = 12

const colors = ['black', 'white', 'grey', 'crimson', 'SlateBlue', 'deepskyblue', 'DarkCyan', 'PaleGreen',]

for (const color of colors) {
    const toolbox = document.querySelector('.toolbox .colors')!
    const element = document.createElement('button')
    element.classList.add('color-item')
    element.style.background = color
    element.addEventListener('click', () => {
        ctx.strokeStyle = color
        for (const el of Array.from(document.querySelectorAll('.toolbox button.color-item.selected'))) {
            el.classList.remove('selected')
        }
        element.classList.add('selected')
    })
    toolbox.appendChild(element)
}

const brushSizes = document.querySelectorAll('.toolbox .brush-size > button')!

for (const brushSize of Array.from(brushSizes)) {
    brushSize.addEventListener('click', () => {
        for (const el of Array.from(document.querySelectorAll('.toolbox .brush-size .selected'))) {
            el.classList.remove('selected')
        }
        brushSize.classList.add('selected')
        if (brushSize.classList.contains('brush-small')) {
            ctx.lineWidth = 8
        } else if (brushSize.classList.contains('brush-medium')) {
            ctx.lineWidth = 12
        } else if (brushSize.classList.contains('brush-large')) {
            ctx.lineWidth = 20
        }
    })
}


type Vector = [number, number]

let mouseDown = false
let points: Vector[] = []

function handlePosition(event: MouseEvent): Vector {
    return [
        (event.offsetX / canvas.offsetWidth) * canvas.width,
        (event.offsetY / canvas.offsetHeight) * canvas.height
    ]
}

function drawPoints() {
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const last = points.length - 1
    if (points.length >= 3) {
        const xc = (points[last][0] + points[last - 1][0]) / 2
        const yc = (points[last][1] + points[last - 1][1]) / 2
        ctx.quadraticCurveTo(points[last - 1][0], points[last - 1][1], xc, yc)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(xc, yc)
    } else if (points.length > 1) {
        const point = points[last];
        ctx.beginPath()
        ctx.moveTo(point[0], point[1])
        ctx.stroke()
    }
}

for (const ev of ['mousedown', 'pointerdown']) {
    const eventName = ev as ('mousedown' | 'pointerdown')
    canvas.addEventListener(eventName, (event) => {
        event.preventDefault()
        points.push(handlePosition(event))
        drawPoints()
        mouseDown = true
    })
}

for (const ev of ['mousemove', 'pointermove']) {
    const eventName = ev as ('mousemove' | 'pointermove')
    canvas.addEventListener(eventName, (event: MouseEvent) => {
        if (!mouseDown) return
    
        event.preventDefault()
        points.push(handlePosition(event))
        drawPoints()
    })
}

for (const ev of ['mouseup', 'pointerup']) {
    const eventName = ev as ('mouseup' | 'pointerup')
    canvas.addEventListener(eventName, (event: MouseEvent) => {
        event.preventDefault()
        mouseDown = false
        points = []
        drawPoints()
    })
}

export function saveCanvas() {
    return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) return reject('Could not create blob from canvas')
            resolve(blob)
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            points = []
        })
    })
}

// @ts-ignore
window.saveCanvas = saveCanvas