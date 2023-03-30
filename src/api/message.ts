interface SendMessagePayload {
  userId: string
  message: string
}

export async function sendBroadcastMessage(payload: SendMessagePayload): Promise<void> {
  try {
    const response = await fetch(import.meta.env.VITE_BROADCAST_MESSAGE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`Failed to send broadcast message: ${response.statusText}`)
    }
  } catch (error) {
    console.error('Error sending broadcast message:', error)
    throw error
  }
}
