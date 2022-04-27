const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const width = canvas.width
const height = canvas.height

const center = {
    x: canvas.width / 2,
    y: canvas.height / 2,
}
const gravity = 0.98
const friction = 0.999
const bounce = 1
const speed = 15
let color = 'black'

class Slime {
    constructor(postion, radius, color) {
        this.postion = postion
        this.velocity = {
            x: 10,
            y: 10,
        }
        this.oldPostion = {
            x: this.postion.x - this.velocity.x,
            y: this.postion.y - this.velocity.y,
        }
        this.radius = radius
        this.color = color
        this.trail = []
    }
    draw() {
        ctx.beginPath()
        ctx.arc(this.postion.x, this.postion.y, 5, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
    }
    update() {
        this.draw()
        this.velocity = {
            x: this.postion.x - this.oldPostion.x,
            y: this.postion.y - this.oldPostion.y,
        }
        this.addTrail(this.oldPostion)
        this.oldPostion = {
            x: this.postion.x,
            y: this.postion.y,
        }
        this.postion.x += this.velocity.x * friction
        this.postion.y += this.velocity.y * friction
        // this.postion.y += gravity
        this.collsionCheck()
    }
    collsionCheck() {
        if (this.postion.x > width) {
            this.postion.x = width
            this.oldPostion.x = this.postion.x + this.velocity.x * bounce
        } else if (this.postion.x < 0) {
            this.postion.x = 0
            this.oldPostion.x = this.postion.x + this.velocity.x * bounce
        }
        if (this.postion.y > height) {
            this.postion.y = height
            this.oldPostion.y = this.postion.y + this.velocity.y * bounce
        } else if (this.postion.y < 0) {
            this.postion.y = 0
            this.oldPostion.y = this.postion.y + this.velocity.y * bounce
        }
    }
    addTrail(postion) {
        if (this.trail.length >= 10) {
            this.trail.shift()
            this.trail.push(postion)
        } else {
            this.trail.push(postion)
        }
    }
    setVelocity(velocity) {
        this.oldPostion = {
            x: this.postion.x + velocity.x,
            y: this.postion.y + velocity.y,
        }
    }
    stear(velocity) {
        this.oldPostion = {
            x: (this.oldPostion.x + (this.postion.x + velocity.x)) / 2,
            y: (this.oldPostion.y + (this.postion.y + velocity.y)) / 2,
        }
    }
}
const slimes = []

for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
        const slime = new Slime({ x: 100 + i * 20, y: 100 + j * 10 }, 10, 'red')
        slimes.push(slime)
    }
}

addEventListener('click', (e) => {
    const slime = new Slime({ x: e.clientX, y: e.clientY }, 10, 'red')
    slimes.push(slime)
})

const getNearSlime = () => {
    slimes.forEach((slime, index, array) => {
        if (array.length > 1) {
            slimes.forEach((slime2, index2, array2) => {
                if (index !== index2) {
                    const distance = getDistance(slime.postion, slime2.postion)
                    if (distance < 20) {
                        slime.stear(getVelocity(slime.postion, slime2.postion))
                    } else if (distance < 50 && distance > 40) {
                        if (getRandomInt() < 50) {
                            slime.stear(
                                getVelocity(slime2.postion, slime.postion)
                            )
                        }
                    }
                }
            })
        }
        slime.update()
    })
}
const animate = () => {
    requestAnimationFrame(animate)
    ctx.fillStyle = 'rgba(0,0,0,0.1)'
    ctx.fillRect(0, 0, width, height)
    getNearSlime()
}
addEventListener('pointermove', (e) => {
    mouse = {
        x: e.clientX,
        y: e.clientY,
    }
    slimes.forEach((slime, index, array) => {
        if (getDistance(slime.postion, mouse) < 200) {
            slime.setVelocity(getVelocity(mouse, slime.postion))
        }
    })
})
animate()
