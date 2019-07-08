/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
/*
const modules = require.getModules();
const moduleIds = Object.keys(modules);
const loadedModuleNames = moduleIds
  .filter(moduleId => modules[moduleId].isInitialized)
  .map(moduleId => modules[moduleId].verboseName);
const waitingModuleNames = moduleIds
  .filter(moduleId => !modules[moduleId].isInitialized)
  .map(moduleId => modules[moduleId].verboseName);

// make sure that the modules you expect to be waiting are actually waiting
console.log(
  'loaded:',
  loadedModuleNames.length,
  'waiting:',
  waitingModuleNames.length
);

// grab this text blob, and put it in a file named packager/modulePaths.js
console.log(`${JSON.stringify(loadedModuleNames.sort().slice(0, 30))};`);
console.log(`${JSON.stringify(loadedModuleNames.sort().slice(30, 60))};`);
console.log(`${JSON.stringify(loadedModuleNames.sort().slice(60, 90))};`);
console.log(`${JSON.stringify(loadedModuleNames.sort().slice(90, 120))};`);
console.log(`${JSON.stringify(loadedModuleNames.sort().slice(120, 150))};`);
console.log(`${JSON.stringify(loadedModuleNames.sort().slice(150, 180))};`);
console.log(`${JSON.stringify(loadedModuleNames.sort().slice(180, 210))};`);
console.log(`${JSON.stringify(loadedModuleNames.sort().slice(210, 240))};`);
console.log(`${JSON.stringify(loadedModuleNames.sort().slice(240, 270))};`);
console.log(`${JSON.stringify(loadedModuleNames.sort().slice(300, 350))};`);
console.log(`${JSON.stringify(loadedModuleNames.sort().slice(350, 380))};`);
console.log(`${JSON.stringify(loadedModuleNames.sort().slice(380, 410))};`);
console.log(`${JSON.stringify(loadedModuleNames.sort().slice(410, 440))};`);
console.log(`${JSON.stringify(loadedModuleNames.sort().slice(440, 470))};`);
console.log(`${JSON.stringify(loadedModuleNames.sort().slice(470, 500))};`);
console.log(`${JSON.stringify(loadedModuleNames.sort().slice(500, 530))};`);
console.log(`${JSON.stringify(loadedModuleNames.sort().slice(530, 560))};`);
console.log(`${JSON.stringify(loadedModuleNames.sort().slice(560, 590))};`);
console.log(`${JSON.stringify(loadedModuleNames.sort().slice(590, 620))};`);
console.log(`${JSON.stringify(loadedModuleNames.sort().slice(620, 650))};`);
console.log(`${JSON.stringify(loadedModuleNames.sort().slice(650, 680))};`);
console.log(`${JSON.stringify(loadedModuleNames.sort().slice(680, 710))};`);
console.log(`${JSON.stringify(loadedModuleNames.sort().slice(710, loadedModuleNames.length))};`);*/
AppRegistry.registerComponent(appName, () => App);
