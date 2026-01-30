"use server";

export async function certifyBatch(data: {
    variety: string;
    acidity: string;
    lat: number;
    lng: number;
}) {
    const webhookUrl = process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL;

    if (!webhookUrl) {
        throw new Error("La URL del Webhook de Make no está configurada.");
    }

    try {
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Error en el webhook: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error("Error calling Make.com webhook:", error);
        throw error;
    }
}
