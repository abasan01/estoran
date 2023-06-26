<template>
  <div class="row justify-content-center">
    <button
      @click="selectAllergy(value)"
      type="button"
      :class="[
        'btn',
        'btn-primary',
        'btn-custom',
        'col-2',
        'm-2',
        { clicked: buttonFlag },
      ]"
    >
      {{ value }}
    </button>
  </div>
</template>

<script>
import store from "@/store";
import restrictions from "@/restrictions";
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
    eventBusAllergy.$on("ButtonTogle", this.checkFlag);
  },
  destroyed() {
    eventBusAllergy.$off("ButtonTogle", this.checkFlag);
  },
  mounted() {
    this.checkFlag();
  },
  methods: {
    checkFlag() {
      if (store.selectedAllergy.includes(this.value)) {
        this.buttonFlag = true;
      } else this.buttonFlag = false;
    },
    popAllergy(allergyValue) {
      for (let i = store.selectedAllergy.length - 1; i >= 0; i--) {
        if (store.selectedAllergy[i] === allergyValue) {
          store.selectedAllergy.splice(i, 1);
          store.allergyOpis.splice(i, 1);
          break;
        }
      }
    },
    selectAllergy(buttonValue) {
      if (store.selectedAllergy.includes(buttonValue)) {
        this.popAllergy(buttonValue);
        this.buttonFlag = false;

        if (store.selectedAllergy.length == 0) {
          this.selectAllergy("Ništa");
        }
      } else {
        if (store.selectedAllergy.includes("Ništa")) {
          this.popAllergy("Ništa");
          eventBusAllergy.$emit("ButtonTogle");
          store.allergyOpis = [];
        }

        store.selectedAllergy.push(buttonValue);

        this.buttonFlag = true;
        if (buttonValue == "Ništa") {
          store.allergyOpis = [
            "Nemate alergija na hranu, te se zbog toga neće ograničavati hrana po alergijama",
          ];
          store.selectedAllergy = ["Ništa"];
          eventBusAllergy.$emit("ButtonTogle");
          return;
        }

        let alergija = restrictions.allergies.find(
          (allergy) =>
            allergy.naziv ===
            store.selectedAllergy[store.selectedAllergy.length - 1]
        );
        store.allergyOpis.push(alergija.opis);
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
