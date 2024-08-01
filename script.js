const apiKey = 'ahMnhni7Td5MFa038DCTeMUI5cY5nKi0FXTpJvlL';
const apiUrl = 'https://api.nasa.gov/planetary/apod';
const searchUrl = 'https://images-api.nasa.gov/search';

const dateInput = document.getElementById('date-input');
const searchButton = document.getElementById('search-button');
const spaceSearchInput = document.getElementById('space-search-input');
const spaceSearchButton = document.getElementById('space-search-button');
const image = document.getElementById('image');
const title = document.getElementById('title');
const explanation = document.getElementById('explanation');
const spaceInfo = document.getElementById('space-info');
const imageContainer = document.querySelector('.image-container');
const spaceInfoContainer = document.querySelector('.space-info-container');
const welcomeMessage = document.getElementById('welcome-message');

searchButton.addEventListener('click', () => {
    const date = dateInput.value;
    if (date) {
        clearPreviousResults();
        fetch(`${apiUrl}?api_key=${apiKey}&date=${date}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('NASA Image API response:', data);
                if (data.hdurl) {
                    image.src = data.hdurl;
                    title.textContent = data.title;
                    explanation.textContent = data.explanation;
                    imageContainer.style.display = 'block';
                    welcomeMessage.style.display = 'none'; // Hide welcome message
                } else {
                    console.log('No image found for this date');
                }
            })
            .catch(error => {
                console.error('Error fetching NASA image:', error);
            });
    }
});

spaceSearchButton.addEventListener('click', () => {
    const query = spaceSearchInput.value;
    if (query) {
        clearPreviousResults();
        fetch(`${searchUrl}?q=${query}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('NASA Space Search API response:', data);
                const items = data.collection.items;
                if (items.length > 0) {
                    spaceInfo.innerHTML = '';
                    items.forEach(item => {
                        const infoDiv = document.createElement('div');
                        infoDiv.classList.add('space-info-item');

                        const title = item.data[0].title;
                        const description = item.data[0].description;
                        const imageUrl = item.links ? item.links[0].href : '';

                        infoDiv.innerHTML = `
                            <h3>${title}</h3>
                            <p>${description}</p>
                            ${imageUrl ? `<img src="${imageUrl}" alt="${title}" class="img-fluid rounded mb-3">` : ''}
                        `;
                        spaceInfo.appendChild(infoDiv);
                    });
                    spaceInfoContainer.style.display = 'block';
                    welcomeMessage.style.display = 'none'; // Hide welcome message
                } else {
                    console.log('No results found for this query');
                }
            })
            .catch(error => {
                console.error('Error fetching space information:', error);
            });
    }
});

function clearPreviousResults() {
    image.src = '';
    title.textContent = '';
    explanation.textContent = '';
    spaceInfo.innerHTML = '';
    imageContainer.style.display = 'none';
    spaceInfoContainer.style.display = 'none';
}
