// API de gestión de usuarios con múltiples problemas para probar Code Review
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const app = express();
app.use(express.json());

// PROBLEMA 1: Credenciales hardcodeadas (Seguridad)
const DB_CONFIG = {
    host: 'localhost',
    user: 'admin',
    password: 'password123',  // ¡Credencial hardcodeada!
    database: 'users_db'
};

// PROBLEMA 2: JWT Secret hardcodeado (Seguridad)
const JWT_SECRET = "my-super-secret-key";  // ¡Secret hardcodeado!

// PROBLEMA 3: Conexión DB sin manejo de errores (Robustez)
const connection = mysql.createConnection(DB_CONFIG);

// PROBLEMA 4: Función con demasiada responsabilidad (Código limpio)
async function processUser(userData) {
    // Validación
    if (!userData.email || !userData.password) {
        throw new Error('Missing data');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // SQL Injection vulnerable (PROBLEMA 5: Seguridad)
    const query = `INSERT INTO users (email, password, role) VALUES ('${userData.email}', '${hashedPassword}', '${userData.role || 'user'}')`;
    
    // PROBLEMA 6: Callback hell y manejo inadecuado de promesas
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
            if (error) {
                console.log(error); // PROBLEMA 7: Log de información sensible
                reject(error);
            } else {
                // PROBLEMA 8: Lógica de negocio mezclada
                if (userData.role === 'admin') {
                    fs.writeFileSync('./admin_log.txt', `New admin: ${userData.email}\n`, { flag: 'a' });
                }
                resolve(results);
            }
        });
    });
}

// PROBLEMA 9: Ruta sin validación de entrada (Seguridad)
app.post('/api/users', async (req, res) => {
    try {
        const result = await processUser(req.body);
        res.status(201).json({ success: true, id: result.insertId });
    } catch (error) {
        // PROBLEMA 10: Exposición de errores internos
        res.status(500).json({ error: error.message, stack: error.stack });
    }
});

// PROBLEMA 11: Autenticación vulnerable
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    // PROBLEMA 12: SQL Injection en login
    const query = `SELECT * FROM users WHERE email = '${email}'`;
    
    connection.query(query, async (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = results[0];
        
        // PROBLEMA 13: Comparación de password potencialmente insegura
        const isValid = await bcrypt.compare(password, user.password);
        
        if (isValid) {
            // PROBLEMA 14: Token sin expiración
            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
            res.json({ token, user: user }); // PROBLEMA 15: Exposición de datos sensibles
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

// PROBLEMA 16: Middleware de autenticación incompleto
function authenticate(req, res, next) {
    const token = req.headers.authorization;
    
    if (!token) {
        return res.status(401).json({ error: 'No token' });
    }
    
    // PROBLEMA 17: Verificación JWT sin manejo de errores
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
}

// PROBLEMA 18: Endpoint sin protección adecuada
app.get('/api/users/:id', authenticate, (req, res) => {
    const userId = req.params.id;
    
    // PROBLEMA 19: Falta validación de autorización
    // Cualquier usuario autenticado puede ver cualquier usuario
    
    // PROBLEMA 20: SQL Injection potencial
    const query = `SELECT * FROM users WHERE id = ${userId}`;
    
    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // PROBLEMA 21: Retorna password hash
        res.json(results[0]);
    });
});

// PROBLEMA 22: Ruta de eliminación peligrosa
app.delete('/api/users/:id', authenticate, (req, res) => {
    const userId = req.params.id;
    
    // PROBLEMA 23: Sin validación de permisos de admin
    // PROBLEMA 24: SQL Injection
    const query = `DELETE FROM users WHERE id = ${userId}`;
    
    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database error' });
        }
        
        res.json({ message: 'User deleted' });
    });
});

// PROBLEMA 25: Manejo global de errores ausente
// PROBLEMA 26: Sin validación de Content-Type
// PROBLEMA 27: Sin rate limiting
// PROBLEMA 28: Sin CORS configurado
// PROBLEMA 29: Sin helmet para headers de seguridad

// PROBLEMA 30: Función sin usar (Dead code)
function unusedFunction() {
    const data = "This function is never called";
    return data;
}

// PROBLEMA 31: Variable global innecesaria
var globalCounter = 0;

// PROBLEMA 32: Callback sin manejo de errores
app.get('/api/health', (req, res) => {
    fs.readFile('./health.txt', (err, data) => {
        // Sin manejo del error
        res.json({ status: 'ok', data: data.toString() });
    });
});

// PROBLEMA 33: Puerto hardcodeado
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // PROBLEMA 34: Log de información de configuración
    console.log('Database config:', DB_CONFIG);
});

// PROBLEMA 35: Sin graceful shutdown
// PROBLEMA 36: Sin validación de variables de entorno
// PROBLEMA 37: Sin documentación de API
// Test comment for Copilot Code Review

