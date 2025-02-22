import React, { useState, useEffect } from "react";
import { AlgorithmNavigator } from "../services/AlgorithmNavigator";
import algorithms from "../algorithms";
import { DecisionNode, ResultNode, EvaluatorNode } from "../types/algorithm";
import Head from "next/head";
import { results } from "../data/results";
import { ThemeSwitcher } from "../components/ThemeSwitcher";

export default function Home() {
  // Create a navigator instance
  const [navigator] = useState<AlgorithmNavigator>(
    () => new AlgorithmNavigator(algorithms)
  );
  const [initialized, setInitialized] = useState<boolean>(false);

  // State for the component
  const [algorithmId, setAlgorithmId] = useState<string>("");
  const [modeId, setModeId] = useState<string>("");
  const [currentNode, setCurrentNode] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [currentResult, setCurrentResult] = useState<any>(null);

  // One-time initialization to prevent unnecessary effect triggers
  useEffect(() => {
    setInitialized(true);
  }, []);

  // Safe function to update current node and result
  const updateCurrentNodeAndResult = () => {
    // Safety check - only try to get current node if the algorithm has been started
    if (!algorithmId) {
      setCurrentNode(null);
      setCurrentResult(null);
      return;
    }

    try {
      const node = navigator.getCurrentNode();
      //console.log("Current node:", node);
      setCurrentNode(node);

      // Skip evaluator nodes and move directly to the next node
      if (node.type === "evaluator") {
        navigator.submitAnswer("");
        const nextNode = navigator.getCurrentNode();
        setCurrentNode(nextNode);

        if (nextNode.type === "result") {
          const resultKey = nextNode.resultKey;
          //console.log("Result node found:", resultKey);
          setCurrentResult(results[resultKey]);
        } else {
          setCurrentResult(null);
        }
      } else if (node.type === "result") {
        const resultKey = node.resultKey;
        //console.log("Result node found:", resultKey);
        setCurrentResult(results[resultKey]);
      } else {
        setCurrentResult(null);
      }
    } catch (error) {
      console.error("Error updating node and result:", error);
      setCurrentNode(null);
      setCurrentResult(null);
    }
  };

  // Function to start an algorithm
  const handleAlgorithmStart = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (algorithmId) {
      try {
        navigator.startAlgorithm(algorithmId, modeId || undefined);
        updateCurrentNodeAndResult();
        setSelectedAnswer("");
      } catch (error) {
        console.error("Error starting algorithm:", error);
      }
    }
  };

  // Function to submit an answer
  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    //console.log("Submitting answer:", selectedAnswer);

    try {
      navigator.submitAnswer(selectedAnswer);
      updateCurrentNodeAndResult();
      setSelectedAnswer("");
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  // Function to go back
  const handleGoBack = () => {
    try {
      if (navigator.canGoBack()) {
        navigator.goBack();
        updateCurrentNodeAndResult();
        setSelectedAnswer("");
      }
    } catch (error) {
      console.error("Error going back:", error);
    }
  };

  // Function to restart
  const handleRestart = () => {
    try {
      navigator.restart();
      updateCurrentNodeAndResult();
      setSelectedAnswer("");
    } catch (error) {
      console.error("Error restarting:", error);
    }
  };

  // Get available algorithms for selection
  const algorithmOptions = Object.values(algorithms).map((algo) => (
    <option key={algo.id} value={algo.id}>
      {algo.name}
    </option>
  ));

  // Get available modes for the selected algorithm
  const modeOptions = algorithmId && algorithms[algorithmId]?.modes ? 
  algorithms[algorithmId].modes.map(mode => (
    <option key={mode.id} value={mode.id}>{mode.name}</option>
  )) :
  [];
  // Safely get answers display
  const getAnswersDisplay = () => {
    try {
      return JSON.stringify(navigator.getAnswers() || {}, null, 2);
    } catch (error) {
      return "{}";
    }
  };

  // Safely check if we can go back
  const canGoBack = () => {
    try {
      return navigator.canGoBack();
    } catch (error) {
      return false;
    }
  };

  return (
    <>
      <Head>
        <title>Diastolic Assessment Navigator</title>
        <meta
          name="description"
          content="A Collection of Diastolic Function Algorithms for Echocardiographers"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 dark:bg-dark-800 dark:text-gray-100">
        <header className="border-b border-gray-200 bg-white shadow-sm dark:border-dark-600 dark:bg-dark-700">
          <div className="container mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold md:text-3xl">
            Diastolic Assessment Navigator
            </h1>
            <div className="flex items-center">
              <ThemeSwitcher />
            </div>
          </div>
        </header>

        <main className="flex-grow px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Select an algorithm and follow the prompts to evaluate diastolic
                function
              </p>
            </div>

            {/* Algorithm Selection Form */}
            <div className="mb-8 rounded-lg bg-white p-6 shadow-md dark:bg-dark-700">
              <form onSubmit={handleAlgorithmStart} className="space-y-6">
                <div className="flex flex-col space-y-6">
                  <div>
                    <label
                      htmlFor="algorithm-select"
                      className="mb-2 block font-medium"
                    >
                      Select Source
                    </label>
                    <select
                      id="algorithm-select"
                      value={algorithmId}
                      onChange={(e) => setAlgorithmId(e.target.value)}
                      required
                      className="form-select"
                    >
                      <option value="">--Select Source Article--</option>
                      {algorithmOptions}
                    </select>

                    {/* Display algorithm description */}
                    {algorithmId && algorithms[algorithmId].description && (
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        <p>{algorithms[algorithmId].description}</p>
                      </div>
                    )}
                  </div>

                  {modeOptions.length > 0 && (
                    <div>
                      <label
                        htmlFor="mode-select"
                        className="mb-2 block font-medium"
                      >
                        Select Algorithm
                      </label>
                      <select
                        id="mode-select"
                        value={modeId}
                        onChange={(e) => setModeId(e.target.value)}
                        className="form-select"
                      >
                        <option value="">--Select Algorithm--</option>
                        {modeOptions}
                      </select>
                      {/* Display mode description */}
                      {algorithmId &&
                        modeId &&
                        algorithms[algorithmId].modes &&
                        algorithms[algorithmId].modes.find(
                          (m) => m.id === modeId
                        )?.description && (
                          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                            <p>
                              {
                                algorithms[algorithmId].modes.find(
                                  (m) => m.id === modeId
                                )?.description
                              }
                            </p>
                          </div>
                        )}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full px-6 py-3 text-base md:w-auto"
                >
                  Start Assessment
                </button>
              </form>
            </div>

            {/* Question Panel */}
            {currentNode && currentNode.type === "decision" && (
              <div className="mb-8 rounded-lg bg-white p-6 shadow-md dark:bg-dark-700">
                <h2 className="mb-6">{currentNode.question}</h2>
                <select
                  value={selectedAnswer}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  required
                  className="form-select mb-6"
                >
                  <option value="">--Select an Option--</option>
                  {currentNode.options.map(
                    (option: { value: string; text: string }) => (
                      <option key={option.value} value={option.value}>
                        {option.text}
                      </option>
                    )
                  )}
                </select>

                <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!selectedAnswer}
                    className={`btn-primary min-w-[100px] px-6 py-3 text-base ${
                      !selectedAnswer ? "cursor-not-allowed opacity-50" : ""
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Next
                  </button>

                  {canGoBack() && (
                    <button
                      onClick={handleGoBack}
                      className="btn-secondary min-w-[100px] px-6 py-3 text-base"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2 h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Back
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Result Panel */}
            {currentNode && currentNode.type === "result" && currentResult && (
              <div
                className={`mb-8 rounded-lg p-6 shadow-md ${currentResult.class}`}
              >
                <h3 className="mb-4 text-gray-900 dark:text-white">
                  {currentResult.message}
                </h3>
                <p className="mb-6 text-gray-700 dark:text-gray-300">
                  {currentResult.description}
                </p>
                <button
                  onClick={handleRestart}
                  className="btn-secondary px-6 py-3 text-base"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Start Over
                </button>
              </div>
            )}

            {/* Citation Panel */}
            {algorithmId && (
              <div className="mb-8 overflow-hidden rounded-lg bg-white shadow-md dark:bg-dark-700">
                <details>
                  <summary className="px-6 py-3 font-medium hover:bg-gray-50 dark:hover:bg-dark-600">
                    Citation Information
                  </summary>
                  <div className="space-y-3 border-t border-gray-100 px-6 py-4 dark:border-dark-600">
                    <p className="font-bold">
                      {algorithms[algorithmId].citation.title}
                    </p>
                    <p>{algorithms[algorithmId].citation.authors}</p>
                    <p>{algorithms[algorithmId].citation.journal}</p>
                    <p>
                      <a
                        href={algorithms[algorithmId].citation.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline dark:text-primary-400"
                      >
                        View Publication
                      </a>
                    </p>
                  </div>
                </details>
              </div>
            )}

            {/* Debug Panel */}
            <div className="mt-12 rounded-lg border border-gray-200 dark:border-dark-600">
              <details>
                <summary className="px-6 py-3 font-medium hover:bg-gray-50 dark:hover:bg-dark-600">
                  Debug Information
                </summary>
                <div className="border-t border-gray-100 px-6 py-4 dark:border-dark-600">
                  <pre className="rounded-md bg-gray-100 p-4 text-xs text-gray-800 dark:bg-dark-600 dark:text-gray-200">
                    {`Current Algorithm: ${algorithmId || "None"}
Current Mode: ${modeId || "None"}
Current Node ID: ${currentNode?.id || "None"}
Node Type: ${currentNode?.type || "None"}
Result: ${currentResult ? currentResult.message : "None"}
Answers: ${getAnswersDisplay()}`}
                  </pre>
                </div>
              </details>
            </div>
          </div>
        </main>

        <footer className="mt-auto border-t border-gray-200 py-6 text-center text-sm text-gray-600 dark:border-dark-600 dark:text-gray-400">
          <div className="container mx-auto px-4">
            <p>Diastolic Assessment Navigator</p>
            <p>
              Dan Dyar, MA, ACS, RDCS, FASE &copy; {new Date().getFullYear()}
            </p>
            <p className="mt-2">
              <a 
                href="https://www.linkedin.com/in/dan-dyar-ma-acs-rdcs-ae-pe-fe-fase-6387b448/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                <svg 
                  className="mr-1 h-4 w-4" 
                  fill="currentColor" 
                  viewBox="0 0 24 24" 
                  aria-hidden="true"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                </svg>
                Connect on LinkedIn
              </a>
            </p>
          </div>
        </footer>      </div>
    </>
  );
}
