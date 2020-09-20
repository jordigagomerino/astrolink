<template>
  <q-page class="flex justify-start items-center column q-pt-xl" >
     <img src="~/assets/astrolink-logo-full-45.svg" class="q-ma-lg" width="150px">
     <h1 class="text-h2" style="margin: 0px">{{$t('welcome')}}</h1>
     <p class="text-subtitle1">{{$t('welcome_connect')}}</p>
     <q-btn to="/login" color="primary" text-color="white" :label="$t('get_started')" size="17px" style="width: 200px" unelevated no-caps/>
  </q-page>
</template>

<script>
import './../css/pages/initialize.sass'
export default {
  name: 'InitializePage',

}
</script>
