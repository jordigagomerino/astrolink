<template>
  <q-page class="flex justify-start items-center column q-pt-xl">
    <img src="~/assets/astrolink-logo-full-45.svg" class="q-ma-lg" width="150px" />
    <h2 class="text-h3 text-weight-light" style="margin: 0px">{{$t('new_to')}}</h2>
    <div class="flex row justify-center items-center q-ma-lg">
      <q-card flat bordered style="width: 388px; height: 278px;" class=" flex justify-center items-center column">
        <q-card-section class="flex justify-center items-center column">
          <q-icon name="backup" class="text-primary" size="75px" />

          <p class="text-center text-h5" style="margin: 0px">{{$t('i_have_seed')}}</p>
          <p class="text-center text-body1">{{$t('import_seed')}}</p>

          <q-btn
            to="/import"
            color="primary"
            text-color="white"
            :label="$t('import_w')"
            size="17px"
            style="width: 200px"
            unelevated
            no-caps
          />
        </q-card-section>
      </q-card>
      <q-card class="q-ml-xl flex justify-center items-center column" flat bordered style="width: 388px; height: 278px;">
        <q-card-section class="flex justify-center items-center column">
          <q-icon name="add" class="text-primary" size="75px" />

          <p class="text-center text-h5" style="margin: 0px">{{$t('im_new')}}</p>
          <p class="text-center text-body1">{{$t('create_seed')}}</p>

          <q-btn
            to="/create"
            color="primary"
            text-color="white"
            :label="$t('create_w')"
            size="17px"
            style="width: 200px"
            unelevated
            no-caps
          />
        </q-card-section>
      </q-card>
    </div>

    <!--<p class="text-subtitle1">Connecting you to Stellar Ecosystem</p>
    <q-btn
      to="/create"
      color="primary"
      text-color="white"
      label="Get Started"
      size="17px"
      style="width: 200px"
      unelevated
      no-caps
    />-->
  </q-page>
</template>

<script>
import "./../css/pages/initialize.sass";
export default {
  name: "LoginPage",
};
</script>
