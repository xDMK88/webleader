<template>
  <Popper
    class="popper-calendar light"
    arrow
    append-to-body="true"
    trigger="hover"
    placement="bottom"
    @open:popper="onShowCalendar"
  >
    <template
      #content="{ close }"
      class="bottom"
    >
      <div class="popper">
        <div
          class="form-inline"
          style="width: 0; display: table"
        >
          <div class="title-popover-main">
            <button
              class="btn-clear-popover"
              @click="close"
            >
              Отменить
            </button>
            <button
              class="btn-save-popover"
              @click="onSave"
              @click.stop="close"
            >
              Сохранить
            </button>
          </div>
          <DatePicker
            ref="datePicker"
            v-model="datePickerDate"
            class="border-none text-xs calendar-properties"
            style="border: none !important"
            is-range
            title-position="left"
            :masks="{ weekdays: 'WW' }"
            @dayclick="onDayClick"
          >
            <template #footer>
              <div>
                <div class="timestamp-custom">
                  Установить напоминание
                </div>
                <div class="form-group form-arrow">
                  <div class="input-group">
                    <input
                      v-model="time"
                      v-maska="'##:##'"
                      type="text"
                      placeholder="Время"
                    >
                    <span class="input-group-addon input-group-time-addon">
                      <button
                        class="toggleStartTime"
                        @click="toggleTimeSelector"
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 88 52"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M85.6569 2.34315C88.781 5.46734 88.781 10.5327 85.6569 13.6569L49.6569 49.6569C46.5327 52.781 41.4673 52.781 38.3431 49.6569L2.34315 13.6569C-0.781052 10.5327 -0.781052 5.46734 2.34315 2.34315C5.46734 -0.781049 10.5327 -0.781049 13.6569 2.34315L44 32.6863L74.3431 2.34315C77.4673 -0.781049 82.5327 -0.781049 85.6569 2.34315Z"
                            fill="black"
                            fill-opacity="0.5"
                          />
                        </svg>
                      </button>
                    </span>
                  </div>
                </div>
                <div
                  v-if="showTimeSelector"
                  class="showtimeselector"
                >
                  <div class="col-md-3 col-time-custome">
                    <div
                      v-for="(key, value) in 6"
                      :key="value"
                      class="form_radio_btn"
                    >
                      <input
                        :id="'c1' + value"
                        type="radio"
                        :value="pad2(value) + ':00'"
                        name="radio"
                        :checked="
                          pad2(new Date(dateBegin).getHours()) +
                            ':' +
                            pad2(new Date(dateBegin).getMinutes()) ===
                            pad2(value) + ':00'
                        "
                        @change="calendarTimeChange"
                      >
                      <label :for="'c1' + value">{{ pad2(value) }}:00</label>
                    </div>
                  </div>
                  <div class="col-md-3 col-time-custome">
                    <div
                      v-for="(key, value) in 6"
                      :key="value"
                      class="form_radio_btn"
                    >
                      <input
                        :id="'c2' + value"
                        type="radio"
                        :value="pad2(value + 6) + ':00'"
                        name="radio"
                        :checked="
                          pad2(new Date(dateBegin).getHours()) +
                            ':' +
                            pad2(new Date(dateBegin).getMinutes()) ===
                            pad2(value + 6) + ':00'
                        "
                        @change="calendarTimeChange"
                      >
                      <label
                        :for="'c2' + value"
                      >{{ pad2(value + 6) }}:00</label>
                    </div>
                  </div>
                  <div class="col-md-3 col-time-custome">
                    <div
                      v-for="(key, value) in 6"
                      :key="value"
                      class="form_radio_btn"
                    >
                      <input
                        :id="'c3' + value"
                        type="radio"
                        :value="value + 12 + ':00'"
                        name="radio"
                        :checked="
                          pad2(new Date(dateBegin).getHours()) +
                            ':' +
                            pad2(new Date(dateBegin).getMinutes()) ===
                            value + 12 + ':00'
                        "
                        @change="calendarTimeChange"
                      >
                      <label :for="'c3' + value">{{ value + 12 }}:00</label>
                    </div>
                  </div>
                  <div class="col-md-3 col-time-custome">
                    <div
                      v-for="(key, value) in 6"
                      :key="value"
                      class="form_radio_btn"
                    >
                      <input
                        :id="'c4' + value"
                        type="radio"
                        :value="value + 18 + ':00'"
                        name="radio"
                        :checked="
                          pad2(new Date(dateBegin).getHours()) +
                            ':' +
                            pad2(new Date(dateBegin).getMinutes()) ===
                            value + 18 + ':00'
                        "
                        @change="calendarTimeChange"
                      >
                      <label :for="'c4' + value">{{ value + 18 }}:00</label>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </DatePicker>
        </div>
      </div>
    </template>
    <a
      class="mt-3 tags-custom dark:bg-gray-800 dark:text-gray-100 any-calendar project-hover-close"
    >
      <span
        v-if="dateText !== ''"
        class="flex"
      >
        <button class="btn-calendar">
          <svg
            width="24"
            height="24"
            viewBox="0 0 88 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M17.5998 4.80001C17.5998 2.48041 19.4802 0.600006 21.7998 0.600006C24.1194 0.600006 25.9998 2.48041 25.9998 4.80001V7.8H61.9998V4.80001C61.9998 2.48041 63.8802 0.600006 66.1998 0.600006C68.5194 0.600006 70.3998 2.48041 70.3998 4.8V7.8H77.5998C82.9017 7.8 87.1998 12.0981 87.1998 17.4V79.8C87.1998 85.1019 82.9017 89.4 77.5998 89.4H10.3998C5.09787 89.4 0.799805 85.1019 0.799805 79.8V17.4C0.799805 12.0981 5.09787 7.8 10.3998 7.8H17.5998V4.80001ZM61.9998 14.4V19.2C61.9998 21.5196 63.8802 23.4 66.1998 23.4C68.5194 23.4 70.3998 21.5196 70.3998 19.2V14.4H77.5998C79.2567 14.4 80.5998 15.7431 80.5998 17.4V79.8C80.5998 81.4568 79.2567 82.8 77.5998 82.8H10.3998C8.74295 82.8 7.3998 81.4568 7.3998 79.8V17.4C7.3998 15.7431 8.74295 14.4 10.3998 14.4H17.5998V19.2C17.5998 21.5196 19.4802 23.4 21.7998 23.4C24.1194 23.4 25.9998 21.5196 25.9998 19.2V14.4H61.9998ZM19.9998 42.2348C19.9998 40.5779 21.343 39.2348 22.9998 39.2348H26.3911C28.048 39.2348 29.3911 40.5779 29.3911 42.2348V45.6261C29.3911 47.2829 28.048 48.6261 26.3911 48.6261H22.9998C21.343 48.6261 19.9998 47.2829 19.9998 45.6261V42.2348ZM39.8259 42.2348C39.8259 40.5779 41.1691 39.2348 42.8259 39.2348H46.2172C47.8741 39.2348 49.2172 40.5779 49.2172 42.2348V45.6261C49.2172 47.2829 47.8741 48.6261 46.2172 48.6261H42.8259C41.1691 48.6261 39.8259 47.2829 39.8259 45.6261V42.2348ZM61.6085 39.2348C59.9517 39.2348 58.6085 40.5779 58.6085 42.2348V45.6261C58.6085 47.2829 59.9517 48.6261 61.6085 48.6261H64.9998C66.6567 48.6261 67.9998 47.2829 67.9998 45.6261V42.2348C67.9998 40.5779 66.6567 39.2348 64.9998 39.2348H61.6085ZM22.9998 58.4348C21.343 58.4348 19.9998 59.7779 19.9998 61.4348V64.8261C19.9998 66.4829 21.343 67.8261 22.9998 67.8261H26.3911C28.048 67.8261 29.3911 66.4829 29.3911 64.8261V61.4348C29.3911 59.7779 28.048 58.4348 26.3911 58.4348H22.9998ZM42.8259 58.4348C41.1691 58.4348 39.8259 59.7779 39.8259 61.4348V64.8261C39.8259 66.4829 41.1691 67.8261 42.8259 67.8261H46.2172C47.8741 67.8261 49.2172 66.4829 49.2172 64.8261V61.4348C49.2172 59.7779 47.8741 58.4348 46.2172 58.4348H42.8259ZM58.6085 61.4348C58.6085 59.7779 59.9517 58.4348 61.6085 58.4348H64.9998C66.6567 58.4348 67.9998 59.7779 67.9998 61.4348V64.8261C67.9998 66.4829 66.6567 67.8261 64.9998 67.8261H61.6085C59.9517 67.8261 58.6085 66.4829 58.6085 64.8261V61.4348Z"
              fill="#3FBF64"
              fill-opacity="1"
            />
          </svg>
        </button>
        <span>{{ dateText }}</span>
        <button
          class="btn-close-popover"
          @click.stop="resetCalendar"
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
      </span>
      <span
        v-else
        class="flex"
      >
        <button class="btn-calendar">
          <svg
            width="24"
            height="24"
            viewBox="0 0 88 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M17.5998 4.80001C17.5998 2.48041 19.4802 0.600006 21.7998 0.600006C24.1194 0.600006 25.9998 2.48041 25.9998 4.80001V7.8H61.9998V4.80001C61.9998 2.48041 63.8802 0.600006 66.1998 0.600006C68.5194 0.600006 70.3998 2.48041 70.3998 4.8V7.8H77.5998C82.9017 7.8 87.1998 12.0981 87.1998 17.4V79.8C87.1998 85.1019 82.9017 89.4 77.5998 89.4H10.3998C5.09787 89.4 0.799805 85.1019 0.799805 79.8V17.4C0.799805 12.0981 5.09787 7.8 10.3998 7.8H17.5998V4.80001ZM61.9998 14.4V19.2C61.9998 21.5196 63.8802 23.4 66.1998 23.4C68.5194 23.4 70.3998 21.5196 70.3998 19.2V14.4H77.5998C79.2567 14.4 80.5998 15.7431 80.5998 17.4V79.8C80.5998 81.4568 79.2567 82.8 77.5998 82.8H10.3998C8.74295 82.8 7.3998 81.4568 7.3998 79.8V17.4C7.3998 15.7431 8.74295 14.4 10.3998 14.4H17.5998V19.2C17.5998 21.5196 19.4802 23.4 21.7998 23.4C24.1194 23.4 25.9998 21.5196 25.9998 19.2V14.4H61.9998ZM19.9998 42.2348C19.9998 40.5779 21.343 39.2348 22.9998 39.2348H26.3911C28.048 39.2348 29.3911 40.5779 29.3911 42.2348V45.6261C29.3911 47.2829 28.048 48.6261 26.3911 48.6261H22.9998C21.343 48.6261 19.9998 47.2829 19.9998 45.6261V42.2348ZM39.8259 42.2348C39.8259 40.5779 41.1691 39.2348 42.8259 39.2348H46.2172C47.8741 39.2348 49.2172 40.5779 49.2172 42.2348V45.6261C49.2172 47.2829 47.8741 48.6261 46.2172 48.6261H42.8259C41.1691 48.6261 39.8259 47.2829 39.8259 45.6261V42.2348ZM61.6085 39.2348C59.9517 39.2348 58.6085 40.5779 58.6085 42.2348V45.6261C58.6085 47.2829 59.9517 48.6261 61.6085 48.6261H64.9998C66.6567 48.6261 67.9998 47.2829 67.9998 45.6261V42.2348C67.9998 40.5779 66.6567 39.2348 64.9998 39.2348H61.6085ZM22.9998 58.4348C21.343 58.4348 19.9998 59.7779 19.9998 61.4348V64.8261C19.9998 66.4829 21.343 67.8261 22.9998 67.8261H26.3911C28.048 67.8261 29.3911 66.4829 29.3911 64.8261V61.4348C29.3911 59.7779 28.048 58.4348 26.3911 58.4348H22.9998ZM42.8259 58.4348C41.1691 58.4348 39.8259 59.7779 39.8259 61.4348V64.8261C39.8259 66.4829 41.1691 67.8261 42.8259 67.8261H46.2172C47.8741 67.8261 49.2172 66.4829 49.2172 64.8261V61.4348C49.2172 59.7779 47.8741 58.4348 46.2172 58.4348H42.8259ZM58.6085 61.4348C58.6085 59.7779 59.9517 58.4348 61.6085 58.4348H64.9998C66.6567 58.4348 67.9998 59.7779 67.9998 61.4348V64.8261C67.9998 66.4829 66.6567 67.8261 64.9998 67.8261H61.6085C59.9517 67.8261 58.6085 66.4829 58.6085 64.8261V61.4348Z"
              fill="black"
              fill-opacity="0.5"
            />
          </svg></button><span><span>Выбрать дату</span></span>
      </span>
    </a>
  </Popper>
