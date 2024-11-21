// Function to update content dynamically based on selected language
function updateContent(lang) {
    fetch(`assets/data/lang-${lang}.json`)
        .then(response => response.json())
        .then(data => {
            // Update <head> content
            if (data.title) document.getElementById('title').innerText = data.title;
            if (data.metaDescription)
                document.getElementById('meta-description').setAttribute('content', data.metaDescription);

            // Update header navigation section
            if (data.homeLink) document.getElementById('home-link').innerText = data.homeLink;
            if (data.sectionsTitle) document.getElementById('sections-title').innerText = data.sectionsTitle;
            if (data.missionLink) document.getElementById('mission-link').innerText = data.missionLink;
            if (data.teamLink) document.getElementById('team-link').innerText = data.teamLink;
            if (data.contactLink) document.getElementById('contact-link').innerText = data.contactLink;
            if (data.languageTitle) document.getElementById('language-title').innerText = data.languageTitle;
            if (data.languageOptionEnglish) document.getElementById('lang-en').innerText = data.languageOptionEnglish;
            if (data.languageOptionFrench) document.getElementById('lang-fr').innerText = data.languageOptionFrench;

            // Update banner section
            if (data.tagline) document.querySelector('#banner p').innerText = data.tagline;
            if (data.bannerButton1)
                document.querySelector('#banner .button.primary').innerText = data.bannerButton1;
            if (data.bannerButton2)
                document.querySelector('#banner .button:not(.primary)').innerText = data.bannerButton2;

            // Update mission section
            if (data.missionHeading)
                document.querySelector('#mission h2').innerText = data.missionHeading;
            if (data.missionText)
                document.querySelector('#mission p').innerText = data.missionText;

            // Update team section
            if (data.teamMembers) {
                const teamSections = document.querySelectorAll('#team .features-row section');
                data.teamMembers.forEach((member, index) => {
                    if (teamSections[index]) {
                        teamSections[index].querySelector('h3').innerText = member.name;
                        teamSections[index].querySelector('h5').innerText = member.role;
                        teamSections[index].querySelector('p').innerText = member.description;
                    }
                });
            }

            // Update CTA section
            if (data.ctaHeading) document.querySelector('#cta h2').innerText = data.ctaHeading;
            if (data.ctaText) document.querySelector('#cta p').innerText = data.ctaText;
            if (data.ctaEmailButton)
                document.querySelector('#cta input[value="E-mail us"]').value = data.ctaEmailButton;
            if (data.ctaCallButton)
                document.querySelector('#cta input[value="Call us"]').value = data.ctaCallButton;

            // Update footer section
            if (data.footerText) document.querySelector('#footer p').innerText = data.footerText;
            if (data.copyright)
                document.querySelector('#footer .copyright li:first-child').innerHTML = data.copyright;
        })
        .catch(error => console.error('Error loading JSON:', error));
}

// Add event listeners to language buttons
document.getElementById('lang-en').addEventListener('click', () => {
    updateContent('en'); // Load English content
    localStorage.setItem('selectedLanguage', 'en'); // Save selected language
});

document.getElementById('lang-fr').addEventListener('click', () => {
    updateContent('fr'); // Load French content
    localStorage.setItem('selectedLanguage', 'fr'); // Save selected language
});

// Load default or previously selected language on page load
const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
updateContent(savedLanguage);
