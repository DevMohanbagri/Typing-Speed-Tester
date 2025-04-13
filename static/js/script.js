document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const typingInput = document.getElementById('typing-input');
    const textToType = document.getElementById('text-to-type').textContent;
    const wpmDisplay = document.getElementById('wpm');
    const accuracyDisplay = document.getElementById('accuracy');

    let startTime = null;

    // Ensure textarea is disabled on load (debugging)
    console.log('Initial textarea disabled state:', typingInput.disabled);
    if (!typingInput.disabled) {
        typingInput.disabled = true; // Force disable if not already
    }

    // Prevent copy and context menu on text-to-type
    const textToTypeElement = document.getElementById('text-to-type');
    textToTypeElement.addEventListener('copy', (event) => {
        event.preventDefault();
    });
    textToTypeElement.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    });

    startBtn.addEventListener('click', () => {
        if (!startTime) {
            // Enable textarea and start the test
            typingInput.disabled = false;
            typingInput.value = '';
            typingInput.focus();
            startBtn.textContent = 'Submit';
            startTime = new Date();
            console.log('Test started, textarea enabled');
        } else {
            submitTest();
        }
    });

    typingInput.addEventListener('keypress', (event) => {
        if ((event.key === 'Enter' || event.keyCode === 13) && startTime && !typingInput.disabled) {
            event.preventDefault();
            submitTest();
        } else if (!startTime && !typingInput.disabled) {
            event.preventDefault(); // Block input if test hasn’t started
            console.log('Input blocked, test not started');
        }
    });

    function submitTest() {
        if (!startTime) return;

        const endTime = new Date();
        const timeTaken = endTime - startTime;
        console.log('Time taken (ms):', timeTaken);
        const typedText = typingInput.value.trim();

        fetch('/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                original_text: textToType,
                typed_text: typedText,
                time_taken: timeTaken
            })
        })
        .then(response => response.json())
        .then(data => {
            wpmDisplay.textContent = data.wpm;
            accuracyDisplay.textContent = `${data.accuracy}%`;
            typingInput.disabled = true; // Disable after submission
            startBtn.textContent = 'Restart';
            startBtn.onclick = function() {
                console.log('Restarting...');
                location.reload();
            };
        })
        .catch(error => console.error('Error:', error));
    }
});
