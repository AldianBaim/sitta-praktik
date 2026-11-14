/**
 * Komponen: BaseModal
 * Dialog serbaguna dengan slot. Semua modal (login, detail barang, laporan)
 * memakai komponen ini supaya markup overlay tidak ditulis berulang.
 *
 * Props:
 * - judul : teks judul modal
 * - lebar : lebar maksimum kotak modal
 *
 * Event:
 * - tutup : dikirim saat tombol close, klik backdrop, atau tombol Escape ditekan
 */
Vue.component("base-modal", {
  // Props: data dari parent masuk lewat props; child tidak mengubah props langsung.
  props: {
    judul: {
      type: String,
      default: "Informasi"
    },
    lebar: {
      type: String,
      default: "520px"
    }
  },

  // Event keyboard: tombol Escape menutup modal aktif.
  mounted: function () {
    document.addEventListener("keydown", this.tanganiEscape);
    document.body.style.overflow = "hidden";
  },

  beforeDestroy: function () {
    document.removeEventListener("keydown", this.tanganiEscape);
    document.body.style.overflow = "";
  },

  methods: {
    tanganiEscape: function (event) {
      if (event.key === "Escape") {
        this.$emit("tutup");
      }
    }
  },

  template: `
    <!-- event: @click.self hanya menutup saat backdrop diklik, bukan saat isi modal diklik. -->
    <div class="modal-overlay active" role="dialog" aria-modal="true" @click.self="$emit('tutup')">
      <!-- v-bind:style: lebar maksimum modal berasal dari props lebar. -->
      <div class="modal-container" :style="{ maxWidth: lebar }">
        <div class="modal-header">
          <h2 class="modal-title">{{ judul }}</h2>
          <button type="button" class="modal-close-btn" aria-label="Tutup modal" @click="$emit('tutup')">&times;</button>
        </div>
        <div class="modal-body">
          <!-- slot: tempat isi dialog dari komponen pemakai. -->
          <slot></slot>
        </div>
        <div class="modal-footer">
          <!-- named slot: parent bisa mengganti tombol footer lewat #footer. -->
          <slot name="footer">
            <button type="button" class="btn btn-outline" @click="$emit('tutup')">Tutup</button>
          </slot>
        </div>
      </div>
    </div>
  `
});
