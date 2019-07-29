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
let gem = 0
let shop = false
let buyed = []

let player = {
    x: WIDTH / 2,
    y: 150,
    w: WIDTH * 0.01,
    h: WIDTH * 0.01,
    color: 'red',
    speed: 4
}

const items = [
    {price: 5, color: 'blue'},
    {price: 5, color: 'black'},
    {price: 5, color: 'yellow'},
    {price: 5, color: 'brown'},
    {price: 5, color: 'orange'},
]

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
    let savedScore = JSON.parse(localStorage.getItem('skiData'))
    if(savedScore !== null) {
        console.log(savedScore.maxScore)
        if(maxScore < savedScore.maxScore) {
            maxScore = savedScore.maxScore
            gems = savedScore.gems
        }

        buyed = savedScore.buyed

        savedScore.buyed.forEach(color => {
            items.forEach(item => {
                if(item.color === color) {
                    item.price = 0
                }
            })
        })
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
        ctx.font = "20px Arial"
        ctx.textAlign = "center"
        ctx.fillText(`Gems: ${gems}`, WIDTH / 2, HEIGHT / 2 + 25)

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
                    localStorage.setItem('skiData', JSON.stringify({ maxScore: maxScore, gems: gems, buyed: buyed }))
                }
                start = false
                init()
            }
        })
        
        score += 1 / 30

        if(gem !== undefined) {
            if(gem.y + gem.h < 0) {
                gem = {}
            }

            if(player.x < gem.x + gem.w && player.x + player.w > gem.x &&player.y + player.h > gem.y && player.y < gem.y + gem.h){
                gems++
                localStorage.setItem('skiData', JSON.stringify({ maxScore: maxScore, gems: gems, buyed: buyed }))
                gem = {}
            }
            gem.y -= 4
        }

        if(Math.floor(score) % 10 === 0) {
            gem = {
                x: Math.floor(Math.random() * WIDTH),
                y: HEIGHT + 128,
                color: 'purple',
                w: WIDTH * 0.03,
                h: WIDTH * 0.03,
            }
        }

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

    if(gem !== undefined) {
        ctx.fillStyle = gem.color
        ctx.fillRect(gem.x, gem.y, gem.w, gem.h)
    }

    ctx.fillStyle = "black"
    ctx.font = "40px Arial"
    ctx.textAlign = "center"
    ctx.fillText(Math.floor(score), WIDTH / 2, 75)
    ctx.font = "20px Arial"
    ctx.textAlign = "center"
    ctx.fillText(gems, WIDTH / 2, 125)
}

onKeyPress = e => {
    let code = e.keyCode
    if(code === 32) {
        move = -move
    }
}

onClickMouse = e => {
    if(!start) {
        if(e.pageX > 455 && e.pageX < 556 && e.pageY > 328 && e.pageY < 378 || shop) {
            console.log("shop")
            shopPage()
            shop = true
            if(e.pageX > 414 && e.pageY > 631 && e.pageX < 498 && e.pageY < 669) {
                shop = false
                start = true
                init()
            }
            items.forEach((item, i) => {
                if(e.pageX > 128 + (128 * i) && e.pageX < (128 + (128 * i)) + 32 && e.pageY > HEIGHT / 2 && e.pageY < HEIGHT / 2 + 32) {
                    console.log(item)
                    if(gems >= item.price) {
                        if(!(buyed.some(b => {
                            return b === item.color
                        }))){
                            console.log("Comprar")
                            buyed.push(item.color)
                            player.color = item.color
                            gems -= item.price
                            item.price = 0
                            localStorage.setItem('skiData', JSON.stringify({ maxScore: maxScore, gems: gems, buyed: buyed }))
                        } else {
                            player.color = item.color
                        }
                    }
                }
            })
        } else {
            if(!shop) {
                start = true
                init()
            }
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

shopPage = () => {
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    items.forEach((item, i) => {
        console.log(item)
        console.log(i)
        ctx.fillStyle = item.color,
        ctx.fillRect(128 + (128 * i), HEIGHT / 2, 32, 32)
        ctx.fillStyle = "black"
        ctx.textAlign = "center"
        ctx.fillText(`${item.price}`, 128 + (128 * i) + 16, HEIGHT / 2 + 80)

        ctx.textAlign = "center"
        ctx.fillText("Jogar", WIDTH / 2 - 50, HEIGHT / 2 + 250)
    })
}

init()