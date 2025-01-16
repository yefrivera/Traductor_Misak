document.addEventListener('DOMContentLoaded', function() {
  const translateForm = document.getElementById('translateForm');
  if (translateForm) {
    translateForm.addEventListener('submit', async function(event) {
      event.preventDefault();

      const language = document.getElementById('language').value;
      const word = document.getElementById('word').value;

      try {
          const response = await fetch('/traducir', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ language, word })
          });

          if (!response.ok) {
              throw new Error('Network response was not ok');
          }

          const result = await response.json();

          const resultDiv = document.getElementById('result');
          if (result.traduccion) {
              resultDiv.textContent = `La traducción de "${word}" es "${result.traduccion}".`;
          } else {
              resultDiv.textContent = result.error;
          }
      } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
          document.getElementById('result').textContent = 'Error en la solicitud: ' + error.message;
      }
    });
  } else {
    console.error('El formulario de traducción no se encontró en el DOM.');
  }
});
