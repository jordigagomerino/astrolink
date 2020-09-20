<template>
   <q-layout :class="{'isBEX': isPopup}">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'LoginLayout',
  components: { },
    data() {
    return {
      isPopup: false
    }
  }
}
</script>
