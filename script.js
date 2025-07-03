// Configuración global
const CONFIG = {
    adminPassword: '955838788', // Cambia esta contraseña
    storageKey: 'shoeStoreData'
};

// Estado global de la aplicación
let state = {
    isAdminLoggedIn: false,
    shoes: [],
    editingShoeId: null
};

// Elementos del DOM
const elements = {
    adminBtn: document.getElementById('admin-btn'),
    adminLogin: document.getElementById('admin-login'),
    adminPanel: document.getElementById('admin-panel'),
    adminPassword: document.getElementById('admin-password'),
    loginBtn: document.getElementById('login-btn'),
    cancelLogin: document.getElementById('cancel-login'),
    logoutBtn: document.getElementById('logout-btn'),
    addShoeBtn: document.getElementById('add-shoe-btn'),
    shoeForm: document.getElementById('shoe-form'),
    shoeDataForm: document.getElementById('shoe-data-form'),
    formTitle: document.getElementById('form-title'),
    shoesGallery: document.getElementById('shoes-gallery'),
    noShoesMessage: document.getElementById('no-shoes-message'),
    shoeModal: document.getElementById('shoe-modal'),
    closeModal: document.querySelector('.close-modal'),
    overlay: document.getElementById('overlay'),
    modalAdminActions: document.getElementById('modal-admin-actions'),
    editShoeBtn: document.getElementById('edit-shoe-btn'),
    deleteShoeBtn: document.getElementById('delete-shoe-btn'),
    cancelFormBtn: document.getElementById('cancel-form-btn'),
    saveShoeBtn: document.getElementById('save-shoe-btn'),
    shoeImage: document.getElementById('shoe-image'),
    imagePreview: document.getElementById('image-preview')
};

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadDataFromStorage();
    setupEventListeners();
    renderShoes();
    updateUIState();
}

// Configurar event listeners
function setupEventListeners() {
    // Botones de administrador
    elements.adminBtn.addEventListener('click', showAdminLogin);
    elements.loginBtn.addEventListener('click', handleAdminLogin);
    elements.cancelLogin.addEventListener('click', hideAdminLogin);
    elements.logoutBtn.addEventListener('click', handleLogout);
    elements.addShoeBtn.addEventListener('click', showAddShoeForm);

    // Formulario de zapatos
    elements.shoeDataForm.addEventListener('submit', handleShoeSubmit);
    elements.cancelFormBtn.addEventListener('click', hideShoeForm);
    elements.shoeImage.addEventListener('change', handleImagePreview);

    // Modal
    elements.closeModal.addEventListener('click', hideModal);
    elements.editShoeBtn.addEventListener('click', handleEditShoe);
    elements.deleteShoeBtn.addEventListener('click', handleDeleteShoe);

    // Cerrar modales con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideModal();
            hideAdminLogin();
            hideShoeForm();
        }
    });

    // Cerrar modales haciendo click fuera
    elements.adminLogin.addEventListener('click', function(e) {
        if (e.target === elements.adminLogin) {
            hideAdminLogin();
        }
    });

    elements.shoeForm.addEventListener('click', function(e) {
        if (e.target === elements.shoeForm) {
            hideShoeForm();
        }
    });

    elements.shoeModal.addEventListener('click', function(e) {
        if (e.target === elements.shoeModal) {
            hideModal();
        }
    });

    // Login con Enter
    elements.adminPassword.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleAdminLogin();
        }
    });
}

// Funciones de almacenamiento
function saveDataToStorage() {
    const data = {
        shoes: state.shoes,
        timestamp: new Date().toISOString()
    };
    try {
        localStorage.setItem(CONFIG.storageKey, JSON.stringify(data));
        console.log('Datos guardados correctamente');
    } catch (error) {
        console.error('Error al guardar datos:', error);
        showNotification('Error al guardar los datos', 'error');
    }
}

