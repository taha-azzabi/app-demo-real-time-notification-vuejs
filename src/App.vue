<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
// Types
/*import type { Ref } from 'vue'
import type { HubConnection } from '@microsoft/signalr'*/

// Utils
import Badger from '@/utils/Badger'

// API
import { sendBroadcastMessage } from '@/api/message'
// Composition
import useSignalR from '@/composables/useSignalR'

// Components
import SnackbarBase from '@/components/SnackbarBase.vue'

// The USER_ID is a constant string representing a unique identifier for the user listening to messages.
// It can be changed, and it can be defined to represent the currently logged-in user.
// In this example, it is set to 'taha-id-01' to identify the user as "Taha" (Me).
const USER_ID = import.meta.env.VITE_USER_ID

const signalR = ref<null | any>(null)

// The countMessages variable is used to keep track of the number of messages received.
const countMessages = ref(0)
const messageToBroadcast = ref('')
// The messageReceived variable is used to store the message received from the server.
const messageReceived = ref('')
const messageRules = ref([
  (v: string) => !!v || 'Message is required',
  (v: string) => (v && v.length <= 100) || 'Message must be less than 100 characters'
])
// The notificationAlert variable is used to show a snackbar notification when a message is received.
const notificationAlert = ref(false)
// The badger variable is used to create a new instance of the Badger class.
const badger = ref<Badger | null>(null)

const sendMessage = async () => {
  try {
    await sendBroadcastMessage({
      userId: USER_ID,
      message: messageToBroadcast.value
    })
  } catch (error) {
    console.log(error)
  }
}

const handleMessage = (message: string) => {
  countMessages.value++
  if (badger.value) {
    badger.value.counter = countMessages.value
  }
  messageReceived.value = message
  notificationAlert.value = true
}

onMounted(async () => {
  badger.value = new Badger({ counter: 0, color: '#f00' })
  signalR.value = await useSignalR(USER_ID)
  if (signalR.value) {
    signalR.value.on('newMessage', handleMessage)
  }
})

onBeforeUnmount(() => {
  if (signalR.value) {
    signalR.value.off('newMessage', handleMessage)
  }
})
</script>

<template>
  <v-app>
    <v-main>
      <v-container class="fill-height">
        <div class="d-flex justify-center items-center">
          <v-card class="box-shadow-base pa-10" color="black" max-width="90%">
            <h1 class="text-center font-weight-black text-h2 mb-4 gradient-grey">
              Demo of Real-Time Notifications
            </h1>
            <h2 class="text-h6 font-weight-light text-center px-14 mb-10 text-grey-darken-1">
              This is a simple demo that shows how to broadcast messages from a server to connected
              clients in real-time. You can read the article for instructions on how to set this up:
            </h2>
            <v-form validate-on="submit" ref="formMessage" @submit.prevent="sendMessage">
              <v-textarea
                v-model="messageToBroadcast"
                :rules="messageRules"
                label="Message"
                placeholder="Write youre message here"
              ></v-textarea>
              <p class="mb-4 text-grey-darken-1 caption">
                The demonstration is using my real Azure account, and I don't want any extra charges
                since this is a free demo. Therefore, I'll be saving your encrypted IP address
                (don't worry, I'm doing it in a way that cannot be decrypted) to ensure that you run
                the demo just once. You can read more about how I encrypt the IP address here
                [insert link].
              </p>

              <v-btn class="transform-none" color="white" type="submit" block>
                Broadcast the message
              </v-btn>
            </v-form>
          </v-card>
        </div>
      </v-container>
      <SnackbarBase
        v-model="notificationAlert"
        :timeout="5000"
        variant="outlined"
        color="#D2AFA3"
        location="top right"
        @close="notificationAlert = false"
      >
        <p class="text-white font-weight-bold">{{ messageReceived }}</p>
      </SnackbarBase>
    </v-main>
  </v-app>
</template>
