document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const typingInput = document.getElementById('typing-input');
    const textToType = document.getElementById('text-to-type').textContent;
    const wpmDisplay = document.getElementById('wpm');
    const accuracyDisplay = document.getElementById('accuracy');

    let startTime = null;

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
            typingInput.value = '';
            typingInput.disabled = false;
            typingInput.focus();
            startBtn.textContent = 'Submit';
            startTime = new Date();
        } else {
            submitTest();
        }
    });

    typingInput.addEventListener('keypress', (event) => {
        if ((event.key === 'Enter' || event.keyCode === 13) && startTime && !typingInput.disabled) {
            event.preventDefault();
            submitTest();
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
            typingInput.disabled = true;
            startBtn.textContent = 'Restart';
            startBtn.onclick = function() {
                console.log('Restarting...');
                location.reload();
            };
        })
        .catch(error => console.error('Error:', error));
    }
});
