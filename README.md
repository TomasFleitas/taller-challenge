# Project Setup Instructions

## ToDo List Project

This project contains all the components needed for the ToDo list functionality. The components in this project are designed to be served and used in the `todoConsumer` project as a micro frontend.

## Storage Implementation
The idea behind this project was to create a storage that allows being listened to, in such a way that it doesn't depend on different levels of React for rerendering. The storage is global and will only trigger rerendering in the components that are listening to the state within the namespace.

### How to Run

1. Navigate to the project directory:
   ```bash
   cd todoList
   ```
2. Install the dependencies:
   ```bash
   npm i
   ```
3. Start the project:
   ```bash
   npm run start:live
   ```

## Project URL

You can access the ToDo List project at:
https://taller-challenge-list.web.app/

## ToDo Consumer Project
This project provides an example of how to use the TodoHeader and TodoContainer components from the todoList project. The idea is to utilize this as a micro frontend.

### How to Run

1. Navigate to the project directory:
   ```bash
   cd todoConsumer
   ```
2. Install the dependencies:
   ```bash
   npm i
   ```
3. Start the project:
   ```bash
   npm run start:live
   ```
  
## Project URL
You can access the ToDo Consumer project at:
https://taller-challenge-consumer.web.app/

Both projects are hosted online and can be accessed via the provided URL.