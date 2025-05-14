document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');
    
    // Verificar si el usuario ya está autenticado
    const token = localStorage.getItem('accessToken');
    if (token) {
        window.location.href = 'dashboard.html';
    }
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Obtener los valores del formulario
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Validación básica
        if (!username || !password) {
            showMessage('Por favor, completa todos los campos', 'error');
            return;
        }
        
        try {
            // Enviar solicitud al servidor
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Guardar el token y la información del usuario en localStorage
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('user', JSON.stringify({
                    id: data.id,
                    username: data.username,
                    email: data.email,
                    roles: data.roles
                }));
                
                showMessage('¡Inicio de sesión exitoso! Redirigiendo...', 'success');
                
                // Redireccionar al dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                showMessage(data.message || 'Credenciales inválidas', 'error');
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