function loadDataFromStorage() {
    try {
        const storedData = localStorage.getItem(CONFIG.storageKey);
        if (storedData) {
            const data = JSON.parse(storedData);
            if (data && data.shoes) {
                state.shoes = data.shoes;
                console.log('Datos cargados correctamente');
                return;
            }
        }
    } catch (error) {
        console.error('Error al cargar datos:', error);
    }
    
    // Si no hay datos guardados o hay error, usar datos de ejemplo
    console.log('Cargando datos de ejemplo');
    state.shoes = [
            {
                id: 1,
                name: "Zapatos Deportivos Premium",
                price: 150.00,
                description: "Zapatos deportivos de alta calidad con tecnología de amortiguación avanzada. Perfectos para correr y actividades deportivas.",
                sizes: "38, 39, 40, 41, 42, 43",
                contact: "WhatsApp: +51 999 888 777\nEmail: ventas@zapatospremium.com\nHorario: Lunes a Sábado 9am-6pm",
                image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjBmMGYwIi8+CjxwYXRoIGQ9Ik01MCA4MEM1MCA2MCA4MCA0MCA5MCA0MEM5MCA0MCAyMDAgNDAgMjUwIDUwQzI1MCA1MCAyODAgNjAgMjgwIDkwQzI4MCA5MCAyODAgMTIwIDI2MCAxMzBDMjYwIDEzMCAyMDAgMTQwIDkwIDE0MEM5MCAxNDAgNTAgMTMwIDUwIDEwMEM1MCAxMDAgNTAgOTAgNTAgODBaIiBmaWxsPSIjMzQ5OGRiIi8+CjxyZWN0IHg9IjEyMCIgeT0iNzAiIHdpZHRoPSI2MCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZiIvPgo8dGV4dCB4PSIxNTAiIHk9IjE3MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5aYXBhdG8gRGVwb3J0aXZvPC90ZXh0Pgo8L3N2Zz4K"
            },
            {
                id: 2,
                name: "Zapatos Formales Elegantes",
                price: 200.00,
                description: "Zapatos formales de cuero genuino, perfectos para ocasiones especiales y uso profesional. Diseño clásico y elegante.",
                sizes: "39, 40, 41, 42, 43, 44",
                contact: "WhatsApp: +51 999 888 777\nEmail: ventas@zapatospremium.com\nHorario: Lunes a Sábado 9am-6pm",
                image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjBmMGYwIi8+CjxwYXRoIGQ9Ik01MCA4MEM1MCA2MCA4MCA0MCA5MCA0MEM5MCA0MCAyMDAgNDAgMjUwIDUwQzI1MCA1MCAyODAgNjAgMjgwIDkwQzI4MCA5MCAyODAgMTIwIDI2MCAxMzBDMjYwIDEzMCAyMDAgMTQwIDkwIDE0MEM5MCAxNDAgNTAgMTMwIDUwIDEwMEM1MCAxMDAgNTAgOTAgNTAgODBaIiBmaWxsPSIjMmMzZTUwIi8+CjxyZWN0IHg9IjEwMCIgeT0iNjAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMzAiIGZpbGw9IiMyYzNlNTAiLz4KPHR5cGUgeD0iMTUwIiB5PSIxNzAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+WmFwYXRvIEZvcm1hbDwvdGV4dD4KPC9zdmc+Cg=="
            }
        ];
}

// Funciones de autenticación
function showAdminLogin() {
    elements.adminLogin.classList.remove('hidden');
    elements.adminPassword.focus();
}

function hideAdminLogin() {
    elements.adminLogin.classList.add('hidden');
    elements.adminPassword.value = '';
}

function handleAdminLogin() {
    const password = elements.adminPassword.value;
    if (password === CONFIG.adminPassword) {
        state.isAdminLoggedIn = true;
        hideAdminLogin();
        updateUIState();
        showNotification('Acceso administrativo activado', 'success');
    } else {
        showNotification('Contraseña incorrecta', 'error');
        elements.adminPassword.value = '';
    }
}

function handleLogout() {
    state.isAdminLoggedIn = false;
    hideShoeForm();
    hideModal();
    updateUIState();
    showNotification('Sesión administrativa cerrada', 'info');
}

// Funciones de UI
function updateUIState() {
    if (state.isAdminLoggedIn) {
        elements.adminPanel.classList.remove('hidden');
        elements.modalAdminActions.classList.remove('hidden');
        elements.adminBtn.textContent = 'Administrando';
        elements.adminBtn.style.backgroundColor = '#27ae60';
    } else {
        elements.adminPanel.classList.add('hidden');
        elements.modalAdminActions.classList.add('hidden');
        elements.adminBtn.textContent = 'Admin';
        elements.adminBtn.style.backgroundColor = '#e74c3c';
    }
}

