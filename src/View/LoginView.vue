<script lang="ts" setup></script>

<template>
  <v-container fill-height fluid>
    <v-row>
      <v-col></v-col>
      <v-col>
        <v-card style="text-align: center">
          <v-card-title>เข้าสู่ระบบ</v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field label="Email" required variant="solo"></v-text-field>
              <v-text-field
                label="Password"
                type="password"
                variant="solo"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-action>
            <v-btn>เข้าสู่ระบบ</v-btn>
          </v-card-action>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style></style>
