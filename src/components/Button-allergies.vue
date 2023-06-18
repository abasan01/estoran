<template>
  <div class="row justify-content-center">
    <button
      @click="selectAllergy(value)"
      type="button"
      class="btn btn-primary btn-custom col-2 m-2"
      :disabled="buttonFlag"
    >
      {{ value }}
    </button>
  </div>
</template>

<script>
import store from "@/store";
import { eventBusAllergy } from "@/main";

export default {
  data: function () {
    return {
      buttonFlag: false,
    };
  },
  name: "ButtonAllergies",
  props: ["value"],
  created() {
    eventBusAllergy.$on("ChangeButton", this.checkFlag);
  },
  destroyed() {
    eventBusAllergy.$off("ChangeButton", this.checkFlag);
  },
  mounted() {
    this.checkFlag();
  },
  methods: {
    checkFlag() {
      if (this.value == store.selectedAllergy) {
        return (this.buttonFlag = true);
      } else return (this.buttonFlag = false);
    },
    selectAllergy(buttonValue) {
      store.selectedAllergy = buttonValue;
      eventBusAllergy.$emit("ChangeButton");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
