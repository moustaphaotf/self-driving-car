const carCanvas = document.querySelector("#carCanvas");
carCanvas.width = 200;

const networkCanvas = document.querySelector("#networkCanvas");
networkCanvas.width = 300;
const networkCtx = networkCanvas.getContext('2d');



const carCtx = carCanvas.getContext('2d');
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const N = 1;
const cars = generateCars(N);
let bestCar = cars[0];
if(localStorage.getItem('bestBrain')) {
    cars.forEach((car, i) => {
        car.brain = JSON.parse(localStorage.getItem('bestBrain'));
        if(i !== 0) {
            NeuralNetwork.mutate(car.brain, 0.2);
        }
    })
}

const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -200, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -700, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -750, 30, 50, "DUMMY", 1.5),
    new Car(road.getLaneCenter(1), -900, 30, 50, "DUMMY", 2.9),
    new Car(road.getLaneCenter(0), -1000, 30, 50, "DUMMY", 1),
];

animate();

function animate(time) {
    cars.forEach(car => car.update(road.borders, traffic));
    carsCount.innerText = cars.filter(car => !car.damaged).length + ' cars'
    distance.innerText = Math.floor(Math.abs(bestCar.y)) + 'm'
    for(let c of traffic) {
        c.update(road.borders, []);
    }

    // The best car
    bestCar = cars.find(
        car => car.y === Math.min(
            ...cars.map(car => car.y)
        )
    );
    
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);
    road.draw(carCtx);
    
    for(let car of traffic) {
        car.draw(carCtx, 'red');
    }

    carCtx.globalAlpha = 0.2;
    cars.forEach(car => car.draw(carCtx, 'blue'));
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, 'blue', true)
    carCtx.restore();

    networkCtx.lineDashOffset = -time / 50
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}

function generateCars(N) {
    const cars = [];
    for(let i = 0; i < N; i++)  {
        cars.push(
            new Car(road.getLaneCenter(1), 100, 30, 50, "AI")
        );
    }
    return cars;
}

function save() {
    localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain));
}


function discard() {
    localStorage.removeItem('bestBrain');
}