// Carousel functionality
let currentImage = 0;
const totalImages = 10;
const imageSlides = document.querySelectorAll('.image-slide');
const indicators = document.querySelectorAll('.indicator');
const currentDisplay = document.getElementById('current');
const progressBar = document.getElementById('progressBar');

function showImage(index) {
    // Hide all images
    imageSlides.forEach((slide, i) => {
        slide.classList.remove('active', 'prev');
        if (i < index) {
            slide.classList.add('prev');
        } else if (i === index) {
            slide.classList.add('active');
        }
    });

    // Update indicators
    if (indicators.length > 0) {
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
    }

    // Update counter
    if (currentDisplay) {
        currentDisplay.textContent = index + 1;
    }

    // Update progress bar
    if (progressBar) {
        const progress = ((index + 1) / totalImages) * 100;
        progressBar.style.width = progress + '%';
    }
}

function nextImage() {
    currentImage = (currentImage + 1) % totalImages;
    showImage(currentImage);
}

function prevImage() {
    currentImage = (currentImage - 1 + totalImages) % totalImages;
    showImage(currentImage);
}

function goToImage(index) {
    currentImage = index;
    showImage(currentImage);
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // Check if the focus is currently on an input field or textarea
    const target = e.target;
    const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

    if (e.key === 'ArrowRight' || (e.key === ' ' && !isInput)) {
        e.preventDefault(); // Prevent default only if not in an input field
        nextImage();
    }
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevImage();
    }
    if (e.key === 'Escape') {
        // Optional: Add fullscreen toggle or close functionality
    }
});

// Touch/swipe support
let startX = 0;
let startY = 0;
let isDragging = false;

document.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = false;
});

document.addEventListener('touchmove', function(e) {
    if (!startX) return;
    isDragging = true;
    e.preventDefault(); // Prevent scrolling
});

document.addEventListener('touchend', function(e) {
    if (!startX || !isDragging) return;
    
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = startX - endX;
    const diffY = startY - endY;
    
    // Only swipe if horizontal movement is greater than vertical
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
            nextImage();
        } else {
            prevImage();
        }
    }
    
    startX = 0;
    startY = 0;
    isDragging = false;
});

// Auto-play
let autoPlay = setInterval(nextImage, 2000); // Uncommented and changed to 2 seconds

// Pause auto-play on interaction
document.addEventListener('click', function() {
    clearInterval(autoPlay);
    autoPlay = setInterval(nextImage, 2000); // Uncommented and changed to 2 seconds
});

// Initialize progress bar
showImage(0);

// YouTube Video Player
let player;

function onYouTubeIframeAPIReady() {
    // Player will be initialized when section is in view
}

const videoSection = document.getElementById('video');
if (videoSection) {
    const videoIframe = videoSection.querySelector('iframe');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // When the section is in view, create or play the video
                if (!player) {
                    player = new YT.Player(videoIframe, {
                        events: {
                            'onReady': onPlayerReady
                        }
                    });
                } else {
                    player.playVideo();
                }
                observer.unobserve(entry.target); // Stop observing once played
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% of the section is visible

    function onPlayerReady(event) {
        event.target.playVideo();
    }

    // Start observing the video section
    observer.observe(videoSection);
}

// Profile Card Functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeProfileCard();
});

function initializeProfileCard() {
    const card = document.querySelector('.profile-card');
    const linkedinButtons = document.querySelectorAll('.linkedin-button');

    if (!card) return;

    // Optional: Add subtle 3D tilt effect during hover (without interfering with flip)
    card.addEventListener('mousemove', (e) => {
        if (!card.matches(':hover')) return;
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 40; // Reduced intensity
        const rotateY = (centerX - x) / 40;
        
        // Apply subtle 3D tilt on top of CSS flip
        card.style.transform = `rotateY(180deg) scale(1.02) rotateX(${rotateX}deg) rotateZ(${rotateY/3}deg)`;
    });

    // Reset to CSS-controlled state when mouse leaves
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });

    // LinkedIn button hover animations
    linkedinButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });
}

