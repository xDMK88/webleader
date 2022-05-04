<template>
  <div class="messages">
    <div
      v-for="(message, index) in taskMessages"
      :key="index"
      class="message"
    >
      <div
        v-if="
          index == taskMessages.length - 1 ||
            index == taskMessages.length - 2 ||
            showAllMessages
        "
      >
        <div
          v-if="
            index == 0 ||
              (taskMessages[index - 1] &&
                new Date(taskMessages[index - 1].date_create).toDateString() !=
                new Date(message.date_create).toDateString())
          "
          class="text-center"
        >
          <p class="text-xs text-gray-500 dark:text-gray-300 my-3">
            {{
              new Date(message.date_create).toLocaleString('default', {
                weekday: 'long'
              })
            }},
            {{ new Date(message.date_create).getDate() }}
            {{
              new Date(message.date_create).toLocaleString('default', {
                month: 'short'
              })
            }}
          </p>
        </div>

        <!-- Chat message interlocutor -->
        <div
          v-if="
            message.uid_creator !== currentUserUid &&
              !message.uid_file &&
              !showOnlyFiles
          "
        >
          <div
            v-if="
              index == 0 ||
                (taskMessages[index - 1] &&
                  taskMessages[index - 1].uid_creator != message.uid_creator)
            "
            class="flex"
          >
            <p
              v-if="employees[message.uid_creator]"
              class="name-chat-custom dark:text-gray-100"
            >
              {{ employees[message.uid_creator].name }}
            </p>
          </div>
          <div class="chat-main">
            <div
              class="mt-1 msg-custom-chat-left text-sm bg-[#EDF7ED] dark:bg-gray-800 dark:text-gray-100"
            >
              <div
                v-linkify:options="{ className: 'text-blue-600' }"
                v-html="message.msg.replaceAll('\n', '<br/>')"
              />
              <div
                v-if="message.date_create"
                class="time-chat dark:text-gray-300"
              >
                {{ getMessageTimeString(message.date_create) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Chat file interlocutor -->
        <div v-if="message.uid_creator !== currentUserUid && message.uid_file">
          <div
            v-if="
              index == 0 ||
                (taskMessages[index - 1] &&
                  taskMessages[index - 1].uid_creator != message.uid_creator)
            "
            class="flex"
          >
            <p
              v-if="employees[message.uid_creator]"
              class="name-chat-custom"
            >
              {{ employees[message.uid_creator].name }}
            </p>
          </div>
          <div class="chat-main">
            <div
              class="mt-1 msg-custom-chat-left bg-[#EDF7ED] dark:bg-gray-800 text-sm items-center"
            >
              <FileMessage :file="message" />
              <div>
                <div>
                  {{ message.msg }}
                </div>
                <div
                  v-if="message.date_create"
                  class="mt-1 flex justify-between text-gray-400 dark:text-gray-300 text-xs"
                >
                  <p>{{ formatBytes(message.file_size) }}</p>
                  <p>{{ getMessageTimeString(message.date_create) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat message from myself -->
        <div
          v-if="
            message.uid_creator == currentUserUid &&
              !message.uid_file &&
              !showOnlyFiles
          "
        >
          <div class="table-cell float-right">
            <div
              v-if="
                index == 0 ||
                  (taskMessages[index - 1] &&
                    taskMessages[index - 1].uid_creator != message.uid_creator)
              "
              class="chat-author-custom-right"
            >
              <p
                v-if="employees[message.uid_creator]"
                class="name-chat-custom dark:text-gray-100"
              >
                {{ employees[message.uid_creator].name }}
              </p>
            </div>
          </div>
          <div class="chat-main">
            <div
              class="mt-1 msg-custom-chat-right bg-[#FCEAEA] dark:bg-gray-800 text-sm dark:text-gray-100"
            >
              <ChatLoader v-if="uploadStarted && message.loading" />
              <div
                v-linkify
                v-html="message.msg.replaceAll('\n', '<br/>')"
              />
              <div
                v-if="message.date_create"
                class="time-chat dark:text-gray-300"
              >
                {{ getMessageTimeString(message.date_create) }}
              </div>
            </div>
          </div>
        </div>

        <div v-if="message.uid_creator == currentUserUid && message.uid_file">
          <div class="table-cell float-right">
            <div
              v-if="
                index == 0 ||
                  (taskMessages[index - 1] &&
                    taskMessages[index - 1].uid_creator != message.uid_creator)
              "
              class="chat-author-custom-right"
            >
              <p
                v-if="employees[message.uid_creator]"
                class="name-chat-custom dark:text-gray-100"
              >
                {{ employees[message.uid_creator].name }}
              </p>
            </div>
          </div>
          <div class="chat-main">
            <div
              class="mt-1 msg-custom-chat-right bg-[#FCEAEA] dark:bg-gray-800 text-sm"
            >
              <FileMessage :file="message" />
              <div>
                <div>
                  {{ message.msg }}
                </div>
                <div
                  v-if="message.date_create && message.file_size"
                  class="mt-1 flex justify-between text-gray-400 dark:text-gray-300 text-xs"
                >
                  <p>{{ formatBytes(message.file_size) }}</p>
                  <p>{{ getMessageTimeString(message.date_create) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChatLoader from '@/components/properties/ChatLoader'
import FileMessage from '@/components/properties/FileMessage.vue'
import linkify from 'vue-linkify'

export default {
  directives: {
    linkify
  },
  components: {
    ChatLoader,
    FileMessage
  },
  props: {
    currentUserUid: {
      type: String,
      default: ''
    },
    taskMessages: {
      type: Object,
      default: () => ({})
    },
    showAllMessages: {
      type: Boolean,
      default: true
    },
    showOnlyFiles: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    employees () {
      return this.$store.state.employees.employees
    },
    uploadStarted () {
      return this.$store.state.taskfilesandmessages.uploadStarted
    }
  },
  methods: {
    print (val) {
      console.log(val)
    },
    getMessageTimeString (dateCreate) {
      // добавляем Z в конец, чтобы он посчитал что это UTC время
      const date = new Date(dateCreate + 'Z')
      return date.toLocaleString('default', {
        hour: 'numeric',
        minute: 'numeric'
      })
    },
    formatBytes (bytes, decimals = 2) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const dm = decimals < 0 ? 0 : decimals
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    }
  }
}
</script>

<style scoped>
.name-chat-custom {
  font-size: 13px;
  color: #a6a6a6;
}
.chat-author-custom-right {
  text-align: right;
  float: right;
  /* width: 100%; */
  display: flex;
}
.chat-main {
  width: 100%;
  display: inline-block;
}
.msg-custom-chat-left {
  float: left;
  padding: 8px 10px;
  min-height: 40px;
  display: table-cell;
  max-width: 85%;
  min-width: 150px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}
.msg-custom-chat-right {
  float: right;
  padding: 8px 10px;
  min-height: 40px;
  display: table-cell;
  max-width: 85%;
  min-width: 150px;
  border-top-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}
.time-chat {
  text-align: right;
  font-size: 12px;
  color: #a8afca;
}
</style>
