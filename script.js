const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

let WIDTH = window.innerWidth
let HEIGHT = window.innerHeight

canvas.width = WIDTH
canvas.height = HEIGHT

let move = 1
let score = 1
let gems = 0
let start = false
let maxScore = 0

let player = {
    x: WIDTH / 2,
    y: 150,
    w: WIDTH * 0.01,
    h: WIDTH * 0.01,
    color: 'red',
    speed: 4
}

let trees = []
const generateTree = () => {
    return {
        x: Math.floor(Math.random() * WIDTH),
        y: HEIGHT + Math.floor(Math.random() * HEIGHT),
        w: WIDTH * 0.01,
        h: WIDTH * 0.01,
        color: 'green',
        speed: 4
    }
}

init = () => {
    trees = []
    score = 0
    let savedScore = localStorage.getItem('maxScore')
    console.log(savedScore)
    if(maxScore < savedScore) {
        maxScore = savedScore
    }
    window.addEventListener('resize', onWindowResize, false)
    window.addEventListener('keypress', onKeyPress)
    window.addEventListener('click', onClickMouse);

    for(let i = 0; i < 75; i++) {
        trees.push(generateTree())
    }

    if(!start) {
        player.x = WIDTH / 2


        ctx.fillStyle = "white",
        ctx.fillRect(0, 0, WIDTH, HEIGHT)

        ctx.fillStyle = player.color
        ctx.fillRect(player.x, player.y, player.w, player.h)
        ctx.fillStyle = "black"
        ctx.font = "40px Arial"
        ctx.textAlign = "center"
        ctx.fillText("Clique para iniciar", WIDTH / 2, 75)
        ctx.font = "20px Arial"
        ctx.textAlign = "center"
        ctx.fillText(`Pontuação Máxima: ${maxScore}`, WIDTH / 2, HEIGHT / 2)
        ctx.textAlign = "center"
        ctx.fillText("Shop", WIDTH / 2, HEIGHT / 2 - 50)
        
        ctx.rect(WIDTH / 2 - 50, HEIGHT / 2 - 80, 100, 50)
        ctx.stroke()
    } else {
        update()
    }
}

update = () => {
    if(start) {
        draw()

        trees.forEach((tree, i) => {
            if(!(tree.y + tree.w < 0)) {
                tree.y -= tree.speed
            } else {
                trees[i] = generateTree()
            }

            if(player.x < tree.x + tree.w && player.x + player.w > tree.x &&player.y + player.h > tree.y && player.y < tree.y + tree.h) {
                if(maxScore < Math.floor(score)) {
                    maxScore = Math.floor(score)
                    localStorage.setItem('maxScore', maxScore)
                }
                start = false
                init()
            }
        })
        
        score += 1 / 30

        player.x += player.speed * move

        requestAnimationFrame(update)
    } else {
        init()
    }
}

draw = () => {
    ctx.fillStyle = "white",
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    ctx.fillStyle = player.color
    ctx.fillRect(player.x, player.y, player.w, player.h)

    trees.forEach(tree => {
        ctx.fillStyle = tree.color
        ctx.fillRect(tree.x, tree.y, tree.w, tree.h)
    })

    ctx.fillStyle = "black"
    ctx.font = "40px Arial"
    ctx.textAlign = "center"
    ctx.fillText(Math.floor(score), WIDTH / 2, 75)
}

onKeyPress = e => {
    let code = e.keyCode
    if(code === 32) {
        move = -move
    }
}

onClickMouse = e => {
    if(!start) {
        if(e.pageX > 455 && e.pageX < 556 && e.pageY > 328 && e.pageY < 378) {
            console.log("shop")
        } else {
            console.log(e.pageX)
            console.log(e.pageY)
            start = true
            init()
        }
    }
    //console.log(e.pageX)
    //console.log(e.pageY)
    move = -move
}

onWindowResize = () => {
    let WIDTH = window.innerWidth
    let HEIGHT = window.innerHeight

    canvas.width = WIDTH
    canvas.height = HEIGHT
    draw()
}

init()