// Souvenir Generator Variables
let souvenirMessage = '';
let selectedSouvenirImage = null;
let currentSouvenirStep = 1;

// Initialize Souvenir Generator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSouvenirGenerator();
});

function initializeSouvenirGenerator() {
    const messageInput = document.getElementById('souvenirMessage');
    const charCount = document.getElementById('souvenirCharCount');
    const nextBtn = document.getElementById('nextToImages');
    const createBtn = document.getElementById('createSouvenir');
    const copyBtn = document.getElementById('copyImageBtn');
    const shareBtn = document.getElementById('shareImageBtn');

    // Check if elements exist before adding listeners
    if (!messageInput || !charCount || !nextBtn) {
        console.log('Souvenir generator elements not found');
        return;
    }

    // Message input handling
    messageInput.addEventListener('input', function(e) {
        // Get the raw input value
        let value = this.value;
        
        // Ensure we're not counting spaces as additional characters
        const length = value.length;
        
        // Update character count
        charCount.textContent = length;
        
        // Enable/disable next button based on whether there's any content
        nextBtn.disabled = length === 0;
        
        // Store the message
        souvenirMessage = value;
    });

    // Prevent space key from being handled specially
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === ' ') {
            // Allow the space to be inserted normally
            return true;
        }
    });

    // Next to images button
    nextBtn.addEventListener('click', function() {
        if (!souvenirMessage) return;
        
        const messagePreview = document.getElementById('messagePreview');
        if (messagePreview) {
            messagePreview.textContent = souvenirMessage;
        }
        goToSouvenirStep(2);
    });

    // Image selection handling
    const imageOptions = document.querySelectorAll('.souvenir-image-option');
    imageOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove previous selection
            imageOptions.forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Select current
            this.classList.add('selected');
            selectedSouvenirImage = this.dataset.image;
            
            if (createBtn) {
                createBtn.disabled = false;
            }
        });
    });

    // Create souvenir button
    if (createBtn) {
        createBtn.addEventListener('click', function() {
            createSouvenirImage();
        });
    }

    // Copy and share buttons
    if (copyBtn) {
        copyBtn.addEventListener('click', copySouvenirToClipboard);
    }
    
    if (shareBtn) {
        shareBtn.addEventListener('click', shareSouvenirImage);
    }
}

function goToSouvenirStep(stepNumber) {
    // Hide all steps
    const steps = document.querySelectorAll('.souvenir-step');
    steps.forEach(step => {
        step.classList.remove('active');
    });
    
    // Show target step
    const targetStep = document.getElementById(`step${stepNumber}`);
    if (targetStep) {
        targetStep.classList.add('active');
        currentSouvenirStep = stepNumber;
    }
}

