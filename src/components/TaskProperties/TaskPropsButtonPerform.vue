<template>
  <Popper
    class="popper-employees light"
    arrow
    placement="bottom"
  >
    <!-- Поручить -->
    <div
      v-if="taskType === 1"
      class="mt-3 tags-custom dark:bg-gray-800 dark:text-gray-100 active project-hover-close"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 96 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M83.7121 54.9882C80.8778 52.5882 77.4767 50.3294 73.5087 48.6353C71.8081 47.9294 69.8241 48.6353 69.1156 50.3294C68.407 52.0235 69.1156 54 70.8161 54.7059C74.0756 56.1177 76.9098 57.9529 79.319 59.9294C82.1533 62.4706 83.8538 66 83.8538 69.8118V84.9177C83.8538 86.7529 82.295 88.1647 80.5944 88.1647H15.4058C13.5636 88.1647 12.1464 86.6118 12.1464 84.9177V69.8118C12.1464 66 13.847 62.3294 16.6813 59.9294C20.0824 56.9647 29.8607 50.1882 48.0001 50.1882C61.6047 50.1882 72.5167 39.1765 72.5167 25.7647C72.5167 12.2118 61.6047 1.2 48.0001 1.2C34.3956 1.2 23.4836 12.2118 23.4836 25.6235C23.4836 33.5294 27.3098 40.5882 33.1201 44.9647C22.4916 47.3647 15.831 51.7412 12.2881 54.8471C7.89498 58.6588 5.48584 64.1647 5.48584 69.8118V84.9177C5.48584 90.4235 10.0207 94.8 15.4058 94.8H80.5944C86.1213 94.8 90.5144 90.2824 90.5144 84.9177V69.8118C90.5144 64.1647 88.1053 58.6588 83.7121 54.9882ZM30.0024 25.6235C30.0024 15.7412 38.0801 7.69412 48.0001 7.69412C57.9201 7.69412 65.9978 15.7412 65.9978 25.6235C65.9978 35.5059 57.9201 43.5529 48.0001 43.5529C38.0801 43.5529 30.0024 35.5059 30.0024 25.6235Z"
          fill="white"
          fill-opacity="1"
        />
      </svg>
      <span class="rounded"> Поручить </span>
    </div>
    <!-- Исполнитель -->
    <div
      v-else-if="taskType === 2"
      class="mt-3 tags-custom dark:bg-gray-800 dark:text-gray-100 project-hover-close"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 96 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M83.7121 54.9882C80.8778 52.5882 77.4767 50.3294 73.5087 48.6353C71.8081 47.9294 69.8241 48.6353 69.1156 50.3294C68.407 52.0235 69.1156 54 70.8161 54.7059C74.0756 56.1177 76.9098 57.9529 79.319 59.9294C82.1533 62.4706 83.8538 66 83.8538 69.8118V84.9177C83.8538 86.7529 82.295 88.1647 80.5944 88.1647H15.4058C13.5636 88.1647 12.1464 86.6118 12.1464 84.9177V69.8118C12.1464 66 13.847 62.3294 16.6813 59.9294C20.0824 56.9647 29.8607 50.1882 48.0001 50.1882C61.6047 50.1882 72.5167 39.1765 72.5167 25.7647C72.5167 12.2118 61.6047 1.2 48.0001 1.2C34.3956 1.2 23.4836 12.2118 23.4836 25.6235C23.4836 33.5294 27.3098 40.5882 33.1201 44.9647C22.4916 47.3647 15.831 51.7412 12.2881 54.8471C7.89498 58.6588 5.48584 64.1647 5.48584 69.8118V84.9177C5.48584 90.4235 10.0207 94.8 15.4058 94.8H80.5944C86.1213 94.8 90.5144 90.2824 90.5144 84.9177V69.8118C90.5144 64.1647 88.1053 58.6588 83.7121 54.9882ZM30.0024 25.6235C30.0024 15.7412 38.0801 7.69412 48.0001 7.69412C57.9201 7.69412 65.9978 15.7412 65.9978 25.6235C65.9978 35.5059 57.9201 43.5529 48.0001 43.5529C38.0801 43.5529 30.0024 35.5059 30.0024 25.6235Z"
          fill="#86D69D"
          fill-opacity="1"
        />
      </svg>
      <span> {{ getEmpNameByEmail(performerEmail) }} </span>
      <button
        class="btn-close-popover"
        @click.stop="setPerformerCurrentUser"
      >
        <svg
          width="5"
          height="5"
          viewBox="0 0 16 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.8483 2.34833C15.317 1.8797 15.317 1.11991 14.8483 0.651277C14.3797 0.182647 13.6199 0.182647 13.1513 0.651277L7.99981 5.80275L2.84833 0.651277C2.3797 0.182647 1.61991 0.182647 1.15128 0.651277C0.682647 1.11991 0.682647 1.8797 1.15128 2.34833L6.30275 7.4998L1.15128 12.6513C0.682647 13.1199 0.682647 13.8797 1.15128 14.3483C1.61991 14.817 2.3797 14.817 2.84833 14.3483L7.99981 9.19686L13.1513 14.3483C13.6199 14.817 14.3797 14.817 14.8483 14.3483C15.317 13.8797 15.317 13.1199 14.8483 12.6513L9.69686 7.4998L14.8483 2.34833Z"
            fill="black"
            fill-opacity="0.5"
          />
        </svg>
      </button>
    </div>
    <!-- Перепоручить -->
    <div
      v-else-if="taskType === 3"
      class="mt-3 tags-custom dark:bg-gray-800 dark:text-gray-100 active project-hover-close"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 96 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M83.7121 54.9882C80.8778 52.5882 77.4767 50.3294 73.5087 48.6353C71.8081 47.9294 69.8241 48.6353 69.1156 50.3294C68.407 52.0235 69.1156 54 70.8161 54.7059C74.0756 56.1177 76.9098 57.9529 79.319 59.9294C82.1533 62.4706 83.8538 66 83.8538 69.8118V84.9177C83.8538 86.7529 82.295 88.1647 80.5944 88.1647H15.4058C13.5636 88.1647 12.1464 86.6118 12.1464 84.9177V69.8118C12.1464 66 13.847 62.3294 16.6813 59.9294C20.0824 56.9647 29.8607 50.1882 48.0001 50.1882C61.6047 50.1882 72.5167 39.1765 72.5167 25.7647C72.5167 12.2118 61.6047 1.2 48.0001 1.2C34.3956 1.2 23.4836 12.2118 23.4836 25.6235C23.4836 33.5294 27.3098 40.5882 33.1201 44.9647C22.4916 47.3647 15.831 51.7412 12.2881 54.8471C7.89498 58.6588 5.48584 64.1647 5.48584 69.8118V84.9177C5.48584 90.4235 10.0207 94.8 15.4058 94.8H80.5944C86.1213 94.8 90.5144 90.2824 90.5144 84.9177V69.8118C90.5144 64.1647 88.1053 58.6588 83.7121 54.9882ZM30.0024 25.6235C30.0024 15.7412 38.0801 7.69412 48.0001 7.69412C57.9201 7.69412 65.9978 15.7412 65.9978 25.6235C65.9978 35.5059 57.9201 43.5529 48.0001 43.5529C38.0801 43.5529 30.0024 35.5059 30.0024 25.6235Z"
          fill="white"
          fill-opacity="1"
        />
      </svg>
      <span class="rounded"> Перепоручить </span>
    </div>
    <!-- Взять на исполнение -->
    <div
      v-else-if="taskType === 5"
      class="mt-3 tags-custom dark:bg-gray-800 dark:text-gray-100 active project-hover-close"
      @click.stop="setPerformerCurrentUser"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 96 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M83.7121 54.9882C80.8778 52.5882 77.4767 50.3294 73.5087 48.6353C71.8081 47.9294 69.8241 48.6353 69.1156 50.3294C68.407 52.0235 69.1156 54 70.8161 54.7059C74.0756 56.1177 76.9098 57.9529 79.319 59.9294C82.1533 62.4706 83.8538 66 83.8538 69.8118V84.9177C83.8538 86.7529 82.295 88.1647 80.5944 88.1647H15.4058C13.5636 88.1647 12.1464 86.6118 12.1464 84.9177V69.8118C12.1464 66 13.847 62.3294 16.6813 59.9294C20.0824 56.9647 29.8607 50.1882 48.0001 50.1882C61.6047 50.1882 72.5167 39.1765 72.5167 25.7647C72.5167 12.2118 61.6047 1.2 48.0001 1.2C34.3956 1.2 23.4836 12.2118 23.4836 25.6235C23.4836 33.5294 27.3098 40.5882 33.1201 44.9647C22.4916 47.3647 15.831 51.7412 12.2881 54.8471C7.89498 58.6588 5.48584 64.1647 5.48584 69.8118V84.9177C5.48584 90.4235 10.0207 94.8 15.4058 94.8H80.5944C86.1213 94.8 90.5144 90.2824 90.5144 84.9177V69.8118C90.5144 64.1647 88.1053 58.6588 83.7121 54.9882ZM30.0024 25.6235C30.0024 15.7412 38.0801 7.69412 48.0001 7.69412C57.9201 7.69412 65.9978 15.7412 65.9978 25.6235C65.9978 35.5059 57.9201 43.5529 48.0001 43.5529C38.0801 43.5529 30.0024 35.5059 30.0024 25.6235Z"
          fill="white"
          fill-opacity="1"
        />
      </svg>
      <span class="rounded"> Взять на исполнение </span>
    </div>
    <template
      #content="{ close }"
      class="bottom"
    >
      <div class="popper">
        <div
          class="text-white body-popover-custom"
          @click="close"
        >
          <div class="container-employee-popover">
            <div
              v-for="emp in employees"
              :key="emp.uid"
            >
              <div
                v-if="emp.uid !== currentUserUid"
                class="list-employee-access"
                @click="changePerformer(emp.email)"
              >
                <img
                  :src="emp.fotolink"
                  class="mr-1 border-fotolink border-solid border-2 border-sky-500"
                  width="30"
                  height="30"
                >
                <label class="employee-name-custom">
                  {{ emp.name }}
                  <div class="popover-employee-email">{{ emp.email }}</div>
                </label>
                <span
                  v-if="isCurrentPerformerEmail(emp.email)"
                  class="inline-flex justify-center items-center"
                >
                  <svg
                    viewBox="0 0 26 20"
                    width="10"
                    height="10"
                    class="inline-block"
                  >
                    <path
                      fill="currentColor"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M24.4107 1.30299C25.2766 2.02718 25.3681 3.2892 24.6148 4.1218L11.8142 18.2718C10.8103 19.3815 9.06094 19.4991 7.9062 18.5344L0.902667 12.6839C0.0362917 11.9601 -0.0558157 10.6982 0.69694 9.86518C1.44969 9.0322 2.76226 8.94364 3.62864 9.66738L9.58691 14.6447L21.4789 1.49931C22.2321 0.666707 23.5447 0.578813 24.4107 1.30299Z"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Popper>