// Funciones del formulario de zapatos
function showAddShoeForm() {
    state.editingShoeId = null;
    elements.formTitle.textContent = 'Agregar Nuevo Zapato';
    elements.shoeDataForm.reset();
    elements.imagePreview.innerHTML = '';
    elements.shoeForm.classList.remove('hidden');
    document.getElementById('shoe-name').focus();
}

function showEditShoeForm(shoe) {
    state.editingShoeId = shoe.id;
    elements.formTitle.textContent = 'Editar Zapato';
    
    // Llenar el formulario con los datos del zapato
    document.getElementById('shoe-name').value = shoe.name;
    document.getElementById('shoe-price').value = shoe.price;
    document.getElementById('shoe-description').value = shoe.description;
    document.getElementById('shoe-sizes').value = shoe.sizes;
    document.getElementById('shoe-contact').value = shoe.contact;
    
    // Mostrar imagen actual
    if (shoe.image) {
        elements.imagePreview.innerHTML = `<img src="${shoe.image}" alt="Imagen actual">`;
    }
    
    elements.shoeForm.classList.remove('hidden');
    hideModal();
}

function hideShoeForm() {
    elements.shoeForm.classList.add('hidden');
    elements.shoeDataForm.reset();
    elements.imagePreview.innerHTML = '';
    state.editingShoeId = null;
}

function handleImagePreview(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            elements.imagePreview.innerHTML = `<img src="${e.target.result}" alt="Vista previa">`;
        };
        reader.readAsDataURL(file);
    }
}

function handleShoeSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(elements.shoeDataForm);
    const shoeData = {
        name: document.getElementById('shoe-name').value,
        price: parseFloat(document.getElementById('shoe-price').value),
        description: document.getElementById('shoe-description').value,
        sizes: document.getElementById('shoe-sizes').value,
        contact: document.getElementById('shoe-contact').value
    };
    
    // Validar datos
    if (!shoeData.name || !shoeData.price || !shoeData.description) {
        showNotification('Por favor completa todos los campos obligatorios', 'error');
        return;
    }
    
    // Manejar imagen
    const imageFile = elements.shoeImage.files[0];
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            shoeData.image = e.target.result;
            saveShoe(shoeData);
        };
        reader.readAsDataURL(imageFile);
    } else if (state.editingShoeId) {
        // Si estamos editando y no hay nueva imagen, mantener la actual
        const existingShoe = state.shoes.find(shoe => shoe.id === state.editingShoeId);
        shoeData.image = existingShoe.image;
        saveShoe(shoeData);
    } else {
        // Imagen por defecto para zapatos sin imagen
        shoeData.image = generateDefaultImage(shoeData.name);
        saveShoe(shoeData);
    }
}

function saveShoe(shoeData) {
    if (state.editingShoeId) {
        // Editar zapato existente
        const index = state.shoes.findIndex(shoe => shoe.id === state.editingShoeId);
        if (index !== -1) {
            state.shoes[index] = { ...state.shoes[index], ...shoeData };
            showNotification('Zapato actualizado correctamente', 'success');
        }
    } else {
        // Agregar nuevo zapato
        const newShoe = {
            id: Date.now(),
            ...shoeData
        };
        state.shoes.push(newShoe);
        showNotification('Zapato agregado correctamente', 'success');
    }
    
    saveDataToStorage();
    renderShoes();
    hideShoeForm();
}

// Funciones de visualización
function renderShoes() {
    elements.shoesGallery.innerHTML = '';
    
    if (state.shoes.length === 0) {
        elements.noShoesMessage.classList.remove('hidden');
        return;
    }
    
    elements.noShoesMessage.classList.add('hidden');
    
    state.shoes.forEach(shoe => {
        const shoeCard = createShoeCard(shoe);
        elements.shoesGallery.appendChild(shoeCard);
    });
}

function createShoeCard(shoe) {
    const card = document.createElement('div');
    card.className = 'shoe-card';
    card.addEventListener('click', () => showShoeModal(shoe));
    
    card.innerHTML = `
        <img src="${shoe.image}" alt="${shoe.name}" class="shoe-image">
        <div class="shoe-info">
            <h3 class="shoe-name">${shoe.name}</h3>
            <p class="shoe-price">S/ ${shoe.price.toFixed(2)}</p>
            <p class="shoe-description">${shoe.description}</p>
        </div>
    `;
    
    return card;
}

