// Function to update content dynamically based on the selected language
function updateContent(lang) {
    console.log(`Attempting to load language: ${lang}`); // Debug log for language

    fetch(`assets/data/lang-${lang}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load language file: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Language data loaded successfully:', data); // Debug log for loaded data

            // Update <head> content
            if (data.title) {
                const titleElement = document.getElementById('title');
                if (titleElement) {
                    titleElement.innerText = data.title;
                } else {
                    console.warn('Title element not found');
                }
            }

            if (data.metaDescription) {
                const metaElement = document.getElementById('meta-description');
                if (metaElement) {
                    metaElement.setAttribute('content', data.metaDescription);
                } else {
                    console.warn('Meta description element not found');
                }
            }

            // Update header navigation
            updateElement('#home-link', data.homeLink, 'Home link');
            updateElement('#sections-title', data.sectionsTitle, 'Sections title');

            // Add event listeners for dynamically loaded links
            document.getElementById('sections-title')?.addEventListener('click', () => {
                updateElement('#mission-link', data.missionLink, 'Mission link');
                updateElement('#team-link', data.teamLink, 'Team link');
                updateElement('#contact-link', data.contactLink, 'Contact link');
            });

            // Update banner section
            updateElement('#banner p', data.tagline, 'Banner tagline');
            updateElement('#banner-button1', data.bannerButton1, 'Primary banner button');
            updateElement('#banner-button2', data.bannerButton2, 'Secondary banner button');

            // Update mission section
            updateElement('#mission h2', data.missionHeading, 'Mission heading');
            updateElement('#mission p', data.missionText, 'Mission text');

            // Update team section
            if (data.teamMembers) {
                const teamSections = document.querySelectorAll('#team .features-row section');
                data.teamMembers.forEach((member, index) => {
                    const section = teamSections[index];
                    if (section) {
                        updateChildElement(section, 'h5', member.role, 'Team member role');
                        updateChildElement(section, 'h6', member.location, 'Team member location');
                        updateChildElement(section, 'p', member.description, 'Team member description');
                    } else {
                        console.warn(`Team section ${index + 1} not found`);
                    }
                });
            }

            // Update client projects
            updateElement('#cliendHeading', data.clientHeading, 'Client heading');
            if (data.clientProjects) {
                const clientSections = document.querySelectorAll('#client .row .col-6.col-12-narrower section');
                data.clientProjects.forEach((project, index) => {
                    const section = clientSections[index];
                    if (section) {
                        updateChildElement(section, 'h3', project.title, 'Project title');
                        updateChildElement(section, 'p', project.description, 'Project description');
                        updateChildElement(section, 'a', project.cta, 'Project call-to-action');
                    } else {
                        console.warn(`Client project section ${index + 1} not found`);
                    }
                });
            }

            // Update CTA section
            updateElement('#cta h2', data.ctaHeading, 'CTA heading');
            updateElement('#cta p', data.ctaText, 'CTA text');
            updateInputValue('#email-button', data.ctaEmailButton, 'CTA email button');
            updateInputValue('#call-button', data.ctaCallButton, 'CTA call button');

            // Update footer section
            if (data.copyright) {
                const footerElement = document.querySelector('#footer .copyright li:first-child');
                if (footerElement) {
                    footerElement.innerHTML = data.copyright;
                } else {
                    console.warn('Footer copyright element not found');
                }
            }
        })
        .then(data => {
            window.currentLangData = data; // Store it in a global variable for easy access
        })
        .catch(error => console.error('Error loading JSON:', error));
}

// Helper function to update text content of an element
function updateElement(selector, value, description) {
    if (value) {
        const element = document.querySelector(selector);
        if (element) {
            element.innerText = value;
        } else {
            console.warn(`${description} element (${selector}) not found`);
        }
    }
}

// Helper function to update text content of a child element
function updateChildElement(parent, childSelector, value, description) {
    if (value) {
        const child = parent.querySelector(childSelector);
        if (child) {
            child.innerText = value;
        } else {
            console.warn(`${description} (${childSelector}) not found in parent`, parent);
        }
    }
}

// Helper function to update value of an input element
function updateInputValue(selector, value, description) {
    if (value) {
        const input = document.querySelector(selector);
        if (input) {
            input.value = value;
        } else {
            console.warn(`${description} input (${selector}) not found`);
        }
    }
}

// Event listeners for language buttons
document.addEventListener('click', (event) => {
    // Check if the clicked element is the <a> tag or its child <img>
    const clickedElement = event.target.closest('a.lang-btn');
    if (clickedElement) {
        event.preventDefault();

        if (clickedElement.id === 'lang-en') {
            console.log('Switching to English');
            updateContent('en');
            localStorage.setItem('selectedLanguage', 'en');
        } else if (clickedElement.id === 'lang-fr') {
            console.log('Switching to French');
            updateContent('fr');
            localStorage.setItem('selectedLanguage', 'fr');
        }
    }
});

// Event listeners for call button
document.getElementById('call-button').addEventListener('click', () => {
    makeCall(); // This now uses the latest language data
});

// Helper function to detect user language
function detectUserLanguage() {
    // Check if language is already stored in localStorage
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
        console.log(`Using saved language: ${savedLanguage}`);
        return savedLanguage;
    }

    // Check browser's preferred languages
    const preferredLanguages = navigator.languages || [navigator.language];
    if (preferredLanguages.length > 0) {
        console.log(`Using browser's preferred language: ${preferredLanguages[0]}`);
        return preferredLanguages[0].split('-')[0];
    }

    // // Use Geolocation API as a fallback
    // if ('geolocation' in navigator) {
    //     navigator.geolocation.getCurrentPosition(
    //         (position) => {
    //             const { latitude, longitude } = position.coords;
    //             console.log(`Detected location: ${latitude}, ${longitude}`);
    //             // Replace with your reverse geocoding logic
    //             fetch(`https://geocode.xyz/${latitude},${longitude}?json=1`)
    //                 .then(response => response.json())
    //                 .then(data => {
    //                     const country = data.country; // Example: "France"
    //                     const languageCode = country === 'France' ? 'fr' : 'en';
    //                     console.log(`Detected language based on location: ${languageCode}`);
    //                     updateContent(languageCode);
    //                 });
    //         },
    //         (error) => {
    //             console.error('Geolocation error:', error);
    //             updateContent('en'); // Default fallback
    //         }
    //     );
    // }

    // Default to English if all else fails
    console.log('Falling back to default language: en');
    return 'en';
}

// Detect and update content
const languageCode = detectUserLanguage();
updateContent(languageCode);
localStorage.setItem('selectedLanguage', languageCode);
