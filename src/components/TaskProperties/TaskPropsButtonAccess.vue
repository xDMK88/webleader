<template>
  <Popper
    class="popper-access light"
    arrow
    trigger="hover"
    placement="bottom"
    :disabled="!canEdit"
  >
    <template
      #content="{ close }"
      class="bottom"
    >
      <div class="popper">
        <div
          class="opacity-75 font-semibold title-popover-main btn-access-popover"
          @click="close"
        >
          <button
            class="btn-clear-popover"
            @click="onCancel"
          >
            Отменить
          </button>
          <button
            class="btn-save-popover"
            @click="onSave"
          >
            <span class="title-z-popover">Сохранить</span>
          </button>
        </div>
        <div>
          <div class="container-employee-popover">
            <div
              v-for="emp in employees"
              :key="emp.uid"
            >
              <div
                v-if="emp.uid !== currentUserUid"
                class="list-employee-access"
                @click="showSaveButtons = true"
              >
                <img
                  :src="emp.fotolink"
                  class="mr-1 border-fotolink border-solid border-2 border-sky-500"
                  width="30"
                  height="30"
                >
                <input
                  :id="emp.uid"
                  type="checkbox"
                  name="check_access_employee"
                  class="custom-checkbox"
                  :checked="isCheckedEmail(emp.email)"
                  @click="onCheckEmail(emp.email)"
                >
                <label
                  class="employee-name-custom"
                  :for="emp.uid"
                >
                  <div class="popover-employee-email">
                    <div style="color: black">{{ emp.name }}</div>
                    {{ emp.email }}
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div
      v-if="accessEmails.length > 0"
      style="position: relative"
    >
      <div v-if="accessEmails.length > 1">
        <div
          v-for="(userEmail, index) in accessEmails"
          :key="index"
          class="mt-3 tags-custom-access dark:bg-gray-800 dark:text-gray-100 project-hover-close"
          :class="{ 'cursor-pointer': canEdit, 'cursor-default': !canEdit }"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 91 92"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M73.9839 48.8864C73.9839 50.6954 72.5056 52.1754 70.6989 52.1754C68.8921 52.1754 67.4139 50.6954 67.4139 48.8864V44.4723C67.4139 40.8379 64.4738 37.8943 60.8439 37.8943H13.5399C9.90998 37.8943 6.9699 40.8379 6.9699 44.4723V78.7765C6.9699 82.4109 9.90998 85.3545 13.5399 85.3545H46.2096C48.026 85.3545 49.4986 86.827 49.4986 88.6435C49.4986 90.4599 48.026 91.9324 46.2096 91.9324H13.5399C6.29648 91.9324 0.399902 86.0287 0.399902 78.7765V44.4723C0.399902 37.2201 6.29648 31.3164 13.5399 31.3164H17.4819V19.7227C17.4819 9.06645 26.335 0.400002 37.1919 0.400002C48.0488 0.400002 56.9019 9.06645 56.9019 19.7227V31.3164H60.8439C68.0873 31.3164 73.9839 37.2201 73.9839 44.4723V48.8864ZM50.3319 31.3164H24.0519V19.7227C24.0519 12.7008 29.9485 6.97795 37.1919 6.97795C44.4353 6.97795 50.3319 12.7008 50.3319 19.7227V31.3164ZM39.6617 74.5013C39.2039 72.1608 37.9572 70.1461 36.2429 68.7334C35.9442 68.4873 35.8725 68.0521 36.0635 67.7155C38.5384 63.3546 35.4507 57.5131 30.3371 57.5369C25.2466 57.5131 22.1379 63.3545 24.6108 67.7154C24.8018 68.0521 24.7301 68.4873 24.4312 68.7331C22.713 70.1458 21.4486 72.1606 21.0126 74.5013L20.0665 79.3638C19.9824 79.796 20.3133 80.1975 20.7536 80.1975H39.9207C40.3609 80.1975 40.6919 79.796 40.6078 79.3638L39.6617 74.5013ZM28.1445 64.3525C28.1445 63.1087 29.1324 62.0889 30.3371 62.0889C33.2526 62.2133 33.2526 66.4917 30.3371 66.616C29.1324 66.616 28.1445 65.5962 28.1445 64.3525ZM26.0807 75.6703C25.6477 75.6703 25.3161 75.2764 25.4414 74.8619C26.9349 69.9202 33.7153 69.9202 35.2088 74.8619C35.334 75.2764 35.0024 75.6703 34.5695 75.6703H26.0807ZM64.4788 74.5013C64.021 72.1608 62.7743 70.1461 61.06 68.7334C60.7613 68.4873 60.6896 68.0521 60.8806 67.7155C63.3555 63.3546 60.2678 57.5131 55.1542 57.5369C50.0637 57.5131 46.955 63.3545 49.4279 67.7154C49.6189 68.0521 49.5472 68.4873 49.2483 68.7331C47.5301 70.1458 46.2657 72.1606 45.8297 74.5013L44.8836 79.3638C44.7995 79.796 45.1304 80.1975 45.5707 80.1975H64.7378C65.178 80.1975 65.509 79.796 65.4249 79.3638L64.4788 74.5013ZM52.9616 64.3525C52.9616 63.1087 53.9495 62.0889 55.1542 62.0889C58.0697 62.2133 58.0697 66.4917 55.1542 66.616C53.9495 66.616 52.9616 65.5962 52.9616 64.3525ZM50.8978 75.6703C50.4648 75.6703 50.1332 75.2764 50.2585 74.8619C51.752 69.9202 58.5324 69.9202 60.0259 74.8619C60.1511 75.2764 59.8195 75.6703 59.3866 75.6703H50.8978ZM85.8771 68.7334C87.5914 70.1461 88.8381 72.1608 89.2959 74.5013L90.242 79.3638C90.3261 79.796 89.9951 80.1975 89.5549 80.1975H70.3878C69.9475 80.1975 69.6166 79.796 69.7006 79.3638L70.6468 74.5013C71.0828 72.1606 72.3472 70.1458 74.0654 68.7331C74.3643 68.4873 74.4359 68.0521 74.245 67.7154C71.7721 63.3545 74.8808 57.5131 79.9713 57.5369C85.0849 57.5131 88.1726 63.3546 85.6977 67.7155C85.5067 68.0521 85.5784 68.4873 85.8771 68.7334ZM79.9713 62.0889C78.7666 62.0889 77.7787 63.1087 77.7787 64.3525C77.7787 65.5962 78.7666 66.616 79.9713 66.616C82.8868 66.4917 82.8868 62.2133 79.9713 62.0889ZM75.0756 74.8619C74.9503 75.2764 75.2819 75.6703 75.7149 75.6703H84.2037C84.6366 75.6703 84.9682 75.2764 84.843 74.8619C83.3495 69.9202 76.5691 69.9202 75.0756 74.8619Z"
              fill="black"
              fill-opacity="0.5"
            />
          </svg>
          <span class="rounded">{{ getEmpNameByEmail(userEmail) }}</span>
          <button
            v-if="userEmail === currentUserEmail"
            class="btn-close-popover"
            @click="removeAccess(userEmail)"
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
      </div>
      <div v-else>
        <div
          class="mt-3 tags-custom-access dark:bg-gray-800 dark:text-gray-100 project-hover-close"
          :class="{ 'cursor-pointer': canEdit, 'cursor-default': !canEdit }"
        >
          <svg
            v-if="key !== 'null'"
            width="24"
            height="24"
            viewBox="0 0 91 92"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M73.9839 48.8864C73.9839 50.6954 72.5056 52.1754 70.6989 52.1754C68.8921 52.1754 67.4139 50.6954 67.4139 48.8864V44.4723C67.4139 40.8379 64.4738 37.8943 60.8439 37.8943H13.5399C9.90998 37.8943 6.9699 40.8379 6.9699 44.4723V78.7765C6.9699 82.4109 9.90998 85.3545 13.5399 85.3545H46.2096C48.026 85.3545 49.4986 86.827 49.4986 88.6435C49.4986 90.4599 48.026 91.9324 46.2096 91.9324H13.5399C6.29648 91.9324 0.399902 86.0287 0.399902 78.7765V44.4723C0.399902 37.2201 6.29648 31.3164 13.5399 31.3164H17.4819V19.7227C17.4819 9.06645 26.335 0.400002 37.1919 0.400002C48.0488 0.400002 56.9019 9.06645 56.9019 19.7227V31.3164H60.8439C68.0873 31.3164 73.9839 37.2201 73.9839 44.4723V48.8864ZM50.3319 31.3164H24.0519V19.7227C24.0519 12.7008 29.9485 6.97795 37.1919 6.97795C44.4353 6.97795 50.3319 12.7008 50.3319 19.7227V31.3164ZM39.6617 74.5013C39.2039 72.1608 37.9572 70.1461 36.2429 68.7334C35.9442 68.4873 35.8725 68.0521 36.0635 67.7155C38.5384 63.3546 35.4507 57.5131 30.3371 57.5369C25.2466 57.5131 22.1379 63.3545 24.6108 67.7154C24.8018 68.0521 24.7301 68.4873 24.4312 68.7331C22.713 70.1458 21.4486 72.1606 21.0126 74.5013L20.0665 79.3638C19.9824 79.796 20.3133 80.1975 20.7536 80.1975H39.9207C40.3609 80.1975 40.6919 79.796 40.6078 79.3638L39.6617 74.5013ZM28.1445 64.3525C28.1445 63.1087 29.1324 62.0889 30.3371 62.0889C33.2526 62.2133 33.2526 66.4917 30.3371 66.616C29.1324 66.616 28.1445 65.5962 28.1445 64.3525ZM26.0807 75.6703C25.6477 75.6703 25.3161 75.2764 25.4414 74.8619C26.9349 69.9202 33.7153 69.9202 35.2088 74.8619C35.334 75.2764 35.0024 75.6703 34.5695 75.6703H26.0807ZM64.4788 74.5013C64.021 72.1608 62.7743 70.1461 61.06 68.7334C60.7613 68.4873 60.6896 68.0521 60.8806 67.7155C63.3555 63.3546 60.2678 57.5131 55.1542 57.5369C50.0637 57.5131 46.955 63.3545 49.4279 67.7154C49.6189 68.0521 49.5472 68.4873 49.2483 68.7331C47.5301 70.1458 46.2657 72.1606 45.8297 74.5013L44.8836 79.3638C44.7995 79.796 45.1304 80.1975 45.5707 80.1975H64.7378C65.178 80.1975 65.509 79.796 65.4249 79.3638L64.4788 74.5013ZM52.9616 64.3525C52.9616 63.1087 53.9495 62.0889 55.1542 62.0889C58.0697 62.2133 58.0697 66.4917 55.1542 66.616C53.9495 66.616 52.9616 65.5962 52.9616 64.3525ZM50.8978 75.6703C50.4648 75.6703 50.1332 75.2764 50.2585 74.8619C51.752 69.9202 58.5324 69.9202 60.0259 74.8619C60.1511 75.2764 59.8195 75.6703 59.3866 75.6703H50.8978ZM85.8771 68.7334C87.5914 70.1461 88.8381 72.1608 89.2959 74.5013L90.242 79.3638C90.3261 79.796 89.9951 80.1975 89.5549 80.1975H70.3878C69.9475 80.1975 69.6166 79.796 69.7006 79.3638L70.6468 74.5013C71.0828 72.1606 72.3472 70.1458 74.0654 68.7331C74.3643 68.4873 74.4359 68.0521 74.245 67.7154C71.7721 63.3545 74.8808 57.5131 79.9713 57.5369C85.0849 57.5131 88.1726 63.3546 85.6977 67.7155C85.5067 68.0521 85.5784 68.4873 85.8771 68.7334ZM79.9713 62.0889C78.7666 62.0889 77.7787 63.1087 77.7787 64.3525C77.7787 65.5962 78.7666 66.616 79.9713 66.616C82.8868 66.4917 82.8868 62.2133 79.9713 62.0889ZM75.0756 74.8619C74.9503 75.2764 75.2819 75.6703 75.7149 75.6703H84.2037C84.6366 75.6703 84.9682 75.2764 84.843 74.8619C83.3495 69.9202 76.5691 69.9202 75.0756 74.8619Z"
              fill="black"
              fill-opacity="0.5"
            />
          </svg>
          <span class="rounded">{{ getEmpNameByEmail(accessEmails[0]) }}</span>
          <button
            v-if="userEmail === currentUserEmail"
            class="btn-close-popover"
            @click="removeAccess(userEmail)"
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
      </div>
    </div>
    <div
      v-else
      ref="btnRef"
      class="mt-3 tags-custom-access dark:bg-gray-800 dark:text-gray-100"
      :class="{ 'cursor-pointer': canEdit, 'cursor-default': !canEdit }"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 91 92"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M73.9839 48.8864C73.9839 50.6954 72.5056 52.1754 70.6989 52.1754C68.8921 52.1754 67.4139 50.6954 67.4139 48.8864V44.4723C67.4139 40.8379 64.4738 37.8943 60.8439 37.8943H13.5399C9.90998 37.8943 6.9699 40.8379 6.9699 44.4723V78.7765C6.9699 82.4109 9.90998 85.3545 13.5399 85.3545H46.2096C48.026 85.3545 49.4986 86.827 49.4986 88.6435C49.4986 90.4599 48.026 91.9324 46.2096 91.9324H13.5399C6.29648 91.9324 0.399902 86.0287 0.399902 78.7765V44.4723C0.399902 37.2201 6.29648 31.3164 13.5399 31.3164H17.4819V19.7227C17.4819 9.06645 26.335 0.400002 37.1919 0.400002C48.0488 0.400002 56.9019 9.06645 56.9019 19.7227V31.3164H60.8439C68.0873 31.3164 73.9839 37.2201 73.9839 44.4723V48.8864ZM50.3319 31.3164H24.0519V19.7227C24.0519 12.7008 29.9485 6.97795 37.1919 6.97795C44.4353 6.97795 50.3319 12.7008 50.3319 19.7227V31.3164ZM39.6617 74.5013C39.2039 72.1608 37.9572 70.1461 36.2429 68.7334C35.9442 68.4873 35.8725 68.0521 36.0635 67.7155C38.5384 63.3546 35.4507 57.5131 30.3371 57.5369C25.2466 57.5131 22.1379 63.3545 24.6108 67.7154C24.8018 68.0521 24.7301 68.4873 24.4312 68.7331C22.713 70.1458 21.4486 72.1606 21.0126 74.5013L20.0665 79.3638C19.9824 79.796 20.3133 80.1975 20.7536 80.1975H39.9207C40.3609 80.1975 40.6919 79.796 40.6078 79.3638L39.6617 74.5013ZM28.1445 64.3525C28.1445 63.1087 29.1324 62.0889 30.3371 62.0889C33.2526 62.2133 33.2526 66.4917 30.3371 66.616C29.1324 66.616 28.1445 65.5962 28.1445 64.3525ZM26.0807 75.6703C25.6477 75.6703 25.3161 75.2764 25.4414 74.8619C26.9349 69.9202 33.7153 69.9202 35.2088 74.8619C35.334 75.2764 35.0024 75.6703 34.5695 75.6703H26.0807ZM64.4788 74.5013C64.021 72.1608 62.7743 70.1461 61.06 68.7334C60.7613 68.4873 60.6896 68.0521 60.8806 67.7155C63.3555 63.3546 60.2678 57.5131 55.1542 57.5369C50.0637 57.5131 46.955 63.3545 49.4279 67.7154C49.6189 68.0521 49.5472 68.4873 49.2483 68.7331C47.5301 70.1458 46.2657 72.1606 45.8297 74.5013L44.8836 79.3638C44.7995 79.796 45.1304 80.1975 45.5707 80.1975H64.7378C65.178 80.1975 65.509 79.796 65.4249 79.3638L64.4788 74.5013ZM52.9616 64.3525C52.9616 63.1087 53.9495 62.0889 55.1542 62.0889C58.0697 62.2133 58.0697 66.4917 55.1542 66.616C53.9495 66.616 52.9616 65.5962 52.9616 64.3525ZM50.8978 75.6703C50.4648 75.6703 50.1332 75.2764 50.2585 74.8619C51.752 69.9202 58.5324 69.9202 60.0259 74.8619C60.1511 75.2764 59.8195 75.6703 59.3866 75.6703H50.8978ZM85.8771 68.7334C87.5914 70.1461 88.8381 72.1608 89.2959 74.5013L90.242 79.3638C90.3261 79.796 89.9951 80.1975 89.5549 80.1975H70.3878C69.9475 80.1975 69.6166 79.796 69.7006 79.3638L70.6468 74.5013C71.0828 72.1606 72.3472 70.1458 74.0654 68.7331C74.3643 68.4873 74.4359 68.0521 74.245 67.7154C71.7721 63.3545 74.8808 57.5131 79.9713 57.5369C85.0849 57.5131 88.1726 63.3546 85.6977 67.7155C85.5067 68.0521 85.5784 68.4873 85.8771 68.7334ZM79.9713 62.0889C78.7666 62.0889 77.7787 63.1087 77.7787 64.3525C77.7787 65.5962 78.7666 66.616 79.9713 66.616C82.8868 66.4917 82.8868 62.2133 79.9713 62.0889ZM75.0756 74.8619C74.9503 75.2764 75.2819 75.6703 75.7149 75.6703H84.2037C84.6366 75.6703 84.9682 75.2764 84.843 74.8619C83.3495 69.9202 76.5691 69.9202 75.0756 74.8619Z"
          fill="black"
          fill-opacity="0.5"
        />
      </svg>
      <span class="rounded">Доступ</span>
    </div>
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
    accessEmails: {
      type: Array,
      default: () => []
    },
    canEdit: Boolean
  },
  emits: ['changeAccess'],
  data: () => ({
    showSaveButtons: false,
    checkEmails: []
  }),
  computed: {
    employees () {
      return this.$store.state.employees.employees
    },
    employeesByEmail () {
      return this.$store.state.employees.employeesByEmail
    },
    currentUserEmail () {
      return this.employees[this.currentUserUid]?.email
    }
  },
  watch: {
    accessEmails: {
      immediate: true,
      handler: function (val) {
        this.checkEmails = [...val]
      }
    }
  },
  methods: {
    print (val) {
      console.log(val)
    },
    onCancel () {
      this.checkEmails = [...this.accessEmails]
    },
    onSave () {
      this.$emit('changeAccess', this.checkEmails)
    },
    getEmpNameByEmail (userEmail) {
      return this.employeesByEmail[userEmail.toLowerCase()]?.name ?? userEmail
    },
    removeAccess (userEmail) {
      this.onCheckEmail(userEmail)
      this.onSave()
    },
    isCheckedEmail (userEmail) {
      const index = this.checkEmails.findIndex(
        (email) => email.toLowerCase() === userEmail.toLowerCase()
      )
      return index !== -1
    },
    onCheckEmail (userEmail) {
      const index = this.checkEmails.findIndex(
        (email) => email.toLowerCase() === userEmail.toLowerCase()
      )
      if (index === -1) {
        this.checkEmails.push(userEmail)
      } else {
        this.checkEmails.splice(index, 1)
      }
    }
  }
}
</script>

