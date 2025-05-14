document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const messageDiv = document.getElementById('message');
    
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Obtener los valores del formulario
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Validación básica
        if (!username || !email || !password) {
            showMessage('Por favor, completa todos los campos', 'error');
            return;
        }
        
        if (password.length < 6) {
            showMessage('La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }
        
        try {
            // Enviar solicitud al servidor
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showMessage('¡Registro exitoso! Redirigiendo al inicio de sesión...', 'success');
                
                // Redireccionar a la página de inicio de sesión después de 2 segundos
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                showMessage(data.message || 'Error en el registro', 'error');
            }
        } catch (error) {
            showMessage('Error de conexión. Inténtalo de nuevo más tarde.', 'error');
            console.error('Error:', error);
        }
    });
    
    // Función para mostrar mensajes
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
    }
});