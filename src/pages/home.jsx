import { useState, useEffect } from "react";
import SparklingStars from "../components/SparklingStars";
import "../pages/style.css";
import { fetchQuestions, validarRespuesta } from "../api/api";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [questionsModalOpen, setQuestionsModalOpen] = useState(false);
  const [resultsModalOpen, setResultsModalOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [answerFeedback, setAnswerFeedback] = useState([]);
  const [validationMessage, setValidationMessage] = useState("");
  const [timer, setTimer] = useState(15);
  const [timerRunning, setTimerRunning] = useState(false);
  const [scoreMessage, setScoreMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (timerRunning && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      handleTimeOut();
    }
  }, [timer, timerRunning]);

  const fetchData = async () => {
    try {
      const data = await fetchQuestions();
      setQuestions(data);
      initializeAnswerFeedback(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const initializeAnswerFeedback = (questionsData) => {
    const initialFeedback = questionsData.map(() => ({ correct: null }));
    setAnswerFeedback(initialFeedback);
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const openRulesModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setQuestionsModalOpen(false);
    setResultsModalOpen(false);
    resetState(); // Reiniciar estado al cerrar el modal
  };

  const openQuestionsModal = () => {
    setIsOpen(false);
    setQuestionsModalOpen(true);
    setCurrentQuestionIndex(0); // Empezar mostrando la primera pregunta
    startTimer();
  };

  const closeQuestionsModal = () => {
    setQuestionsModalOpen(false);
    setResultsModalOpen(true);
    calculateScoreMessage();
  };

  const handleAnswerSelection = (answer) => {
    if (timerRunning && selectedAnswer === "") {
      setSelectedAnswer(answer);
      stopTimer();
      handleValidation(answer);
    }
  };

  const handleValidation = async (selectedAnswer) => {
    try {
      const { esCorrecta, mensaje } = await validarRespuesta(
        questions[currentQuestionIndex].id,
        questions[currentQuestionIndex].respuestas.indexOf(selectedAnswer)
      );

      setValidationMessage(mensaje);

      const updatedFeedback = [...answerFeedback];
      updatedFeedback[currentQuestionIndex] = {
        correct: esCorrecta,
        selected: selectedAnswer,
      };
      setAnswerFeedback(updatedFeedback);

      if (esCorrecta) {
        setCorrectAnswersCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const nextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(""); 
      setValidationMessage(""); 
      startTimer();
    } else {
      closeQuestionsModal(); 
    }
  };

  const handleFinish = async () => {
    try {
      closeModal();
      setValidationMessage(""); // Limpiar mensaje de validación
      const data = await fetchQuestions();
      setQuestions(data); 
      setCurrentQuestionIndex(0); 
      setSelectedAnswer(""); 
      setCorrectAnswersCount(0); 
      initializeAnswerFeedback(data); // Reiniciar retroalimentación de respuestas
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleRepeat = async () => {
    try {
      resetState();
      const data = await fetchQuestions();
      setQuestions(data); // Actualizar preguntas con nuevas preguntas aleatorias
      initializeAnswerFeedback(data); // Reiniciar retroalimentación de respuestas
      setQuestionsModalOpen(true); // Abrir el modal de preguntas
      setResultsModalOpen(false); // Cerrar el modal de resultados
      setCurrentQuestionIndex(0); // Reiniciar índice de pregunta actual
      startTimer(); // Empezar el temporizador
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const resetState = () => {
    setSelectedAnswer("");
    setCurrentQuestionIndex(0);
    setCorrectAnswersCount(0);
    setAnswerFeedback([]);
    setValidationMessage("");
    setTimer(15);
    setTimerRunning(false);
    setScoreMessage("");
  };

  const startTimer = () => {
    setTimer(15);
    setTimerRunning(true);
  };

  const stopTimer = () => {
    setTimerRunning(false);
  };

  const handleTimeOut = () => {
    stopTimer();
    nextQuestion(); 
    const updatedFeedback = [...answerFeedback];
    updatedFeedback[currentQuestionIndex] = {
      correct: false,
      selected: selectedAnswer,
    };
    setAnswerFeedback(updatedFeedback);
    setValidationMessage("¡Tiempo agotado!");
  };

  const calculateScoreMessage = () => {
    let message = "";
    if (correctAnswersCount == 10) {
      message = "FELICITACIONES CONSEGUISTE 5 DE 5 🥳🎉";
    } else if (correctAnswersCount >= 8) {
      message = "FELICITACIONES CONSEGUISTE 4 DE 5 🎉";
    } else if (correctAnswersCount >= 5 && correctAnswersCount <= 7) {
      message = "QUE BIEN CONSEGUISTE 3 DE 5 😎";
    } else if (correctAnswersCount >= 1 && correctAnswersCount <= 4) {
      message = "HAY QUE ESTUDIAR, CONSEGUISTE 2 DE 5 📚";
    } else if (correctAnswersCount === 0) {
      message = "LO SIENTO, CONSEGUISTE 0 DE 5 😢";
    }
    setScoreMessage(message);
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-custom-image bg-cover bg-center">
        <SparklingStars />
        <button
          type="button"
          onClick={openRulesModal}
          className="text-white shadow-2xl shadow-slate-100 bg-gradient-to-r from-purple-600 to-pink-400 hover:bg-gradient-to-l focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-semibold rounded-lg text-xl px-6 py-3.5 text-center me-2 mb-2"
        >
          Iniciar examen
        </button>
      </div>

      {/* Modal de Reglas */}
      {isOpen && (
        <div
          id="rules-modal"
          className="fixed inset-0 z-50 flex items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto bg-black bg-opacity-50 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative w-full max-w-lg max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  Reglas de tu examen en línea
                </h3>
              </div>
              <div className="p-4 md:p-5 space-y-4 text-justify font-medium text-black dark:text-black">
                <p className="text-base leading-relaxed">
                  1. Solo tendrás{" "}
                  <span className="text-red-800 font-bold">15 Segundos</span>{" "}
                  para responder cada pregunta.
                </p>
                <p className="text-base leading-relaxed">
                  2. Una vez que seleccionas tu respuesta, no se puede deshacer.
                </p>
                <p className="text-base leading-relaxed">
                  3. No puedes seleccionar ninguna opción una vez que se acaba
                  el tiempo.
                </p>
                <p className="text-base leading-relaxed">
                  4. No puedes salir del Quiz mientras está corriendo el tiempo.
                </p>
                <p className="text-base leading-relaxed">
                  5. Obtendrás puntos con base en tus respuestas correctas.
                </p>
              </div>
              <div className="text-right p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                >
                  Regresar
                </button>
                <button
                  type="button"
                  onClick={openQuestionsModal}
                  className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                >
                  Iniciar Examen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Preguntas */}
      {questionsModalOpen && (
        <div
          id="questions-modal"
          className="fixed inset-0 z-50 flex items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto bg-black bg-opacity-50 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative w-full max-w-lg max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  Pregunta {currentQuestionIndex + 1} de 10
                </h3>
                {timerRunning && (
                  <p className=" mr-1 text-red-600 font-bold text-lg">
                    ⏱️: <span>{timer} s</span>
                  </p>
                )}
              </div>
              <div className="p-4 md:p-5 space-y-4">
                {questions.length > 0 && (
                  <div>
                    <p className="text-base leading-relaxed text-gray-900 dark:text-white font-bold">
                      {questions[currentQuestionIndex].pregunta}
                    </p>
                    <div className="space-y-2 mt-2">
                      {questions[currentQuestionIndex].respuestas.map(
                        (answer, answerIndex) => (
                          <label
                            key={answerIndex}
                            className="flex items-center text-base leading-relaxed cursor-pointer"
                          >
                            <input
                              type="radio"
                              name={`answer${currentQuestionIndex}`}
                              value={answer}
                              checked={selectedAnswer === answer}
                              onChange={() => handleAnswerSelection(answer)}
                              className="form-radio h-5 w-5 text-blue-600"
                              disabled={selectedAnswer !== "" || !timerRunning}
                            />
                            <span
                              className={`ml-2 ${
                                answerFeedback[currentQuestionIndex]
                                  ?.correct === false &&
                                selectedAnswer === answer
                                  ? "text-red-600 font-bold"
                                  : answerFeedback[currentQuestionIndex]
                                      ?.correct === false &&
                                    answer ===
                                      questions[currentQuestionIndex]
                                        .respuestas[
                                        questions[currentQuestionIndex]
                                          .respuestaCorrecta
                                      ]
                                  ? "text-green-600 font-bold"
                                  : answerFeedback[currentQuestionIndex]
                                      ?.correct === true &&
                                    selectedAnswer === answer
                                  ? "text-green-600 font-bold"
                                  : ""
                              }`}
                            >
                              {answer}
                              {answerFeedback[currentQuestionIndex]?.correct ===
                                false &&
                                selectedAnswer === answer && (
                                  <span className="ml-2 text-red-600">
                                    &#10060;
                                  </span>
                                )}
                              {answerFeedback[currentQuestionIndex]?.correct ===
                                false &&
                                answer ===
                                  questions[currentQuestionIndex].respuestas[
                                    questions[currentQuestionIndex]
                                      .respuestaCorrecta
                                  ] && (
                                  <span className="ml-2 text-green-600">
                                    &#10004;
                                  </span>
                                )}
                              {answerFeedback[currentQuestionIndex]?.correct ===
                                true &&
                                selectedAnswer === answer && (
                                  <span className="ml-2 text-green-600">
                                    &#10004;
                                  </span>
                                )}
                            </span>
                          </label>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  type="button"
                  onClick={nextQuestion}
                  className={`text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ${
                    selectedAnswer === "" && timerRunning
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={selectedAnswer === "" && timerRunning}
                >
                  Siguiente Pregunta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Resultados */}
      {resultsModalOpen && (
        <div
          id="results-modal"
          className="fixed inset-0 z-50 flex items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto bg-black bg-opacity-50 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative w-full max-w-lg max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  Resultados del Examen
                </h3>
              </div>
              <div className="p-4 md:p-5 space-y-4 text-center">
                <p className="text-base leading-relaxed">{scoreMessage}</p>
              </div>
              <div className="text-right p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  type="button"
                  onClick={handleRepeat}
                  class="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                >
                  Repetir
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                >
                  Salir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
