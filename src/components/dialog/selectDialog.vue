<script lang="ts" setup>
import { useUserStore } from '../../stores/user.store';
import DepartmentDialog from './departmentDialog.vue';
import PositionDialog from './positionDialog.vue';

const userStore = useUserStore();
</script>
<template>
    <v-container align="center" justify="center">
        <v-card width="30vw" height="40vh">
            <v-card-title>
                <v-row align="center" justify="center" style="margin-top: 10%;">
                    <v-card-actions>
                        <v-btn variant="flat" color="secondary" size="large" prepend-icon="mdi-plus" @click="userStore.showDialog2 = true">เพิ่มแผนก</v-btn>
                    </v-card-actions>
                </v-row>
                <v-row align="center" justify="center" style="margin-top: 10%;">
                    <v-card-actions>
                        <v-btn variant="flat" color="secondary" size="large" prepend-icon="mdi-plus" @click="userStore.showDialog3 = true">เพิ่มตำแหน่ง</v-btn>
                    </v-card-actions>
                </v-row>
            </v-card-title>
            <v-dialog v-model="userStore.showDialog2">
                <DepartmentDialog/>
            </v-dialog>
            <v-dialog v-model="userStore.showDialog3">
                <PositionDialog/>
            </v-dialog>
        </v-card>
    </v-container>
</template>