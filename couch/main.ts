/// <reference path="couch.d.ts" />

const kGravity = 0.6
const kNumIterations = 40
const kFriction = 0.9
const kFrictionGround = 0.6
const kViscosity = 1
const kForceDrag = 0.2

const bodies = [] as Body[]
const vertices = [] as Point[]
const constraints = [] as Constraint[]

let draggingPoint: Point | null = null

const register0 = new Vec2
const register1 = new Vec2

let stats: Stats

function mainloop() {
    stats.begin()
    context.clearRect(0, 0, cwidth, cheight)

    for (let p of vertices) {
        p.integrate()
    }

    if (draggingPoint) {
        draggingPoint.position.x += (pointer.x - draggingPoint.position.x) * kForceDrag
        draggingPoint.position.y += (pointer.y - draggingPoint.position.y) * kForceDrag
    }

    for (let n = 0; n < kNumIterations; ++n) {
        for (let c of constraints) {
            c.solve()
        }

        for (let b of bodies) {
            b.boundingBox()
        }

        for (let i = 0; i < bodies.length - 1; ++i) {
            for (let j = i + 1; j < bodies.length; ++j) {
                if (sat(bodies[i], bodies[j])) {
                    resolve()
                }
            }
        }
    }

    for (let b of bodies) {
        b.draw()
    }

    if (draggingPoint) {
        context.beginPath()
        context.moveTo(draggingPoint.position.x, draggingPoint.position.y)
        context.lineTo(pointer.x, pointer.y)
        context.lineWidth = 2
        context.strokeStyle = '#FFD600'
        context.stroke()
    }

    stats.end()
    requestAnimationFrame(mainloop)
}

function init() {
    const x = cwidth * 0.2
    const y = cheight * 0.5

    bodies.push(new Character(x, y, 30, 1))
    bodies.push(new Character(x * 2, y, 40, 1))
    bodies.push(new Character(x * 3, y, 50, 1))
    bodies.push(new Character(x * 4, y, 60, 1))

    stats = new Stats
    document.body.appendChild(stats.dom)
}
