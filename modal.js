const showButton = document.getElementById('showDiv');
const slidingDiv = document.getElementById('slidingDiv');
const closeButton = document.getElementById('closeButton');

showButton.addEventListener('click', () => {
    slidingDiv.classList.remove('hidden');
});

closeButton.addEventListener('click', () => {
    slidingDiv.classList.add('hidden');
});

slidingDiv.addEventListener('click', (e) => {
    if (e.target === slidingDiv) {
        slidingDiv.classList.add('hidden');
    }
});
