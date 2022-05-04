[![.github/workflows/action-build.yml](https://github.com/LeaderTask/Web/actions/workflows/action-build.yml/badge.svg?branch=projects-and-emps&event=push)](https://github.com/LeaderTask/Web/actions/workflows/action-build.yml)
# [Leadertask Web v2.0](https://app.leadertask.ru)

[![Leadertask Web v2.0](images/leadertask_web2.png)](https://app.leadertask.ru)

**Leadertask Web 2.0** next version of existing leadertask web.

### Installation

1. Clone the repo (Vue3 project)
   ```sh
      git clone https://github.com/LeaderTask/Web.git
    ```
2. Install NPM packages
    ```sh
        npm install
    ```
3. Run the development server 
    ```sh
        npm run serve 
    ```
### Folders 
    ```sh
      Web/src:

      App.vue         // Main component
      assets
      colors.js       // tailwind theme colors 
      components      
      config.js       // config
      css
      main.js         // init App main component and define auth headers
      menu.js         
      router          // routes
      store           // vuex store
      views           // main views assembled from components

    ```
### API Documentation 
[https://web.leadertask.com/docs/ver1](https://web.leadertask.com/docs/ver1)