function showShoeModal(shoe) {
    document.getElementById('modal-shoe-image').src = shoe.image;
    document.getElementById('modal-shoe-name').textContent = shoe.name;
    document.getElementById('modal-shoe-price').textContent = `S/ ${shoe.price.toFixed(2)}`;
    document.getElementById('modal-shoe-description').textContent = shoe.description;
    document.getElementById('modal-shoe-sizes').textContent = shoe.sizes;
    document.getElementById('modal-shoe-contact').textContent = shoe.contact;
    
    // Configurar botones de administrador
    elements.editShoeBtn.onclick = () => showEditShoeForm(shoe);
    elements.deleteShoeBtn.onclick = () => confirmDeleteShoe(shoe);
    
    elements.shoeModal.classList.remove('hidden');
}

function hideModal() {
    elements.shoeModal.classList.add('hidden');
}

function handleEditShoe() {
    const shoeName = document.getElementById('modal-shoe-name').textContent;
    const shoe = state.shoes.find(s => s.name === shoeName);
    if (shoe) {
        showEditShoeForm(shoe);
    }
}

function handleDeleteShoe() {
    const shoeName = document.getElementById('modal-shoe-name').textContent;
    const shoe = state.shoes.find(s => s.name === shoeName);
    if (shoe) {
        confirmDeleteShoe(shoe);
    }
}

function confirmDeleteShoe(shoe) {
    if (confirm(`¿Estás seguro de que deseas eliminar "${shoe.name}"?`)) {
        state.shoes = state.shoes.filter(s => s.id !== shoe.id);
        saveDataToStorage();
        renderShoes();
        hideModal();
        showNotification('Zapato eliminado correctamente', 'success');
    }
}

// Funciones de utilidad
function generateDefaultImage(shoeName) {
    // Generar una imagen SVG simple como placeholder
    const svg = `
        <svg width="300" height="200" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="200" fill="#f0f0f0"/>
            <path d="M50 80C50 60 80 40 90 40C90 40 200 40 250 50C250 50 280 60 280 90C280 90 280 120 260 130C260 130 200 140 90 140C90 140 50 130 50 100C50 100 50 90 50 80Z" fill="#95a5a6"/>
            <text x="150" y="170" font-family="Arial" font-size="14" fill="#666" text-anchor="middle">Sin imagen</text>
        </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}

function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos CSS inline para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Colores según el tipo
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#27ae60';
            break;
        case 'error':
            notification.style.backgroundColor = '#e74c3c';
            break;
        case 'info':
            notification.style.backgroundColor = '#3498db';
            break;
        default:
            notification.style.backgroundColor = '#95a5a6';
    }
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Funciones de manejo de errores
window.addEventListener('error', function(e) {
    console.error('Error en la aplicación:', e.error);
    showNotification('Ha ocurrido un error en la aplicación', 'error');
});

// Prevenir que se cierre la página sin guardar si hay cambios
window.addEventListener('beforeunload', function(e) {
    if (state.isAdminLoggedIn && !elements.shoeForm.classList.contains('hidden')) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Función para limpiar datos (útil para testing)
function clearAllData() {
    if (confirm('¿Estás seguro de que deseas eliminar TODOS los datos? Esta acción no se puede deshacer.')) {
        localStorage.removeItem(CONFIG.storageKey);
        state.shoes = [];
        renderShoes();
        showNotification('Todos los datos han sido eliminados', 'info');
    }
}

// Función para exportar datos (útil para respaldo)
function exportData() {
    const data = {
        shoes: state.shoes,
        timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zapatos_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Datos exportados correctamente', 'success');
}

// Función para importar datos
function importData(jsonData) {
    try {
        const data = JSON.parse(jsonData);
        if (data.shoes && Array.isArray(data.shoes)) {
            state.shoes = data.shoes;
            saveDataToStorage();
            renderShoes();
            showNotification('Datos importados correctamente', 'success');
        } else {
            throw new Error('Formato de datos inválido');
        }
    } catch (error) {
        showNotification('Error al importar datos', 'error');
        console.error('Error importing data:', error);
    }
}

// Exponer funciones útiles globalmente para debugging
window.shoeStoreDebug = {
    exportData,
    importData,
    clearAllData,
    state,
    CONFIG,
    // Función para ver datos almacenados
    viewStoredData: () => {
        const data = localStorage.getItem(CONFIG.storageKey);
        console.log('Datos almacenados:', data ? JSON.parse(data) : 'No hay datos');
        return data ? JSON.parse(data) : null;
    }
};