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
            updateElement('#language-title', data.languageTitle, 'Language title');
            updateElement('#lang-en', data.languageOptionEnglish, 'English language option');
            updateElement('#lang-fr', data.languageOptionFrench, 'French language option');

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
            updateInputValue('#cta input[value="E-mail us"]', data.ctaEmailButton, 'CTA email button');
            updateInputValue('#cta input[value="Call us"]', data.ctaCallButton, 'CTA call button');

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

document.addEventListener('click', (event) => {
    console.log('A click event was detected'); // Debug log for all clicks
    console.log('Clicked element:', event.target); // Log the clicked element
    if (event.target.id === 'lang-en') {
        event.preventDefault();
        console.log('Switching to English'); // Log for English button click
        updateContent('en');
        localStorage.setItem('selectedLanguage', 'en');
    } else if (event.target.id === 'lang-fr') {
        event.preventDefault();
        console.log('Switching to French'); // Log for French button click
        updateContent('fr');
        localStorage.setItem('selectedLanguage', 'fr');
    }
});

// Load default or previously selected language on page load
const savedLanguage = localStorage.getItem('selectedLanguage') || 'fr';
console.log(`Loading saved language: ${savedLanguage}`);
updateContent(savedLanguage);
