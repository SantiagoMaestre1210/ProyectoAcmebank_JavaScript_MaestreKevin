// Clase principal para manejar la aplicación bancaria
class BankApp {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
        this.transactions = this.loadTransactions();
    }

    // Inicializar la aplicación
    init() {
        this.setupEventListeners();
        this.populateYearOptions();
        this.updateCurrentDate();
        this.showPage('landing');
    }

    // Configurar todos los event listeners
    setupEventListeners() {
        // Navegación entre páginas
        document.getElementById('register-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.showPage('register');
        });

        document.getElementById('forgot-password-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.showPage('forgot-password');
        });

        document.getElementById('cancel-register').addEventListener('click', () => {
            this.showPage('login');
        });

        document.getElementById('cancel-forgot').addEventListener('click', () => {
            this.showPage('login');
        });

        // Evento para ir al login desde el mensaje de registro exitoso
        document.addEventListener('click', (e) => {
            if (e.target.id === 'go-to-login') {
                this.hideElement('registration-success');
                this.showPage('login');
            }
        });

        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });

        document.getElementById('go-to-landing').addEventListener('click', () => {
            this.goToLanding();
        });

        // Formularios
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        document.getElementById('forgot-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleForgotPassword();
        });

        document.getElementById('new-password-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleNewPassword();
        });

        // Operaciones bancarias
        document.getElementById('consignacion-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleConsignacion();
        });

        document.getElementById('retiro-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRetiro();
        });

        document.getElementById('servicios-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleServicios();
        });

        document.getElementById('extracto-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleExtracto();
        });

        // Navegación del dashboard
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.getAttribute('data-section');
                this.showDashboardSection(section);
            });
        });

        // Botones de impresión
        document.getElementById('print-transactions').addEventListener('click', () => {
            this.printTransactions();
        });

        document.getElementById('print-certificate').addEventListener('click', () => {
            this.printCertificate();
        });

        // Botones de cerrar mensajes
        document.getElementById('close-success').addEventListener('click', () => {
            this.hideElement('success-message');
        });

        // Botón de cambio de tema
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Botones de la landing page
        document.getElementById('go-to-login').addEventListener('click', () => {
            this.showPage('login');
        });
        
        document.getElementById('hero-login').addEventListener('click', () => {
            this.showPage('login');
        });
        
        document.getElementById('hero-register').addEventListener('click', () => {
            this.showPage('register');
        });
        
        document.getElementById('cta-login').addEventListener('click', () => {
            this.showPage('login');
        });
        
        document.getElementById('cta-register').addEventListener('click', () => {
            this.showPage('register');
        });

        // Botón de tema en landing page
        document.getElementById('landing-theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        document.getElementById('login-to-landing').addEventListener('click', () => {
            this.showPage('landing');
        });

        document.getElementById('register-to-landing').addEventListener('click', () => {
            this.showPage('landing');
        });

        document.getElementById('forgot-to-landing').addEventListener('click', () => {
            this.showPage('landing');
        });

        // Validación en tiempo real
        this.setupRealTimeValidation();
    }

    // Configurar validación en tiempo real
    setupRealTimeValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                input.addEventListener('input', () => {
                    this.clearFieldError(input);
                });
            });
        });
    }

    // Validar campo individual
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;

        // Validación básica de campo requerido
        if (field.hasAttribute('required') && !value) {
            isValid = false;
        }

        // Validaciones específicas por tipo
        switch (field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value && !emailRegex.test(value)) {
                    isValid = false;
                }
                break;
            case 'password':
                if (value && value.length < 6) {
                    isValid = false;
                }
                break;
            case 'number':
                if (value && (isNaN(value) || parseFloat(value) <= 0)) {
                    isValid = false;
                }
                break;
        }

        if (!isValid) {
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }

        return isValid;
    }

    // Limpiar error de campo
    clearFieldError(field) {
        field.classList.remove('error');
    }

    // Manejar login
    handleLogin() {
        const formData = new FormData(document.getElementById('login-form'));
        const idType = formData.get('idType');
        const idNumber = formData.get('idNumber');
        const password = formData.get('password');

        // Validar campos
        if (!idType || !idNumber || !password) {
            this.showError('login-error', 'Por favor complete todos los campos');
            return;
        }

        // Animación de carga
        const loginBtn = document.querySelector('#login-form button[type="submit"]');
        loginBtn.textContent = 'Verificando...';
        loginBtn.style.animation = 'pulse 1s infinite';

        // Simular tiempo de carga
        setTimeout(() => {
            // Buscar usuario
            const user = this.users.find(u => 
                u.idType === idType && 
                u.idNumber === idNumber && 
                u.password === password
            );

            if (user) {
                this.currentUser = user;
                loginBtn.textContent = '¡Acceso Exitoso!';
                loginBtn.style.animation = 'bounceIn 0.6s ease-out';
                
                setTimeout(() => {
                    this.showPage('dashboard');
                    this.loadDashboard();
                    loginBtn.textContent = 'Iniciar Sesión';
                    loginBtn.style.animation = '';
                }, 1000);
            } else {
                this.showError('login-error', 'No se pudo validar su identidad. Verifique sus credenciales.');
                loginBtn.textContent = 'Iniciar Sesión';
                loginBtn.style.animation = '';
            }
        }, 1500);
    }

    // Manejar registro
    handleRegister() {
        const formData = new FormData(document.getElementById('register-form'));
        const userData = {
            idType: formData.get('idType'),
            idNumber: formData.get('idNumber'),
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            gender: formData.get('gender'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            address: formData.get('address'),
            city: formData.get('city'),
            password: formData.get('password')
        };

        // Validar que todos los campos estén completos
        for (const [key, value] of Object.entries(userData)) {
            if (!value || value.trim() === '') {
                this.showError('register-error', 'Por favor complete todos los campos obligatorios');
                return;
            }
        }

        // Verificar si el usuario ya existe
        const existingUser = this.users.find(u => 
            u.idType === userData.idType && u.idNumber === userData.idNumber
        );

        if (existingUser) {
            this.showError('register-error', 'Ya existe una cuenta con esta identificación');
            return;
        }

        // Animación de carga
        const registerBtn = document.querySelector('#register-form button[type="submit"]');
        registerBtn.textContent = 'Creando Cuenta...';
        registerBtn.style.animation = 'pulse 1s infinite';

        // Simular tiempo de procesamiento
        setTimeout(() => {
            // Crear cuenta
            const accountNumber = this.generateAccountNumber();
            const createdDate = new Date().toISOString();

            const newUser = {
                ...userData,
                accountNumber,
                balance: 0,
                createdDate
            };

            this.users.push(newUser);
            this.saveUsers();

            registerBtn.textContent = '¡Cuenta Creada!';
            registerBtn.style.animation = 'bounceIn 0.6s ease-out';

            // Mostrar mensaje de éxito
            document.getElementById('new-account-number').textContent = accountNumber;
            document.getElementById('new-account-date').textContent = this.formatDate(createdDate);
            
            setTimeout(() => {
                this.showElement('registration-success');
                registerBtn.textContent = 'Crear Cuenta';
                registerBtn.style.animation = '';
            }, 1000);
        }, 2000);
    }

    // Manejar recuperación de contraseña
    handleForgotPassword() {
        const formData = new FormData(document.getElementById('forgot-form'));
        const idType = formData.get('idType');
        const idNumber = formData.get('idNumber');
        const email = formData.get('email');

        if (!idType || !idNumber || !email) {
            this.showError('forgot-error', 'Por favor complete todos los campos');
            return;
        }

        const user = this.users.find(u => 
            u.idType === idType && 
            u.idNumber === idNumber && 
            u.email === email
        );

        if (user) {
            this.tempUser = user;
            this.hideElement('forgot-form');
            this.showElement('new-password-form');
        } else {
            this.showError('forgot-error', 'Los datos ingresados no coinciden con nuestros registros');
        }
    }

    // Manejar nueva contraseña
    handleNewPassword() {
        const formData = new FormData(document.getElementById('new-password-form'));
        const newPassword = formData.get('newPassword');
        const confirmPassword = formData.get('confirmPassword');

        if (!newPassword || !confirmPassword) {
            this.showError('forgot-error', 'Por favor complete todos los campos');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showError('forgot-error', 'Las contraseñas no coinciden');
            return;
        }

        if (newPassword.length < 6) {
            this.showError('forgot-error', 'La contraseña debe tener al menos 6 caracteres');
            return;
        }

        // Actualizar contraseña
        this.tempUser.password = newPassword;
        this.saveUsers();

        this.showSuccessMessage('Contraseña actualizada exitosamente');
        setTimeout(() => {
            this.hideElement('success-message');
            this.showPage('login');
        }, 2000);
    }

    // Manejar consignación
    handleConsignacion() {
        const amount = parseFloat(document.getElementById('consig-amount').value);
        
        if (!amount || amount <= 0) {
            this.showError('consig-error', 'Por favor ingrese un monto válido');
            return;
        }

        const transaction = {
            id: this.generateTransactionId(),
            accountNumber: this.currentUser.accountNumber,
            date: new Date().toISOString(),
            reference: this.generateReference(),
            type: 'consignacion',
            description: 'Consignación por canal electrónico',
            amount: amount,
            balance: this.currentUser.balance + amount
        };

        this.currentUser.balance += amount;
        this.addTransaction(transaction);

        this.showSuccessMessage(`Consignación exitosa. Nuevo saldo: $${this.formatCurrency(this.currentUser.balance)}`);
        document.getElementById('consignacion-form').reset();
        this.updateAccountInfo();
    }

    // Manejar retiro
    handleRetiro() {
        const amount = parseFloat(document.getElementById('retiro-amount').value);
        
        if (!amount || amount <= 0) {
            this.showError('retiro-error', 'Por favor ingrese un monto válido');
            return;
        }

        if (amount > this.currentUser.balance) {
            this.showError('retiro-error', 'Fondos insuficientes');
            return;
        }

        const transaction = {
            id: this.generateTransactionId(),
            accountNumber: this.currentUser.accountNumber,
            date: new Date().toISOString(),
            reference: this.generateReference(),
            type: 'retiro',
            description: 'Retiro de dinero',
            amount: -amount,
            balance: this.currentUser.balance - amount
        };

        this.currentUser.balance -= amount;
        this.addTransaction(transaction);

        this.showSuccessMessage(`Retiro exitoso. Nuevo saldo: $${this.formatCurrency(this.currentUser.balance)}`);
        document.getElementById('retiro-form').reset();
        this.updateAccountInfo();
    }

    // Manejar pago de servicios
    handleServicios() {
        const serviceType = document.getElementById('service-type').value;
        const reference = document.getElementById('service-reference').value;
        const amount = parseFloat(document.getElementById('service-amount').value);

        if (!serviceType || !reference || !amount || amount <= 0) {
            this.showError('servicios-error', 'Por favor complete todos los campos');
            return;
        }

        if (amount > this.currentUser.balance) {
            this.showError('servicios-error', 'Fondos insuficientes');
            return;
        }

        const serviceNames = {
            energia: 'Energía',
            agua: 'Agua',
            gas: 'Gas Natural',
            internet: 'Internet'
        };

        const transaction = {
            id: this.generateTransactionId(),
            accountNumber: this.currentUser.accountNumber,
            date: new Date().toISOString(),
            reference: this.generateReference(),
            type: 'pago_servicio',
            description: `Pago de ${serviceNames[serviceType]} - Ref: ${reference}`,
            amount: -amount,
            balance: this.currentUser.balance - amount
        };

        this.currentUser.balance -= amount;
        this.addTransaction(transaction);

        this.showSuccessMessage(`Pago de ${serviceNames[serviceType]} exitoso. Nuevo saldo: $${this.formatCurrency(this.currentUser.balance)}`);
        document.getElementById('servicios-form').reset();
        this.updateAccountInfo();
    }

    // Manejar extracto
    handleExtracto() {
        const year = document.getElementById('extracto-year').value;
        const month = document.getElementById('extracto-month').value;

        if (!year || !month) {
            this.showError('extracto-error', 'Por favor seleccione año y mes');
            return;
        }

        const userTransactions = this.transactions.filter(t => {
            if (t.accountNumber !== this.currentUser.accountNumber) return false;
            
            const transactionDate = new Date(t.date);
            const transactionYear = transactionDate.getFullYear().toString();
            const transactionMonth = (transactionDate.getMonth() + 1).toString().padStart(2, '0');
            
            return transactionYear === year && transactionMonth === month;
        });

        this.displayExtracto(userTransactions);
    }

    // Mostrar extracto
    displayExtracto(transactions) {
        const tbody = document.getElementById('extracto-body');
        tbody.innerHTML = '';

        if (transactions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-secondary);">No hay transacciones en el período seleccionado</td></tr>';
        } else {
            transactions.forEach((transaction, index) => {
                const row = document.createElement('tr');
                row.style.animationDelay = `${index * 0.1}s`;
                row.innerHTML = `
                    <td>${this.formatDate(transaction.date)}</td>
                    <td>${transaction.reference}</td>
                    <td>${this.getTransactionTypeName(transaction.type)}</td>
                    <td>${transaction.description}</td>
                    <td class="${transaction.amount > 0 ? 'transaction-credit' : 'transaction-debit'}">
                        ${transaction.amount > 0 ? '+' : ''}$${this.formatCurrency(Math.abs(transaction.amount))}
                    </td>
                `;
                tbody.appendChild(row);
            });
        }

        document.getElementById('extracto-results').classList.remove('hidden');
    }

    // Cargar dashboard
    loadDashboard() {
        // Cargar tema guardado
        this.loadTheme();
        
        // Animación de entrada del dashboard
        const dashboardPage = document.getElementById('dashboard-page');
        dashboardPage.style.animation = 'fadeIn 0.8s ease-out';

        // Actualizar información con animaciones escalonadas
        setTimeout(() => this.updateAccountInfo(), 300);
        setTimeout(() => this.loadTransactionsSummary(), 600);
        setTimeout(() => this.updateCertificate(), 900);
        setTimeout(() => this.showDashboardSection('resumen'), 1200);
    }

    // Actualizar información de cuenta
    updateAccountInfo() {
        const userName = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        
        // Animación de contador para el saldo
        const balanceElement = document.getElementById('account-balance');
        this.animateNumber(balanceElement, this.currentUser.balance);

        document.getElementById('user-name').textContent = userName;
        document.getElementById('account-number').textContent = this.currentUser.accountNumber;
        document.getElementById('account-created').textContent = this.formatDate(this.currentUser.createdDate);

        // Actualizar información en formularios con animación
        const accountInfoElements = [
            'consig-account-number', 'consig-account-holder',
            'retiro-account-number', 'retiro-account-holder',
            'servicios-account-number', 'servicios-account-holder',
            'extracto-account-number', 'extracto-account-holder'
        ];

        accountInfoElements.forEach((id, index) => {
            const element = document.getElementById(id);
            if (element) {
                element.style.animation = 'fadeIn 0.6s ease-out';
                element.style.animationDelay = `${index * 0.1}s`;
                element.textContent = id.includes('holder') ? userName : this.currentUser.accountNumber;
            }
        });

        // Guardar cambios en localStorage
        this.saveUsers();
    }

    // Animar números
    animateNumber(element, targetValue) {
        const startValue = 0;
        const duration = 1000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = startValue + (targetValue - startValue) * progress;
            element.textContent = `$${this.formatCurrency(currentValue)}`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    // Cargar resumen de transacciones
    loadTransactionsSummary() {
        const userTransactions = this.transactions
            .filter(t => t.accountNumber === this.currentUser.accountNumber)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10);

        const tbody = document.getElementById('transactions-body');
        tbody.innerHTML = '';

        if (userTransactions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-secondary);">No hay transacciones registradas</td></tr>';
        } else {
            userTransactions.forEach((transaction, index) => {
                const row = document.createElement('tr');
                row.style.animationDelay = `${index * 0.1}s`;
                row.innerHTML = `
                    <td>${this.formatDate(transaction.date)}</td>
                    <td>${transaction.reference}</td>
                    <td>${this.getTransactionTypeName(transaction.type)}</td>
                    <td>${transaction.description}</td>
                    <td class="${transaction.amount > 0 ? 'transaction-credit' : 'transaction-debit'}">
                        ${transaction.amount > 0 ? '+' : ''}$${this.formatCurrency(Math.abs(transaction.amount))}
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    }

    // Actualizar certificado
    updateCertificate() {
        const userName = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        const idTypeNames = {
            cc: 'Cédula de Ciudadanía',
            ce: 'Cédula de Extranjería',
            ti: 'Tarjeta de Identidad',
            pasaporte: 'Pasaporte'
        };

        document.getElementById('cert-holder-name').textContent = userName;
        document.getElementById('cert-id-type').textContent = idTypeNames[this.currentUser.idType];
        document.getElementById('cert-id-number').textContent = this.currentUser.idNumber;
        document.getElementById('cert-account-number').textContent = this.currentUser.accountNumber;
        document.getElementById('cert-created-date').textContent = this.formatDate(this.currentUser.createdDate);
        document.getElementById('cert-current-date').textContent = this.formatDate(new Date().toISOString());
    }

    // Mostrar sección del dashboard
    showDashboardSection(sectionName) {
        // Ocultar todas las secciones
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Remover clase activa de todos los links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Mostrar sección seleccionada
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Recargar datos específicos de la sección
            if (sectionName === 'transacciones') {
                this.loadTransactionsSummary();
            } else if (sectionName === 'tarjeta') {
                this.loadCreditCardData();
            }
        }
        
        // Activar link correspondiente
        const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // Funciones de utilidad
    generateAccountNumber() {
        const prefix = '4001';
        const suffix = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        return `${prefix}${suffix}`;
    }

    generateReference() {
        return Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    }

    generateTransactionId() {
        return Date.now().toString() + Math.floor(Math.random() * 1000);
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('es-CO', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    getTransactionTypeName(type) {
        const types = {
            consignacion: 'Consignación',
            retiro: 'Retiro',
            pago_servicio: 'Pago de Servicio'
        };
        return types[type] || type;
    }

    // Funciones de persistencia
    loadUsers() {
        const usersData = localStorage.getItem('bankUsers');
        return usersData ? JSON.parse(usersData) : [];
    }

    saveUsers() {
        localStorage.setItem('bankUsers', JSON.stringify(this.users));
    }

    loadTransactions() {
        const transactionsData = localStorage.getItem('bankTransactions');
        return transactionsData ? JSON.parse(transactionsData) : [];
    }

    saveTransactions() {
        localStorage.setItem('bankTransactions', JSON.stringify(this.transactions));
    }

    addTransaction(transaction) {
        this.transactions.push(transaction);
        this.saveTransactions();
    }

    // Funciones de UI
    showPage(pageName) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(`${pageName}-page`).classList.add('active');
        
        // Limpiar campos solo si no es la landing page
        if (pageName !== 'landing') {
            document.querySelectorAll('input, select, textarea').forEach(field => {
                field.value = '';
                field.classList.remove('error');
            });
        }
    }

    showElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove('hidden');
            element.style.animation = 'fadeIn 0.5s ease-out';
        }
    }

    hideElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                element.classList.add('hidden');
            }, 300);
        }
    }

    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
            errorElement.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                errorElement.classList.remove('show');
            }, 5000);
        }
    }

    showSuccessMessage(message) {
        const successElement = document.getElementById('success-message');
        const textElement = document.getElementById('success-text');
        
        if (successElement && textElement) {
            textElement.textContent = message;
            successElement.classList.remove('hidden');
            successElement.style.animation = 'bounceIn 0.6s ease-out';
            
            // Auto-cerrar después de 3 segundos
            setTimeout(() => {
                this.hideElement('success-message');
            }, 3000);
        }
    }

    logout() {
        this.currentUser = null;
        this.showPage('login');
        // Limpiar formularios
        document.querySelectorAll('form').forEach(form => form.reset());
    }

    goToLanding() {
        this.showPage('landing');
    }

    // Funciones de impresión
    printTransactions() {
        const printContent = document.getElementById('transacciones-section').innerHTML;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Resumen de Transacciones</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        .transaction-credit { color: green; }
                        .transaction-debit { color: red; }
                        .btn { display: none; }
                    </style>
                </head>
                <body>
                    <h2>Banco Acme - Resumen de Transacciones</h2>
                    <p><strong>Cliente:</strong> ${this.currentUser.firstName} ${this.currentUser.lastName}</p>
                    <p><strong>Cuenta:</strong> ${this.currentUser.accountNumber}</p>
                    <p><strong>Fecha:</strong> ${this.formatDate(new Date().toISOString())}</p>
                    ${printContent}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }

    printCertificate() {
        const printContent = document.getElementById('certificate').innerHTML;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Certificado Bancario</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .certificate-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1e3a8a; padding-bottom: 20px; }
                        .certificate-header h2 { color: #1e3a8a; font-size: 24px; margin-bottom: 10px; }
                        .certificate-body p { margin-bottom: 15px; line-height: 1.8; }
                        .certificate-footer { margin-top: 40px; text-align: center; }
                        .signature { margin-top: 30px; }
                    </style>
                </head>
                <body>
                    ${printContent}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }

    // Poblar opciones de año
    populateYearOptions() {
        const yearSelect = document.getElementById('extracto-year');
        const currentYear = new Date().getFullYear();
        
        for (let year = currentYear; year >= currentYear - 10; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }
    }

    // Actualizar fecha actual
    updateCurrentDate() {
        const today = new Date().toISOString();
        document.getElementById('cert-current-date').textContent = this.formatDate(today);
    }

    // Cargar datos de la tarjeta de crédito
    loadCreditCardData() {
        const cardNumber = '4532 1234 5678 9012';
        const holderName = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        
        document.getElementById('card-number').textContent = cardNumber;
        document.getElementById('card-holder-name').textContent = holderName.toUpperCase();
        
        // Generar fecha de vencimiento (4 años desde ahora)
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 4);
        const month = String(expiryDate.getMonth() + 1).padStart(2, '0');
        const year = String(expiryDate.getFullYear()).slice(-2);
        document.getElementById('card-expiry-date').textContent = `${month}/${year}`;
        
        // Actualizar detalles de la tarjeta
        document.getElementById('credit-limit').textContent = '$5,000,000';
        document.getElementById('available-credit').textContent = '$5,000,000';
        document.getElementById('minimum-payment').textContent = '$0';
        
        // Calcular próxima fecha de corte
        const nextCutDate = new Date();
        nextCutDate.setDate(15);
        if (nextCutDate.getDate() <= new Date().getDate()) {
            nextCutDate.setMonth(nextCutDate.getMonth() + 1);
        }
        document.getElementById('next-cut-date').textContent = this.formatDate(nextCutDate.toISOString());
    }

    // Alternar tema
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Actualizar ícono del botón
        const themeIcon = document.getElementById('theme-icon');
        const landingThemeIcon = document.getElementById('landing-theme-icon');
        
        if (themeIcon) {
            themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        }
        
        if (landingThemeIcon) {
            landingThemeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        }
        
        // Guardar preferencia
        localStorage.setItem('theme', newTheme);
        
        // Animación del botón
        const themeButton = document.getElementById('theme-toggle');
        const landingThemeButton = document.getElementById('landing-theme-toggle');
        
        if (themeButton) {
            themeButton.style.animation = 'bounceIn 0.5s ease-out';
            setTimeout(() => {
                themeButton.style.animation = '';
            }, 500);
        }
        
        if (landingThemeButton) {
            landingThemeButton.style.animation = 'bounceIn 0.5s ease-out';
            setTimeout(() => {
                landingThemeButton.style.animation = '';
            }, 500);
        }
    }

    // Cargar tema guardado
    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const themeIcon = document.getElementById('theme-icon');
        const landingThemeIcon = document.getElementById('landing-theme-icon');
        
        if (themeIcon) {
            themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
        }
        
        if (landingThemeIcon) {
            landingThemeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
        }
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const app = new BankApp();
    app.init();
});
