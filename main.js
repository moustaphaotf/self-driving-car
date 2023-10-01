const carCanvas = document.querySelector("#carCanvas");
carCanvas.width = 200;

const networkCanvas = document.querySelector("#networkCanvas");
networkCanvas.width = 300;
const networkCtx = networkCanvas.getContext('2d');



const carCtx = carCanvas.getContext('2d');
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, 4);

const N = 50;
const cars = generateCars(N);
let bestCar = cars[0];
if(localStorage.getItem('bestBrain')) {
    cars.forEach((car, i) => {
        car.brain = JSON.parse(localStorage.getItem('bestBrain'));
        if(i !== 0) {
            NeuralNetwork.mutate(car.brain, .05);
        }
    })
}

const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 1.5, getRandomColor()),
    new Car(road.getLaneCenter(3), -100, 30, 50, "DUMMY", 2.5, getRandomColor()),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 1.8, getRandomColor()),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 1.7, getRandomColor()),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 0.5, getRandomColor()),
    new Car(road.getLaneCenter(3), -500, 30, 50, "DUMMY", 1, getRandomColor()),
    new Car(road.getLaneCenter(2), -200, 30, 50, "DUMMY", 2.5, getRandomColor()),
    new Car(road.getLaneCenter(0), -700, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(3), -700, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(1), -750, 30, 50, "DUMMY", 1.5, getRandomColor()),
    new Car(road.getLaneCenter(1), -900, 30, 50, "DUMMY", 2.5, getRandomColor()),
    new Car(road.getLaneCenter(0), -1000, 30, 50, "DUMMY", 1.7, getRandomColor()),
    new Car(road.getLaneCenter(0), -1000, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(1), -1000, 30, 50, "DUMMY", 1.5, getRandomColor()),
    new Car(road.getLaneCenter(2), -1050, 30, 50, "DUMMY", 1.8, getRandomColor()),
    new Car(road.getLaneCenter(3), -1100, 30, 50, "DUMMY", 2.5, getRandomColor()),
    new Car(road.getLaneCenter(1), -3100, 30, 50, "DUMMY", 2.5, getRandomColor()),
    new Car(road.getLaneCenter(0), -2100, 30, 50, "DUMMY", 2.5, getRandomColor()),
    new Car(road.getLaneCenter(3), -1900, 30, 50, "DUMMY", 2.5, getRandomColor()),
    new Car(road.getLaneCenter(2), -1800, 30, 50, "DUMMY", 2.5, getRandomColor()),
    new Car(road.getLaneCenter(1), -1500, 30, 50, "DUMMY", 2.5, getRandomColor()),
];

animate();

function animate(time) {
    cars.forEach(car => car.update(road.borders, traffic));
    const remainingCars = traffic.filter(car => car.y < bestCar.y);
    const totalDistance = Math.abs(bestCar.y).toFixed(0);
    const distanceToLast = remainingCars.length > 0 ? (
        (bestCar.y - traffic.find(
            car => car.y == Math.max(
                ...remainingCars.map(
                    car => car.y
                )
            )).y
        ).toFixed(0)
    ) : 0;

    stats.innerHTML = `
        <span style="color: red;">🗘</span>
        ${remainingCars.length} car${remainingCars.length ? 's' : ''}
        <br>
        Next: ${distanceToLast}m
        <br>
        Dist: ${totalDistance}m
    `;
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
        car.draw(carCtx);
    }

    carCtx.globalAlpha = 0.2;
    cars.forEach(car => car.draw(carCtx));
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, true)
    carCtx.restore();

    networkCtx.lineDashOffset = -time / 50
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}

function generateCars(N) {
    const cars = [];
    for(let i = 0; i < N; i++)  {
        cars.push(
            new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 3.2)
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

function load() {
    bestCar.brain={"levels":[{"inputs":[0.4368560202032469,0,0,0,0],"outputs":[0,0,0,0,1,0],"biases":[0.2527966604104614,0.538808024858974,0.5552157974630174,0.35416537557648314,-0.41478951544643244,-0.004253709241657562],"weights":[[-0.28528759319227354,0.5642910419585206,-0.12987248126280046,0.3802409070473605,-0.49528949492927127,-0.14933590082691986],[-0.15765829327147013,0.38647631767727164,-0.6216004475608107,-0.6013550135057865,0.20293885486506463,-0.18896740022302666],[-0.7424752778123637,0.533941236437018,0.20392070150253383,0.31462369835768617,0.0018590983498006017,0.15054674070541368],[-0.12691359508014805,-0.6625208626073236,0.39365405865715897,0.20934523100527466,0.036307506167663574,0.31201876302304726],[0.2623235423111182,0.01630490628326659,-0.04532125322452684,-0.3348451613402563,-0.10700913758729687,0.0489074139520848]]},{"inputs":[0,0,0,0,1,0],"outputs":[1,0,0,0],"biases":[-0.11415613131795613,-0.3197349097059188,0.5257652930344506,-0.2841817614544007],"weights":[[-0.2967453958313603,0.050221330779756226,0.44501822783190353,0.07698191490744637],[-0.14734281609067448,-0.33157296797793856,0.5874400171707994,0.5829411070821219],[-0.7788114834720675,0.30611529299405116,0.008198251871063707,-0.29694977660086475],[0.5279018688075701,0.5492099495441368,0.5043864887429929,0.4277318330000036],[0.5068495429947153,-0.5222762157753129,0.2951704197159646,-0.33580713513896776],[-0.29840005452156204,0.372384519038917,-0.37694175803904634,0.7283000985426834]]}]};
    save();
    location.reload();
}

window.addEventListener("load", () => setPromptText(userLanguage));;