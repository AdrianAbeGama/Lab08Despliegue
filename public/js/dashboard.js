document.addEventListener('DOMContentLoaded', () => {
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem('accessToken');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    // Elementos del DOM
    const userInfoDiv = document.getElementById('userInfo');
    const publicContentDiv = document.getElementById('publicContent').querySelector('.content-box');
    const userContentDiv = document.getElementById('userContent').querySelector('.content-box');
    const modContentDiv = document.getElementById('modContent').querySelector('.content-box');
    const adminContentDiv = document.getElementById('adminContent').querySelector('.content-box');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Mostrar información del usuario
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        userInfoDiv.innerHTML = `
            <p><strong>ID:</strong> ${user.id}</p>
            <p><strong>Nombre de usuario:</strong> ${user.username}</p>
            <p><strong>Correo electrónico:</strong> ${user.email}</p>
            <p><strong>Roles:</strong> ${user.roles.join(', ')}</p>
        `;
    }
    
    // Función para realizar solicitudes autenticadas
    async function fetchAuthenticatedContent(url) {
        try {
            const response = await fetch(url, {
                headers: {
                    'x-access-token': token
                }
            });
            
            if (response.status === 401) {
                // Token inválido o expirado
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                window.location.href = 'login.html';
                return null;
            }
            
            return await response.text();
        } catch (error) {
            console.error('Error:', error);
            return 'Error al cargar el contenido';
        }
    }
    
    // Cargar contenido público
    fetchAuthenticatedContent('/api/test/all')
        .then(content => {
            if (content) {
                publicContentDiv.innerHTML = `<p>${content}</p>`;
            }
        });
    
    // Cargar contenido de usuario
    fetchAuthenticatedContent('/api/test/user')
        .then(content => {
            if (content) {
                userContentDiv.innerHTML = `<p>${content}</p>`;
            }
        });
    
    // Cargar contenido de moderador
    fetchAuthenticatedContent('/api/test/mod')
        .then(content => {
            if (content) {
                modContentDiv.innerHTML = `<p>${content}</p>`;
            } else {
                modContentDiv.innerHTML = `<p>No tienes acceso a este contenido</p>`;
            }
        })
        .catch(() => {
            modContentDiv.innerHTML = `<p>No tienes acceso a este contenido</p>`;
        });
    
    // Cargar contenido de administrador
    fetchAuthenticatedContent('/api/test/admin')
        .then(content => {
            if (content) {
                adminContentDiv.innerHTML = `<p>${content}</p>`;
            } else {
                adminContentDiv.innerHTML = `<p>No tienes acceso a este contenido</p>`;
            }
        })
        .catch(() => {
            adminContentDiv.innerHTML = `<p>No tienes acceso a este contenido</p>`;
        });
    
    // Manejar cierre de sesión
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });
});