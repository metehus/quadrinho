/**
 * Canvas drawing.
 * Based on https://github.com/shuding/apple-pencil-safari-api-test/
 */


const canvas = document.getElementById('drawing-canvas')! as HTMLCanvasElement
const ctx = canvas.getContext('2d')!
ctx.strokeStyle = 'black'

const colors = ['black', 'white', 'grey', 'crimson', 'SlateBlue', 'deepskyblue', 'DarkCyan', 'PaleGreen',]

for (const color of colors) {
    const toolbox = document.querySelector('.toolbox')!
    const element = document.createElement('button')
    element.classList.add('color-item')
    element.style.background = color
    element.addEventListener('click', () => {
        ctx.strokeStyle = color
    })
    toolbox.appendChild(element)
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
        ctx.lineWidth = 8
        ctx.quadraticCurveTo(points[last - 1][0], points[last - 1][1], xc, yc)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(xc, yc)
    } else {
        const point = points[last];
        ctx.lineWidth = 8
        ctx.beginPath()
        ctx.moveTo(point[0], point[1])
        ctx.stroke()
    }
}

canvas.addEventListener('mousedown', (event: MouseEvent) => {
    event.preventDefault()
    points.push(handlePosition(event))
    drawPoints()

    mouseDown = true
})

canvas.addEventListener('mousemove', (event: MouseEvent) => {
    if (!mouseDown) return

    event.preventDefault()
    points.push(handlePosition(event))
    drawPoints()
})

canvas.addEventListener('mouseup', (event: MouseEvent) => {
    event.preventDefault()
    mouseDown = false
    points = []
    drawPoints()
})
