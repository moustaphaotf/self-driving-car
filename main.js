const carCanvas = document.querySelector("#carCanvas");
carCanvas.width = 200;

const networkCanvas = document.querySelector("#networkCanvas");
networkCanvas.width = 300;
const networkCtx = networkCanvas.getContext('2d');



const carCtx = carCanvas.getContext('2d');
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 3);
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2)
];

animate();

function animate(time) {
    car.update(road.borders, traffic);
    for(let c of traffic) {
        c.update(road.borders, []);
    }
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -car.y + carCanvas.height * 0.7);
    road.draw(carCtx);
    
    for(let car of traffic) {
        car.draw(carCtx, 'red');
    }
    car.draw(carCtx, 'blue');
    
    carCtx.restore();

    networkCtx.lineDashOffset = -time / 50
    Visualizer.drawNetwork(networkCtx, car.brain);
    requestAnimationFrame(animate);
}