<template>
    <md-dialog :md-active.sync="displayPopup"
               :md-close-on-esc="false"
               :md-click-outside-to-close="false">
        <md-dialog-title>{{title}}</md-dialog-title>
        <div v-if="isWorkInProgressPopup">
            <div>
                {{content}}
            </div>
            <div>
                <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
            </div>
        </div>
        <div v-if="!isWorkInProgressPopup">
            <div v-if="isAlertPopup" class="md-layout-item md-size-30">
                <md-icon>error</md-icon>
            </div>
            <div v-if="isInfoPopup" class="md-layout-item md-size-30">
                <md-icon>info</md-icon>
            </div>
            <div class="md-layout-item md-size-70">
                {{content}}
            </div>
        </div>
    </md-dialog>
</template>

<script>
    export default {
        name: "PopupDialog",
        props: {
            title: String,
            content: String,
            isWorkInProgressPopup: false,
            isAlertPopup: false,
            isInfoPopup: false,
            displayPopup: Boolean
        }
    }
</script>

<style scoped>

</style>