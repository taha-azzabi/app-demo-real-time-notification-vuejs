<template>
  <v-snackbar v-bind="$attrs">
    <slot />
    <template v-slot:actions>
      <v-btn color="blue" variant="text" @click="$emit('close')">
        <v-icon size="large" color="white">mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>
