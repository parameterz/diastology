$(document).ready(function () {
    let currentPublication = "";
    let currentAlgorithm = "";
    let currentStep = "";
    let currentQuestionIndex = 0;
    let collectedAnswers = [];
  
    window.selectAlgorithm = function () {
      const selectedValue = $("#algorithm-select").val();
      if (selectedValue) {
        const [publication, algorithm] = selectedValue.split("-");
        currentPublication = publication;
        currentAlgorithm = algorithm || "standard"; // Default to 'standard' if no algorithm part
        currentStep = "start";
        currentQuestionIndex = 0;
        collectedAnswers = [];
        showStep(
          currentPublication,
          currentAlgorithm,
          currentStep,
          currentQuestionIndex
        );
        showCitation(currentPublication);
      }
    };
  
    function showCitation(publication) {
      //console.log(algorithms[publication].citation);
      const citation = algorithms[publication].citation;
      if (citation) {
          $('#citation-content').html(`
              <h2>Citation</h2>
              <p><a href="${citation.url}" target="_blank">${citation.title}</a>.</p>
              <p>${citation.authors}</p>
              <p>${citation.journal}</p>
          `);
      }
  }
  
    window.nextStep = function () {
      const answer = $(`#question-${currentQuestionIndex}`).val();
      if (!answer) {
        alert("Please select an option to proceed.");
        return;
      }
      collectedAnswers.push(answer);
      //console.log("Collected Answers:", collectedAnswers); // Handle answers as needed
  
      currentQuestionIndex++;
      const stepData =
        algorithms[currentPublication][currentAlgorithm][currentStep];
      if (currentQuestionIndex < stepData.length) {
        // Show next question within the current step
        showStep(
          currentPublication,
          currentAlgorithm,
          currentStep,
          currentQuestionIndex
        );
      } else {
        // Move to the next step
        currentQuestionIndex = 0;
        determineNextStep();
      }
    };
  
    window.restart = function () {
      currentPublication = "";
      currentAlgorithm = "";
      currentStep = "";
      currentQuestionIndex = 0;
      collectedAnswers = [];
      $("#dynamic-content").html("");
      $("#algorithm-select").val("");
      $('#citation-content').html(''); // Clear citation content
    };
  
    function determineNextStep() {
      switch (currentPublication) {
        case "ase2016":
          switch (currentAlgorithm) {
            case "standard":
              switch (currentStep) {
                case "start":
                  handleASE2016_1StartStep();
                  break;
              }
              
            case "dysfunction":
              switch (currentStep) {
                  case "start":
                      handleASE2016_2Start();
                      break;
                  case "step2":
                      handleASE2016_2Step2();
                      break;
              }
  
          }
          break;
        case "bse":
          switch (currentAlgorithm) {
            case "standard":
              switch (currentStep) {
                case "start":
                  handleStartStep();
                  break;
                case "age_specific_e":
                  handleAgeSpecificEStep();
                  break;
                case "la_strain":
                  handleLaStrainStep();
                  break;
                case "lars":
                  handleLarsStep();
                  break;
                case "supplemental_params":
                  handleSupplementalParamsStep();
                  break;
                default:
                  $("#dynamic-content").html(
                    "<p>Error: Unknown step for BSE Standard.</p>"
                  );
              }
              break;
            case "dysfunction":
              switch (currentStep) {
                case "start":
                  handleDysfxStartStep();
                  break;
                case "la_strain":
                  handleDysfxLAStrainStep();
                  break;
                case "supplemental_params":
                  handleDysfxSupplementalParamsStep();
                  break;
                default:
                  $("#dynamic-content").html(
                    "<p>Error: Unknown step for BSE Dysfunction.</p>"
                  );
              }
              break;
            case "afib":
              switch (currentStep) {
                case "start":
                  handleAFStartStep();
                  break;
                case "step2":
                  handleAFStep2();
                  break;
                default:
                  $("#dynamic-content").html(
                    "<p>Error: Unknown step for BSE AFib.</p>"
                  );
              }
              break;
            default:
              $("#dynamic-content").html(
                "<p>Error: Unknown algorithm for BSE.</p>"
              );
          }
          break;
        default:
          $("#dynamic-content").html("<p>Error: Unknown publication.</p>");
      }
  
      collectedAnswers = []; // Reset collected answers for the next step
      if (currentStep !== "results" && currentStep !== "insufficient_info") {
        showStep(
          currentPublication,
          currentAlgorithm,
          currentStep,
          currentQuestionIndex
        );
      }
    }
  
    function handleStartStep() {
      const positives = collectedAnswers.filter(
        (answer) => answer === "positive"
      ).length;
      const negatives = collectedAnswers.filter(
        (answer) => answer === "negative"
      ).length;
      const availables = collectedAnswers.filter(
        (answer) => answer !== "unavailable"
      ).length;
      const unavailables = collectedAnswers.filter(
        (answer) => answer === "unavailable"
      ).length;
  
      if (unavailables >= 2) {
        currentStep = "insufficient_info";
        $("#dynamic-content").html(`
                  <h2>Insufficient Information</h2>
                  <p>There is not enough information to proceed. Please start over.</p>
                  <button onclick="restart()">Start Over</button>
              `);
        return;
      }
  
      if (negatives >= 2) {
        currentStep = "age_specific_e";
      } else if (positives >= 2) {
        currentStep = "results";
        showResult("impaired-elevated");
      } else if (availables === 2 && positives === 1 && negatives === 1) {
        currentStep = "la_strain";
      }
    }
  
    function handleDysfxStartStep() {
      const positives = collectedAnswers.filter(
        (answer) => answer === "positive"
      ).length;
      const negatives = collectedAnswers.filter(
        (answer) => answer === "negative"
      ).length;
      const availables = collectedAnswers.filter(
        (answer) => answer !== "unavailable"
      ).length;
      const unavailables = collectedAnswers.filter(
        (answer) => answer === "unavailable"
      ).length;
  
      if (unavailables >= 2) {
        currentStep = "insufficient_info";
        $("#dynamic-content").html(`
                  <h2>Insufficient Information</h2>
                  <p>There is not enough information to proceed. Please start over.</p>
                  <button onclick="restart()">Start Over</button>
              `);
        return;
      }
  
      if (negatives >= 2) {
        currentStep = "results";
        showResult("impaired-normal");
      } else if (positives >= 2) {
        currentStep = "results";
        showResult("impaired-elevated");
      } else if (availables === 2 && positives === 1 && negatives === 1) {
        currentStep = "la_strain";
      }
    }
  
    function handleAFStartStep() {
      const positives = collectedAnswers.filter(
        (answer) => answer === "positive"
      ).length;
      const negatives = collectedAnswers.filter(
        (answer) => answer === "negative"
      ).length;
      const availables = collectedAnswers.filter(
        (answer) => answer !== "unavailable"
      ).length;
      const unavailables = collectedAnswers.filter(
        (answer) => answer === "unavailable"
      ).length;
  
      if (negatives >= 3) {
        currentStep = "results";
        showResult("af-normal");
      } else if (positives >= 3) {
        currentStep = "results";
        showResult("impaired-elevated");
      } else {
        currentStep = "step2";
      }
    }
  
    function handleASE2016_1StartStep() {
      const positives = collectedAnswers.filter(
        (answer) => answer === "positive"
      ).length;
      const negatives = collectedAnswers.filter(
        (answer) => answer === "negative"
      ).length;
  
      if (negatives > 2) {
        currentStep = "results";
        showResult("normal");
      } else if (positives > 2) {
        currentStep = "results";
        showResult("impaired-elevated");
      } else {
        currentStep = "results";
        showResult("indeterminate");
      }
    }
  
    function handleASE2016_2Start() {
      //console.log(`inside step 1 for ${currentPublication}, ${currentAlgorithm}, ${currentStep}`);
      if (collectedAnswers.includes("negative")) {
          currentStep = "results";
          showResult("grade-1");
        } else if (collectedAnswers.includes("positive")) {
          currentStep = "results";
          showResult("grade-3");
        } else if (collectedAnswers.includes("evaluate")) {
          currentStep = "step2";
        }
    }
  
    function handleASE2016_2Step2() {
      const positives = collectedAnswers.filter((answer) => answer === "positive").length;
      const negatives = collectedAnswers.filter((answer) => answer === "negative").length;
      const availables = collectedAnswers.filter((answer) => answer !== "unavailable").length;
      if (availables > 2){
          if(positives>=2){
              currentStep = "results";
              showResult("grade-2");
              } else if(negatives>=2) {
                  currentStep = "results";
                  showResult("grade-1");
                  }
      } else if (availables == 2 && positives + negatives == 2){
          if (positives == 2){
              currentStep = "results";
              showResult("grade-2");
          } else if (negatives == 2) {
              currentStep = "results";
              showResult("grade-1");
          } else {
              currentStep = "results";
              showResult("indeterminate");
          }
      }
      else{
          showResult("insufficient_info");
      }
    }
  
    function handleAgeSpecificEStep() {
      // Logic for determining next step from age_specific_e step
      const positives = collectedAnswers.filter(
        (answer) => answer === "positive"
      ).length;
      if (positives > 0) {
        currentStep = "results";
        showResult("impaired-normal");
      } else {
        currentStep = "results";
        showResult("normal");
      }
    }
  
    function handleLaStrainStep() {
      // Logic for determining next step from la_strain step
      const positives = collectedAnswers.filter(
        (answer) => answer === "positive"
      ).length;
      if (positives > 0) {
        currentStep = "lars";
      } else {
        currentStep = "age_specific_e";
      }
    }
  
    function handleDysfxLAStrainStep() {
      // Logic for determining next step from la_strain step
      const positives = collectedAnswers.filter(
        (answer) => answer === "positive"
      ).length;
      if (collectedAnswers.includes("positive")) {
        currentStep = "results";
        showResult("impaired-elevated");
      } else if (collectedAnswers.includes("negative")) {
        currentStep = "results";
        showResult("impaired-normal");
      } else {
        //intermediate
        currentStep = "supplemental_params";
      }
    }
  
    function handleLarsStep() {
      // Logic for determining next step from lars step
      const positives = collectedAnswers.filter(
        (answer) => answer === "positive"
      ).length;
      if (positives > 0) {
        currentStep = "results";
        showResult("impaired-elevated");
      } else {
        currentStep = "supplemental_params";
      }
    }
  
    function handleSupplementalParamsStep() {
      // Logic for determining next step from supplemental_params step
      const positives = collectedAnswers.filter(
        (answer) => answer === "positive"
      ).length;
      if (positives > 0) {
        currentStep = "results";
        showResult("impaired-elevated");
      } else {
        currentStep = "age_specific_e";
      }
    }
  
    function handleDysfxSupplementalParamsStep() {
      // Logic for determining next step from supplemental_params step
      const positives = collectedAnswers.filter(
        (answer) => answer === "positive"
      ).length;
      if (positives > 0) {
        currentStep = "results";
        showResult("impaired-elevated");
      } else {
        currentStep = "results";
        showResult("impaired-normal");
      }
    }
  
    function handleAFStep2() {
      const positives = collectedAnswers.filter(
        (answer) => answer === "positive"
      ).length;
      const negatives = collectedAnswers.filter(
        (answer) => answer === "negative"
      ).length;
      if (positives >= 2) {
        currentStep = "results";
        showResult("impaired-elevated");
      } else if (negatives >= 2) {
        currentStep = "results";
        showResult("af-normal");
      } else {
        currentStep = "results";
        showResult("indeterminate");
      }
    }
  
    function showStep(publication, algorithm, step, questionIndex) {
      const stepData =
        algorithms[publication] &&
        algorithms[publication][algorithm] &&
        algorithms[publication][algorithm][step];
      if (stepData && Array.isArray(stepData) && stepData[questionIndex]) {
        const questionObj = stepData[questionIndex];
        const optionsHtml = questionObj.options
          .map((opt) => `<option value="${opt.value}">${opt.text}</option>`)
          .join("");
        $("#dynamic-content").html(`
                  <h2>${questionObj.question}</h2>
                  <select id="question-${questionIndex}" class="question-select">
                      <option value="">--Select--</option>
                      ${optionsHtml}
                  </select>
                  <button onclick="nextStep()">Next</button>
              `);
      } else {
        $("#dynamic-content").html(
          "<p>Error: Step data not found or no more questions.</p>"
        );
      }
    }
    function showResult(result) {
      var message, resultClass;
      currentStep = "results";
      switch (result) {
        case "normal":
          message = "Normal Diastolic Function";
          resultClass = "result-normal";
          break;
        case "af-normal":
          message = "Normal Filling Pressures";
          resultClass = "result-normal";
          break;
        case "grade-1":
          message = "Grade 1 Diastolic Dysfunction with Normal Filling Pressures";
          resultClass = "result-impaired";
          break;
        case "impaired-normal":
          message = "Impaired Diastolic Function with Normal Filling Pressures";
          resultClass = "result-impaired";
          break;
        case "impaired-elevated":
          message = "Impaired Diastolic Function with ELEVATED Filling Pressures";
          resultClass = "result-elevated";
          break;
        case "grade-2":
          message =
            "Grade 2 Diastolic Dysfunction with ELEVATED Filling Pressures";
          resultClass = "result-elevated";
          break;
        case "grade-3":
          message =
            "Grade 3 Diastolic Dysfunction with ELEVATED Filling Pressures";
          resultClass = "result-elevated";
          break;
        case "indeterminate":
          message = "Indeterminate Filling Pressures";
          resultClass = "result-impaired";
          break;
      }
      $("#dynamic-content").html(`
              <div class="result ${resultClass}">
                  <h2>${message}</h2>
              </div>
              <button onclick="restart()">Start Over</button>
          `);
    }
  });