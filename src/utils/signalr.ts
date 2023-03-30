import * as signalR from '@microsoft/signalr'
import type { HubConnection } from '@microsoft/signalr'

async function fetchNegotiate(userId: string) {
  try {
    const response = await fetch(import.meta.env.VITE_NEGOTIATE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-ms-client-principal-id': userId
      }
    })

    if (!response.ok) {
      throw new Error(`Error fetching negotiate response: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to fetch negotiate response:', error)
    throw error
  }
}

async function start(userId: string): Promise<HubConnection> {
  try {
    const negotiateResponse = await fetchNegotiate(userId)
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(negotiateResponse.url, { accessTokenFactory: () => negotiateResponse.accessToken })
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect()
      .build()
    await connection.start()
    return connection
  } catch (error) {
    console.error('SignalR connection failed: ', error)
    throw error
  }
}

export default start
