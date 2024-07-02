const API_URL = 'http://localhost:4000/api';

export const fetchQuestions = async () => {
  try {
    const response = await fetch(`${API_URL}/preguntas`);
    if (!response.ok) {
      throw new Error('Error al obtener las preguntas.');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error; 
  }
};

export const validarRespuesta = async (preguntaId, respuestaIndex) => {
  try {
    const response = await fetch(`${API_URL}/validaRespuesta`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        preguntaId,
        respuestaIndex
      })
    });

    if (!response.ok) {
      throw new Error('Error al validar la respuesta.');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error; 
  }
};