<style scoped>
.popper-access .popper {
  top: 5% !important;
}
.bottom {
  position: absolute;
  top: 40%;
  left: 45%;
}
.title-popover-main {
  background-color: white;
  display: table;
  /* width: 100%; */
  opacity: 1;
  line-height: 14px;
  position: relative;
  height: 34px;
  margin: 0 auto;
}
.btn-access-popover {
  display: table;
}
.btn-clear-popover {
  width: 90px;
  height: 25px;
  font-size: 11px;
  color: gray;
  float: left;
  margin-right: 5px;
  border-radius: 7px;
  border: 1px solid gray;
}
.btn-save-popover {
  width: 90px;
  height: 25px;
  color: gray;
  border-radius: 7px;
  margin: 0 auto;
  display: table;
  font-size: 11px;
  border: 1px solid gray;
}
.title-z-popover {
  margin-top: 7px;
  cursor: pointer;
}
.container-employee-popover {
  height: 220px;
  overflow-y: auto;
  /* margin-top: 10px; */
  min-width: 220px;
}
.container-employee-popover::-webkit-scrollbar {
  width: 0px;
}
.container-employee-popover::-webkit-scrollbar-track {
  background-color: #e4e4e4;
  border-radius: 100px;
}
.container-employee-popover::-webkit-scrollbar-thumb {
  background-color: #d4aa70;
  border-radius: 100px;
}
.list-employee-access {
  display: flex;
  margin-bottom: 2px;
  margin-right: 5px;
  font-size: 12px;
}
.list-employee-access:hover {
  cursor: pointer;
}
.list-employee-access input[type='checkbox'],
.list-employee-access input[type='radio'] {
  margin-right: 10px;
  margin-top: 13px;
}
.list-employee-access img {
  height: 30px;
  border-radius: 5px;
  margin-right: 10px;
  margin-top: 5px;
}
.border-fotolink {
  border-radius: 25%;
  border: none;
}
.custom-checkbox {
  position: absolute;
  z-index: -1;
  opacity: 0;
}
.custom-checkbox + label {
  display: inline-flex;
  align-items: center;
  position: relative;
  user-select: none;
}
.custom-checkbox + label::after {
  content: '';
  display: inline-block;
  width: 1.5em;
  height: 1.5em;
  flex-shrink: 0;
  flex-grow: 0;
  position: absolute;
  right: 0;
  border-radius: 0.25em;
  margin-right: 0.5em;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 55% 100%;
}
/* стили при наведении курсора на checkbox */
.custom-checkbox:not(:disabled):not(:checked) + label:hover::after {
  border-color: #b3d7ff;
}
/* стили для активного состояния чекбокса (при нажатии на него) */
.custom-checkbox:not(:disabled):active + label::after {
  border-color: #b3d7ff;
}
/* стили для чекбокса, находящегося в фокусе */
.custom-checkbox:focus + label::after {
}
/* стили для чекбокса, находящегося в фокусе и не находящегося в состоянии checked */
.custom-checkbox:focus:not(:checked) + label::after {
}
.custom-checkbox:checked + label::after {
  background-image: url("data:image/svg+xml,%3csvg width='10' height='10' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 26 20'%3e%3cpath fill='%23000' d='M24.4107 1.30299C25.2766 2.02718 25.3681 3.2892 24.6148 4.1218L11.8142 18.2718C10.8103 19.3815 9.06094 19.4991 7.9062 18.5344L0.902667 12.6839C0.0362917 11.9601 -0.0558157 10.6982 0.69694 9.86518C1.44969 9.0322 2.76226 8.94364 3.62864 9.66738L9.58691 14.6447L21.4789 1.49931C22.2321 0.666707 23.5447 0.578813 24.4107 1.30299z'/%3e%3c/svg%3e");
}
/* стили для чекбокса, находящегося в состоянии disabled */
.custom-checkbox:disabled + label::after {
  background-color: #e9ecef;
}
.employee-name-custom {
  cursor: pointer;
  width: 100%;
}
.popover-employee-email {
  position: relative;
  top: -2px;
  color: #7d7d91;
  width: 100%;
  font-size: 12px;
  line-height: 18px;
  margin-bottom: 0px;
}
.tags-custom-access {
  padding: 4px 6px 4px 4px;
  border-radius: 5px;
  margin: 2px 2px 2px 2px;
  font-size: 12px;
  float: left;
  position: relative;
  display: flex;
  background: #f4f5f7;
}
.tags-custom-access svg {
  position: relative;
  top: 3px;
  float: left;
  display: flex;
  font-size: 18px;
  width: 17px;
  height: 17px;
  margin-right: 5px;
  color: #9e9e9e;
}
.btn-close-popover
{
  color: gray;
  margin-right: 5px;
  margin-left: 5px;
  font-size: 11px;
  display: none;
  position: absolute;
  right: 0;
  width: 15px;
  height: 15px;
  top: 7px;
  border-radius: 25px;
  -webkit-transition: all 0.7s ease;
  -moz-transition: all 0.7s ease;
  -o-transition: all 0.7s ease;
  transition: all 0.7s ease;
  background: #F4F5F7;
  animation-delay: -2s;
  opacity: 0;
  z-index: 9999;
  animation: ani 2.5s forwards;
}
.btn-close-popover svg
{
  width: 15px;
  height: 15px;
  left: 0;
  top: 0;
  padding: 2px;
  border-radius: 25px;
  border: 1px solid gray;
}
</style>