</template>

<script>
import Popper from 'vue3-popper'
import { DatePicker } from 'v-calendar'
import { maska } from 'maska'

export default {
  components: {
    Popper,
    DatePicker
  },
  directives: {
    maska
  },
  props: {
    dateBegin: {
      type: String,
      default: ''
    },
    dateEnd: {
      type: String,
      default: ''
    },
    dateText: {
      type: String,
      default: ''
    }
  },
  emits: ['changeDates'],
  data: () => ({
    datePickerDate: {
      date: new Date()
    },
    date: null,
    time: '',
    canEdit: true,
    showTimeSelector: false
  }),
  methods: {
    pad2 (n) {
      return (n < 10 ? '0' : '') + n.toString()
    },
    getDateValue () {
      if (this.dateBegin !== '0001-01-01T00:00:00') {
        return new Date(this.dateBegin)
      }
      return null
    },
    getTimeValue () {
      if (
        this.dateBegin !== '0001-01-01T00:00:00' &&
        this.dateEnd !== '0001-01-01T00:00:00'
      ) {
        const begin = new Date(this.dateBegin)
        const end = new Date(this.dateEnd)
        if (
          begin.getHours() !== 0 ||
          begin.getMinutes() !== 0 ||
          begin.getSeconds() !== 0 ||
          end.getHours() !== 23 ||
          end.getMinutes() !== 59 ||
          end.getSeconds() !== 59
        ) {
          const hours = this.pad2(begin.getHours())
          const minutes = this.pad2(begin.getMinutes())
          return `${hours}:${minutes}`
        }
      }
      return ''
    },
    getValidTimeString () {
      const [hoursStr, minutesStr] = this.time.split(':')
      if (
        Number(hoursStr) >= 0 &&
        Number(hoursStr) < 24 &&
        Number(minutesStr) >= 0 &&
        Number(minutesStr) < 60
      ) {
        const hours = this.pad2(Number(hoursStr))
        const minutes = this.pad2(Number(minutesStr))
        return `${hours}:${minutes}`
      }
      return ''
    },
    onShowCalendar () {
      // устанавливаем выбранную дату в календарике
      this.date = this.getDateValue()
      const moveDate = this.date ? new Date(this.date) : new Date()
      this.$refs.datePicker.move(moveDate)
      this.$refs.datePicker.updateValue(new Date(this.date))
      // устанавливаем время
      this.time = this.getTimeValue()
    },
    onDayClick (day) {
      // не даём развыделять календарь
      if (this.datePickerDate === null) {
        this.$refs.datePicker.updateValue(day.date)
      }
    },
    toggleTimeSelector () {
      this.showTimeSelector = !this.showTimeSelector
    },
    calendarTimeChange (event) {
      const timeValue = event.target.value
      this.time = timeValue
    },
    onSave () {
      if (this.datePickerDate === null || !Number(this.datePickerDate)) return
      const year = this.pad2(this.datePickerDate.getFullYear())
      const month = this.pad2(this.datePickerDate.getMonth() + 1)
      const day = this.pad2(this.datePickerDate.getDate())
      const time = this.getValidTimeString()
      const dateString = `${year}-${month}-${day}`
      const timeBegin = time ? time + ':00' : '00:00:00'
      const timeEnd = time ? time + ':00' : '23:59:59'
      const begin = `${dateString}T${timeBegin}`
      const end = `${dateString}T${timeEnd}`
      this.$emit('changeDates', begin, end)
    },
    resetCalendar () {
      const begin = '0001-01-01T00:00:00'
      const end = '0001-01-01T00:00:00'
      this.$emit('changeDates', begin, end)
    }
  }
}
</script>

<style scoped>
.popper-calendar .popper {
  top: 5% !important;
}
</style>
