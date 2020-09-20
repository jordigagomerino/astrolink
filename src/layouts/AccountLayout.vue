<template>
   <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-white text-black">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <q-toolbar-title>
          <q-avatar>
            <img src="~/assets/astrolink-logo-full.svg">
          </q-avatar>
          Astrolink
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="left" side="left" overlay behavior="mobile" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>

export default {
  name: 'MainLayout',
  components: { },
  data () {
    return {
      left: false
    }
  }
}
</script>
