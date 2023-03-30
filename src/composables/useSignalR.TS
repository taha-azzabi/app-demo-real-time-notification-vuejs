import { ref, watchEffect } from 'vue'
import { HubConnection } from '@microsoft/signalr'
import start from '@/utils/signalr'

export default async function useSignalR(userId: string) {
  const connection = ref<HubConnection | null>(null)
  start(userId).then((conn) => {
    if (conn instanceof HubConnection) {
      connection.value = conn
    }
  })

  const on = (eventName: string, callback) => {
    watchEffect(() => {
      if (connection.value) {
        connection.value.on(eventName, callback)
      }
    })
  }

  const off = (eventName: string, callback) => {
    watchEffect(() => {
      if (connection.value) {
        connection.value.off(eventName, callback)
      }
    })
  }

  return {
    connection,
    on,
    off
  }
}
