        // Simple search functionality
        document.addEventListener('DOMContentLoaded', function() {
            const searchInput = document.querySelector('input[type="text"]');
            const searchButton = document.querySelector('button');
            
            searchButton.addEventListener('click', function() {
                const searchTerm = searchInput.value.toLowerCase();
                const cards = document.querySelectorAll('.card-hover');
                
                cards.forEach(card => {
                    const title = card.querySelector('h3').textContent.toLowerCase();
                    const description = card.querySelector('p').textContent.toLowerCase();
                    
                    if (title.includes(searchTerm) || description.includes(searchTerm)) {
                        card.style.display = 'block';
                        card.classList.add('animate-pulse');
                        setTimeout(() => {
                            card.classList.remove('animate-pulse');
                        }, 1000);
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
            
            // Reset search when input is cleared
            searchInput.addEventListener('input', function() {
                if (searchInput.value === '') {
                    const cards = document.querySelectorAll('.card-hover');
                    cards.forEach(card => {
                        card.style.display = 'block';
                    });
                }
            });
        });