function createSouvenirImage() {
    if (!selectedSouvenirImage || !souvenirMessage) return;

    const canvas = document.getElementById('souvenirCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 1000;
    canvas.height = 600;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = function() {
        // Draw background image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // --- Draw white background area for text ---
        const textZoneWidth = canvas.width * 0.3; // Decreased width of the white area
        const textZonePadding = 25; // Keep padding
        const textZoneX = canvas.width - textZoneWidth;
        const textZoneY = 0;
        const textZoneHeight = canvas.height;
        
        ctx.fillStyle = 'white';
        ctx.fillRect(textZoneX, textZoneY, textZoneWidth, textZoneHeight);

        // --- Add default information (Time and Location - horizontal at bottom) ---
        ctx.fillStyle = 'black';
        ctx.font = 'normal 12px \'Times One\', serif'; // Use Times One font, size 12
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        
        const timeText = 'May - Summer 2025';
        const locationTextLine1 = 'New York University Abu Dhabi';
        const locationTextLine2 = 'Saadiyat Island';

        const startX = textZoneX + textZonePadding;
        const startY = textZoneY + textZoneHeight - textZonePadding; // Position at the very bottom
        const lineHeight = 15; // Adjusted line height for 12px font

        // Draw text lines from bottom up
        ctx.fillText(locationTextLine2, startX, startY);
        ctx.fillText(locationTextLine1, startX, startY - lineHeight);
        ctx.fillText(timeText, startX, startY - (2 * lineHeight));

        // --- Add user's text (souvenir message) ---
        ctx.fillStyle = 'black';
        ctx.font = 'normal 18px Roboto, sans-serif'; // Further adjusted font size for main message
        ctx.textAlign = 'left'; // Align user message left
        ctx.textBaseline = 'top';
        
        // Word wrap the user's text within the available space
        const words = souvenirMessage.split(' ');
        const lines = [];
        let currentLine = words[0];

        // Calculate available space for the main message
        const messageZoneX = textZoneX + textZonePadding;
        const messageZoneWidth = textZoneWidth - (2 * textZonePadding);
        const messageZoneY = textZoneY + textZonePadding; // Start from top
        
        const userMessageLineHeight = 22; // Adjusted line height for user message
        // Calculate max height available for the user message based on other elements
        const spaceForMessage = textZoneHeight - (2 * textZonePadding) - (3 * lineHeight) - 20; // Account for padding, 3 lines of info text, and some spacing
        const maxLinesForMessageFallback1 = Math.floor(spaceForMessage / userMessageLineHeight); 

        for (let i = 1; i < words.length; i++) {
            const testLine = currentLine + ' ' + words[i];
            const metrics = ctx.measureText(testLine);
             // Check against the available width for the message
            if (metrics.width > messageZoneWidth) {
                lines.push(currentLine);
                currentLine = words[i];
            } else {
                currentLine = testLine;
            }
        }
        lines.push(currentLine);

        // Draw each line of the user's message, limiting the number of lines
        lines.slice(0, maxLinesForMessageFallback1).forEach((line, index) => { 
             // Position relative to the message zone, aligned left
            ctx.fillText(line, messageZoneX, messageZoneY + index * userMessageLineHeight);
        });

        goToSouvenirStep(3);
    };

    img.onerror = function(error) {
        console.error('Error loading image:', error);
        console.log('Attempted to load image from:', selectedSouvenirImage);
        
        // Try to load the image without crossOrigin
        const img2 = new Image();
        img2.onload = function() {
            ctx.drawImage(img2, 0, 0, canvas.width, canvas.height);

            // --- Draw white background area for text (fallback) ---
            const textZoneWidth = canvas.width * 0.3; // Decreased width of the white area
            const textZonePadding = 25; // Keep padding
            const textZoneX = canvas.width - textZoneWidth;
            const textZoneY = 0;
            const textZoneHeight = canvas.height;
            
            ctx.fillStyle = 'white';
            ctx.fillRect(textZoneX, textZoneY, textZoneWidth, textZoneHeight);

            // --- Add default information (Time and Location - horizontal at bottom - fallback) ---
            ctx.fillStyle = 'black';
            ctx.font = 'normal 12px \'Times One\', serif'; // Use Times One font, size 12
            ctx.textAlign = 'left';
            ctx.textBaseline = 'bottom';
            
            const timeText = 'May - Summer 2025';
            const locationTextLine1 = 'New York University Abu Dhabi';
            const locationTextLine2 = 'Saadiyat Island';

            const startX = textZoneX + textZonePadding;
            const startY = textZoneY + textZoneHeight - textZonePadding; // Position at the very bottom
            const lineHeight = 15; // Adjusted line height for 12px font

            // Draw text lines from bottom up
            ctx.fillText(locationTextLine2, startX, startY);
            ctx.fillText(locationTextLine1, startX, startY - lineHeight);
            ctx.fillText(timeText, startX, startY - (2 * lineHeight));

            // --- Add user's text (souvenir message - fallback) ---
            ctx.fillStyle = 'black';
            ctx.font = 'normal 18px Roboto, sans-serif'; // Further adjusted font size for main message
            ctx.textAlign = 'left'; // Align user message left
            ctx.textBaseline = 'top';
            
            // Word wrap the user's text within the available space
            const words = souvenirMessage.split(' ');
            const lines = [];
            let currentLine = words[0];

            // Calculate available space for the main message
            const messageZoneX = textZoneX + textZonePadding;
            const messageZoneWidth = textZoneWidth - (2 * textZonePadding);
            const messageZoneY = textZoneY + textZonePadding; // Start from top
            
            const userMessageLineHeight = 22; // Adjusted line height for user message
            const spaceForMessage = textZoneHeight - (2 * textZonePadding) - (3 * lineHeight) - 20; // Account for padding, 3 lines of info text, and some spacing
            const maxLinesForMessageFallback2 = Math.floor(spaceForMessage / userMessageLineHeight); 

            for (let i = 1; i < words.length; i++) {
                const testLine = currentLine + ' ' + words[i];
                const metrics = ctx.measureText(testLine);
                 // Check against the available width for the message
                if (metrics.width > messageZoneWidth) {
                    lines.push(currentLine);
                    currentLine = words[i];
                } else {
                    currentLine = testLine;
                }
            }
            lines.push(currentLine);

            // Draw each line of the user's message, limiting the number of lines
            lines.slice(0, maxLinesForMessageFallback2).forEach((line, index) => { 
                 // Position relative to the message zone, aligned left
                ctx.fillText(line, messageZoneX, messageZoneY + index * userMessageLineHeight);
            });
            
            goToSouvenirStep(3);
        };
        
        img2.onerror = function() {
            console.error('Second attempt to load image failed, using fallback gradient...');
             // Fallback to black background if image loading fails completely
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // --- Draw white background area for text (final fallback) ---
             const textZoneWidth = canvas.width * 0.3; // Decreased width of the white area
            const textZonePadding = 25; // Keep padding
            const textZoneX = canvas.width - textZoneWidth;
            const textZoneY = 0;
            const textZoneHeight = canvas.height;
            
            ctx.fillStyle = 'white';
            ctx.fillRect(textZoneX, textZoneY, textZoneWidth, textZoneHeight);
            
            // --- Add default information (Time and Location - horizontal at bottom - final fallback) ---
            ctx.fillStyle = 'black';
            ctx.font = 'normal 12px \'Times One\', serif'; // Use Times One font, size 12
            ctx.textAlign = 'left';
            ctx.textBaseline = 'bottom';
            
            const timeText = 'May - Summer 2025';
            const locationTextLine1 = 'New York University Abu Dhabi';
            const locationTextLine2 = 'Saadiyat Island';

            const startX = textZoneX + textZonePadding;
            const startY = textZoneY + textZoneHeight - textZonePadding; // Position at the very bottom
            const lineHeight = 15; // Adjusted line height for 12px font

            // Draw text lines from bottom up
            ctx.fillText(locationTextLine2, startX, startY);
            ctx.fillText(locationTextLine1, startX, startY - lineHeight);
            ctx.fillText(timeText, startX, startY - (2 * lineHeight));

            // Add user's text with black color (final fallback)
            ctx.fillStyle = 'black'; 
            ctx.font = 'normal 18px Roboto, sans-serif'; // Further adjusted font size for main message
            ctx.textAlign = 'left'; // Align user message left
            ctx.textBaseline = 'top'; 
            
             // Word wrap the user's text within the available space
            const words = souvenirMessage.split(' ');
            const lines = [];
            let currentLine = words[0];

             // Calculate available space for the main message
            const messageZoneX = textZoneX + textZonePadding;
            const messageZoneWidth = textZoneWidth - (2 * textZonePadding);
            const messageZoneY = textZoneY + textZonePadding; // Start from top
            
            const userMessageLineHeight = 22; // Adjusted line height for user message
             const spaceForMessage = textZoneHeight - (2 * textZonePadding) - (3 * lineHeight) - 20; // Account for padding, 3 lines of info text, and some spacing
            const maxLinesForMessageFallback2 = Math.floor(spaceForMessage / userMessageLineHeight); 

            for (let i = 1; i < words.length; i++) {
                const testLine = currentLine + ' ' + words[i];
                const metrics = ctx.measureText(testLine);
                 // Check against the available width for the message
                if (metrics.width > messageZoneWidth) {
                    lines.push(currentLine);
                    currentLine = words[i];
                } else {
                    currentLine = testLine;
                }
            }
            lines.push(currentLine);

            // Draw each line of the user's message, limiting the number of lines
            lines.slice(0, maxLinesForMessageFallback2).forEach((line, index) => { 
                 // Position relative to the message zone, aligned left
                ctx.fillText(line, messageZoneX, messageZoneY + index * userMessageLineHeight);
            });
            
            goToSouvenirStep(3);
        };
        
        img2.src = selectedSouvenirImage;
    };

    img.src = selectedSouvenirImage;
}

async function copySouvenirToClipboard() {
    const canvas = document.getElementById('souvenirCanvas');
    const copyBtn = document.getElementById('copyImageBtn');
    const copyIcon = copyBtn ? copyBtn.querySelector('i') : null; // Get the icon element
    const originalTextNode = copyBtn ? Array.from(copyBtn.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== '') : null; // Get the text node, excluding empty ones
    const originalText = originalTextNode ? originalTextNode.nodeValue.trim() : 'Copy Image'; // Store original text
    const originalIconClass = copyIcon ? copyIcon.className : ''; // Store original icon class

    if (!canvas || !copyBtn) return;

    try {
        canvas.toBlob(async function(blob) {
            try {
                await navigator.clipboard.write([
                    new ClipboardItem({
                        'image/png': blob
                    })
                ]);

                // Visual feedback
                if (copyIcon) copyIcon.className = 'fas fa-check'; // Change icon to checkmark
                if (originalTextNode) originalTextNode.nodeValue = ' Copied!'; // Change text
                copyBtn.style.background = '#28a745'; // Keep original success color for feedback, or change to black/white?
                copyBtn.style.color = 'white'; // Ensure text is white on green feedback

                setTimeout(() => {
                    if (copyIcon) copyIcon.className = originalIconClass; // Revert icon
                    if (originalTextNode) originalTextNode.nodeValue = ' ' + originalText; // Revert text, add space back
                    copyBtn.style.background = ''; // Revert background (will go back to CSS style)
                    copyBtn.style.color = ''; // Revert text color (will go back to CSS style)
                }, 2000);

            } catch (clipboardError) {
                console.log('Clipboard API failed, trying fallback');
                fallbackCopyInstruction(copyBtn, originalIconClass, originalText);
            }
        }, 'image/png');

    } catch (error) {
        console.error('Copy failed:', error);
        fallbackCopyInstruction(copyBtn, originalIconClass, originalText);
    }
}

function fallbackCopyInstruction(copyBtn, originalIconClass, originalText) {
    const copyIcon = copyBtn ? copyBtn.querySelector('i') : null;
    const originalTextNode = copyBtn ? Array.from(copyBtn.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== '') : null;

    if (copyIcon) copyIcon.className = 'fas fa-mouse-pointer'; // Change icon to pointer/cursor
    if (originalTextNode) originalTextNode.nodeValue = ' Right-click image → Copy'; // Change text
    copyBtn.style.background = 'black'; // Change to black background
    copyBtn.style.color = 'white'; // Change to white text color
    copyBtn.style.border = '2px solid white'; // Add a white border for contrast

    setTimeout(() => {
        if (copyIcon) copyIcon.className = originalIconClass; // Revert icon
        if (originalTextNode) originalTextNode.nodeValue = ' ' + originalText; // Revert text, add space back
        copyBtn.style.background = ''; // Revert background
        copyBtn.style.color = ''; // Revert text color
        copyBtn.style.border = ''; // Revert border
    }, 3000);
}

async function shareSouvenirImage() {
    const canvas = document.getElementById('souvenirCanvas');
    
    if (!canvas) return;
    
    // Check if Web Share API is supported
    if (navigator.share && navigator.canShare) {
        try {
            canvas.toBlob(async function(blob) {
                const file = new File([blob], 'my-souvenir.png', { type: 'image/png' });
                
                const shareData = {
                    title: 'My Custom Souvenir',
                    text: 'Check out my personalized souvenir!',
                    files: [file]
                };
                
                if (navigator.canShare(shareData)) {
                    await navigator.share(shareData);
                } else {
                    await navigator.share({
                        title: 'My Custom Souvenir',
                        text: 'Check out my personalized souvenir! ' + souvenirMessage
                    });
                }
            }, 'image/png');
            
        } catch (error) {
            console.log('Web Share failed:', error);
            showShareFallback();
        }
    } else {
        showShareFallback();
    }
}

function showShareFallback() {
    const message = encodeURIComponent(`Check out my personalized souvenir: "${souvenirMessage}"`);
    
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        z-index: 1000;
        text-align: center;
        max-width: 400px;
    `;
    
    popup.innerHTML = `
        <h3 style="margin-bottom: 20px; color: #333;">Share Your Souvenir</h3>
        <p style="margin-bottom: 20px; color: #666;">Copy the image first, then share:</p>
        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-bottom: 20px;">
            <a href="https://twitter.com/intent/tweet?text=${message}" target="_blank" 
               style="background: #1da1f2; color: white; padding: 10px 15px; text-decoration: none; border-radius: 8px; font-size: 14px;">
               Twitter
            </a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${message}" target="_blank"
               style="background: #4267b2; color: white; padding: 10px 15px; text-decoration: none; border-radius: 8px; font-size: 14px;">
               Facebook
            </a>
            <a href="mailto:?subject=My Custom Souvenir&body=${message}" 
               style="background: #34495e; color: white; padding: 10px 15px; text-decoration: none; border-radius: 8px; font-size: 14px;">
               Email
            </a>
        </div>
        <button onclick="this.parentElement.remove()" 
                style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
            Close
        </button>
    `;
    
    document.body.appendChild(popup);
    
    setTimeout(() => {
        if (popup.parentElement) {
            popup.remove();
        }
    }, 15000);
}

function startSouvenirOver() {
    // Reset all form elements
    const messageInput = document.getElementById('souvenirMessage');
    const charCount = document.getElementById('souvenirCharCount');
    const nextBtn = document.getElementById('nextToImages');
    const createBtn = document.getElementById('createSouvenir');
    
    if (messageInput) messageInput.value = '';
    if (charCount) charCount.textContent = '0';
    if (nextBtn) nextBtn.disabled = true;
    if (createBtn) createBtn.disabled = true;
    
    // Remove image selections
    const imageOptions = document.querySelectorAll('.souvenir-image-option');
    imageOptions.forEach(option => {
        option.classList.remove('selected');
    });
    
    // Reset variables
    souvenirMessage = '';
    selectedSouvenirImage = null;
    
    // Go back to step 1
    goToSouvenirStep(1);
}

// Make functions globally available for onclick handlers
window.goToSouvenirStep = goToSouvenirStep;
window.startSouvenirOver = startSouvenirOver;

// About Film Section Interactions
document.addEventListener('DOMContentLoaded', function() {
    // Enhanced hover effects for cards
    const cards = document.querySelectorAll('.about-film .card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Documentation button interactions
    const docButton = document.querySelector('.about-film .doc-button');
    if (docButton) {
        docButton.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Here you can add functionality to open documentation
            console.log('Documentation button clicked');
        });
    }
    
    // Fade in animation on page load
    const aboutFilmContainer = document.querySelector('.about-film .container');
    if (aboutFilmContainer) {
        aboutFilmContainer.style.opacity = '0';
        aboutFilmContainer.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            aboutFilmContainer.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            aboutFilmContainer.style.opacity = '1';
            aboutFilmContainer.style.transform = 'translateY(0)';
        }, 100);
    }
});