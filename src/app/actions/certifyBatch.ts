'use server'

import { redirect } from 'next/navigation'

export async function certifyBatch(formData: FormData) {
    const variedad = formData.get('variedad')
    const acidez = formData.get('acidez')
    const lat = formData.get('lat')
    const lng = formData.get('lng')

    // Validar datos básicos
    if (!variedad || !acidez) {
        throw new Error('Faltan datos requeridos')
    }

    try {
        // 1. Llamada al Webhook de Make.com (AI + Blockchain)
        const webhookUrl = process.env.MAKE_WEBHOOK_URL || 'https://hook.eu1.make.com/PLACEHOLDER_WEBHOOK_URL'

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                variety: variedad,
                acidity: parseFloat(acidez.toString()),
                lat: lat ? parseFloat(lat.toString()) : null,
                lng: lng ? parseFloat(lng.toString()) : null,
                timestamp: new Date().toISOString()
            }),
        })

        if (!response.ok) {
            console.error('Initial webhook failed, retrying mock for demo...', response.statusText);
            // Fallback for demo if webhook fails/isn't configured
            return { success: true, mock: true };
        }

        const result = await response.json();
        return { success: true, data: result }

    } catch (error) {
        console.error('Error in certifyBatch:', error)
        // En producción deberíamos retornar error, pero para la demo permitiremos continuar
        return { success: false, error: 'Error de conexión con Make.com' }
    }
}
