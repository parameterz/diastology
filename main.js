$(document).ready(function() {
    let currentPublication = '';
    let currentAlgorithm = '';
    let currentStep = '';

    window.selectAlgorithm = function() {
        const selectedValue = $('#algorithm-select').val();
        if (selectedValue) {
            const [publication, algorithm] = selectedValue.split('-');
            currentPublication = publication;
            currentAlgorithm = algorithm || 'standard'; // Default to 'standard' if no algorithm part
            currentStep = 'start';
            showStep(currentPublication, currentAlgorithm, currentStep);
        }
    };

    window.nextStep = function(nextStepId) {
        currentStep = nextStepId;
        showStep(currentPublication, currentAlgorithm, currentStep);
    };

    function showStep(publication, algorithm, step) {
        const stepData = algorithms[publication] && algorithms[publication][algorithm] && algorithms[publication][algorithm][step];
        if (stepData && Array.isArray(stepData)) {
            let contentHtml = '';
            stepData.forEach((questionObj, index) => {
                const optionsHtml = questionObj.options.map(opt => `<option value="${opt.value}">${opt.text}</option>`).join('');
                contentHtml += `
                    <h2>${questionObj.question}</h2>
                    <select id="question-${index}" class="question-select">
                        <option value="">--Select--</option>
                        ${optionsHtml}
                    </select>
                `;
            });

            contentHtml += '<button onclick="collectAnswersAndNextStep()">Next</button>';
            $('#dynamic-content').html(contentHtml);
        } else {
            $('#dynamic-content').html('<p>Error: Step data not found.</p>');
        }
    }

    window.collectAnswersAndNextStep = function() {
        const answers = [];
        $('.question-select').each(function() {
            answers.push($(this).val());
        });
        console.log('Collected Answers:', answers); // Handle answers as needed
        // Here you can define logic to determine the next step based on the answers
        // For now, let's just proceed to the next step for simplicity
        nextStep('next-step-id'); // Replace 'next-step-id' with actual logic to determine next step
    };
});
