const canvas = document.querySelector("#myCanvas");
canvas.width = 200;

const ctx = canvas.getContext('2d');
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "KEYS", 5);
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2)
];

animate();

function animate() {
    car.update(road.borders, traffic);
    for(let c of traffic) {
        c.update(road.borders, []);
    }
    canvas.height = window.innerHeight;

    ctx.save();
    ctx.translate(0, -car.y + canvas.height * 0.7);
    road.draw(ctx);
    
    for(let car of traffic) {
        car.draw(ctx, 'red');
    }
    car.draw(ctx, 'blue');
    
    ctx.restore()
    requestAnimationFrame(animate);
}