</template>

<script>
import Popper from 'vue3-popper'

export default {
  components: {
    Popper
  },
  props: {
    currentUserUid: {
      type: String,
      default: ''
    },
    performerEmail: {
      type: String,
      default: ''
    },
    taskType: {
      type: Number,
      default: 0
    }
  },
  emits: ['changePerformer', 'reAssign'],
  computed: {
    employees () {
      return this.$store.state.employees.employees
    },
    employeesByEmail () {
      return this.$store.state.employees.employeesByEmail
    }
  },
  methods: {
    print (val) {
      console.log(val)
    },
    getEmpNameByEmail (userEmail) {
      return this.employeesByEmail[userEmail.toLowerCase()]?.name ?? userEmail
    },
    isCurrentPerformerEmail (userEmail) {
      return this.performerEmail.toLowerCase() === userEmail.toLowerCase()
    },
    setPerformerCurrentUser () {
      // ставим исполнителем себя
      const currentUserEmail = this.employees[this.currentUserUid]?.email
      this.changePerformer(currentUserEmail)
    },
    changePerformer (userEmail) {
      if (this.isCurrentPerformerEmail(userEmail)) return
      if (this.type === 3) {
        this.$emit('reAssign', userEmail)
        return
      }
      this.$emit('changePerformer', userEmail)
    }
  }
}
</script>

<style scoped></style>
