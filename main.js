$(document).ready(function() {
    let currentPublication = '';
    let currentAlgorithm = '';
    let currentStep = '';
    let currentQuestionIndex = 0;
    let collectedAnswers = [];

    window.selectAlgorithm = function() {
        const selectedValue = $('#algorithm-select').val();
        if (selectedValue) {
            const [publication, algorithm] = selectedValue.split('-');
            currentPublication = publication;
            currentAlgorithm = algorithm || 'standard'; // Default to 'standard' if no algorithm part
            currentStep = 'start';
            currentQuestionIndex = 0;
            collectedAnswers = [];
            showStep(currentPublication, currentAlgorithm, currentStep, currentQuestionIndex);
        }
    };

    window.nextStep = function() {
        const answer = $(`#question-${currentQuestionIndex}`).val();
        collectedAnswers.push(answer);
        console.log('Collected Answers:', collectedAnswers); // Handle answers as needed

        currentQuestionIndex++;
        const stepData = algorithms[currentPublication][currentAlgorithm][currentStep];
        if (currentQuestionIndex < stepData.length) {
            // Show next question within the current step
            showStep(currentPublication, currentAlgorithm, currentStep, currentQuestionIndex);
        } else {
            // Move to the next step
            currentQuestionIndex = 0;
            determineNextStep();
        }
    };

    window.restart = function() {
        currentPublication = '';
        currentAlgorithm = '';
        currentStep = '';
        currentQuestionIndex = 0;
        collectedAnswers = [];
        $('#dynamic-content').html('');
        $('#algorithm-select').val('');
    };

    function determineNextStep() {
        switch (currentStep) {
            case 'start':
                handleStartStep();
                break;
            case 'age_specific_e':
                handleAgeSpecificEStep();
                break;
            case 'la_strain':
                handleLaStrainStep();
                break;
            case 'lars':
                handleLarsStep();
                break;
            case 'supplemental_params':
                handleSupplementalParamsStep();
                break;
            default:
                $('#dynamic-content').html('<p>Error: Unknown step.</p>');
        }

        collectedAnswers = []; // Reset collected answers for the next step
        if (currentStep !== 'results') {
            showStep(currentPublication, currentAlgorithm, currentStep, currentQuestionIndex);
        }
    }

    function handleStartStep() {
        const positives = collectedAnswers.filter(answer => answer === 'positive').length;
        const negatives = collectedAnswers.filter(answer => answer === 'negative').length;
        const availables = collectedAnswers.filter(answer => answer !== 'unavailable').length;

        if (availables < 2) {
            $('#dynamic-content').html(`
                <h2>Insufficient Information</h2>
                <p>There is not enough information to proceed. Please start over.</p>
                <button onclick="restart()">Start Over</button>
            `);
            return;
        }

        if (negatives >= 2) {
            currentStep = 'age_specific_e';
        } else if (positives >= 2) {
            currentStep = 'results';
            $('#dynamic-content').html('<h2>Result: Impaired Diastolic Function with Elevated Filling Pressures</h2>');
        } else if (availables === 2 && positives === 1 && negatives === 1) {
            currentStep = 'la_strain';
        } 
    }

    function handleAgeSpecificEStep() {
        // Logic for determining next step from age_specific_e step
        // Placeholder logic for demonstration purposes
        const positives = collectedAnswers.filter(answer => answer === 'positive').length;
        if (positives > 0) {
            currentStep = 'results';
            $('#dynamic-content').html('<h2>Result: Impaired Diastolic Function with Normal filling pressures</h2>');
        } else {
            currentStep = 'results';
            $('#dynamic-content').html('<h2>Result: Normal Diastolic Function</h2>');
        }
    }

    function handleLaStrainStep() {
        // Logic for determining next step from la_strain step
        // Placeholder logic for demonstration purposes
        const positives = collectedAnswers.filter(answer => answer === 'positive').length;
        if (positives > 0) {
            currentStep = 'lars';
        } else {
            currentStep = 'age_specific_e';
        }
    }

    function handleLarsStep() {
        // Logic for determining next step from lars step
        // Placeholder logic for demonstration purposes
        const positives = collectedAnswers.filter(answer => answer === 'positive').length;
        if (positives > 0) {
            currentStep = 'results';
            $('#dynamic-content').html('<h2>Result: Impaired Diastolic Function with Elevated filling pressures</h2>');
        } else {
            currentStep = 'supplemental_params';
        }
    }

    function handleSupplementalParamsStep() {
        // Logic for determining next step from supplemental_params step
        // Placeholder logic for demonstration purposes
        const positives = collectedAnswers.filter(answer => answer === 'positive').length;
        if (positives > 0) {
            currentStep = 'results';
            $('#dynamic-content').html('<h2>Result: Impaired Diastolic Function with Elevated filling pressures</h2>');
        } else {
            currentStep = 'age_specific_e';
        }
    }

    function showStep(publication, algorithm, step, questionIndex) {
        const stepData = algorithms[publication] && algorithms[publication][algorithm] && algorithms[publication][algorithm][step];
        if (stepData && Array.isArray(stepData) && stepData[questionIndex]) {
            const questionObj = stepData[questionIndex];
            const optionsHtml = questionObj.options.map(opt => `<option value="${opt.value}">${opt.text}</option>`).join('');
            $('#dynamic-content').html(`
                <h2>${questionObj.question}</h2>
                <select id="question-${questionIndex}" class="question-select">
                    <option value="">--Select--</option>
                    ${optionsHtml}
                </select>
                <button onclick="nextStep()">Next</button>
            `);
        } else {
            $('#dynamic-content').html('<p>Error: Step data not found or no more questions.</p>');
        }
    }
});
