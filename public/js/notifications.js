class NotificationManager {
    constructor() {
        this.container = this.createContainer();
        this.notifications = new Map();
        this.counter = 0;
    }

    createContainer() {
        // Verificar si ya existe un contenedor
        let container = document.querySelector('.notification-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        return container;
    }

    show(message, type = 'error', duration = 5000) {
        const id = this.counter++;
        const notification = this.createNotification(message, type, id);
        
        this.container.appendChild(notification);
        this.notifications.set(id, notification);

        // Configurar el auto-ocultamiento
        setTimeout(() => {
            this.hide(id);
        }, duration);

        return id;
    }

    createNotification(message, type, id) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.dataset.id = id;

        notification.innerHTML = `
            <div class="notification-content">
                ${message}
            </div>
            <div class="notification-progress">
                <div class="notification-progress-bar"></div>
            </div>
        `;

        // Agregar evento para ocultar al hacer clic
        notification.addEventListener('click', () => {
            this.hide(id);
        });

        return notification;
    }

    hide(id) {
        const notification = this.notifications.get(id);
        if (!notification) return;

        // Animar la salida
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        
        // Remover del DOM después de la animación
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
                this.notifications.delete(id);
            }
        }, 300);
    }

    // Métodos de conveniencia para diferentes tipos de notificaciones
    error(message, duration = 5000) {
        return this.show(message, 'error', duration);
    }

    success(message, duration = 5000) {
        return this.show(message, 'success', duration);
    }

    warning(message, duration = 5000) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration = 5000) {
        return this.show(message, 'info', duration);
    }
}

// Crear una instancia global
const notifications = new NotificationManager();