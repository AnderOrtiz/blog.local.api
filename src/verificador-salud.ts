import * as os from 'os';

// Desactivar la verificación estricta de TLS en desarrollo local (útil para HTTPS con mkcert)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

interface EstadoNodo {
    url: string;
    saludable: boolean;
    detalle?: any;
    error?: string;
}

/**
 * Verifica la salud de un nodo individual enviando una petición HTTP/HTTPS a /health
 */
async function verificarNodo(url: string): Promise<EstadoNodo> {
    try {
        const respuesta = await fetch(`${url}/health`, {
            signal: AbortSignal.timeout(3000) // Timeout de 3 segundos máximo
        });

        if (!respuesta.ok) {
            return { url, saludable: false, error: `HTTP ${respuesta.status}` };
        }

        const detalle = await respuesta.json();

        // Validar si el JSON retornado indica que no está saludable
        if (detalle.estado !== 'saludable') {
            return { url, saludable: false, detalle, error: 'Estado no es saludable' };
        }

        return { url, saludable: true, detalle };
    } catch (err: any) {
        return { 
            url, 
            saludable: false, 
            error: err.name === 'TimeoutError' ? 'Timeout' : 'Sin conexión' 
        };
    }
}

/**
 * Recorre y verifica todos los nodos del clúster en paralelo utilizando Promise.all
 */
async function verificarCluster(nodos: string[]) {
    console.log("\n=== ESTADO DEL CLÚSTER DE 3 NODOS ===");

    // Ejecución paralela
    const resultados = await Promise.all(nodos.map(verificarNodo));

    for (const r of resultados) {
        if (r.saludable) {
            // \x1b[32m = Verde
            console.log(`\x1b[32m[OK]\x1b[0m ${r.url} - Saludable (Nodo: ${r.detalle?.nodo ?? 'Desconocido'})`);
        } else {
            // \x1b[31m = Rojo
            console.log(`\x1b[31m[CAIDO]\x1b[0m ${r.url} - No Saludable (${r.error})`);
        }
    }

    const sanos = resultados.filter((r) => r.saludable).length;
    console.log(`\nResumen: ${sanos} de ${resultados.length} nodos saludables.\n`);
}

// Configuración de los 3 nodos del clúster (Clase 32)
verificarCluster([
    "http://localhost:9005",
    "http://localhost:9006",
    "http://localhost:9007"
]);


// npx tsx --no-warnings src/verificador-salud.ts
// npx tsx src/verificador-salud.ts