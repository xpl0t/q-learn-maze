#!/usr/bin/env node

import { Logger } from '@lib/logger';
import { printTable } from '@lib/print_table';
import { maxBy, sum } from 'lodash-es';
import { Maze } from './maze';

type Action = 'up' | 'down' | 'left' | 'right';
const actions: Action[] = [ 'up', 'down', 'left', 'right' ];

interface ActionQuality {
  up?: number;
  down?: number;
  left?: number;
  right?: number;
}

function weightedRandom<T>(items: T[], weightFn: (item: T) => number): T {
  if (items.length === 0) {
    return null;
  }

  const weights = items.map(i => weightFn(i));
  const weightSum = sum(weights);
  const rand = Math.random() * weightSum;

  let offset = 0;

  for (let i = 0; i < items.length; i++) {
    if (rand <= offset + weights[i]) {
      return items[i];
    }

    offset += weights[i];
  }

  // This part should be never reached!
  throw new Error('This function must have been implemented incorrectly! :O');
}

function chooseNextActionRandomly(): Action {
  return actions[Math.floor(Math.random() * 4)];
}

function chooseNextActionWeighted(qPos: ActionQuality): Action {
  return weightedRandom(
    Object.entries(qPos).filter(([ _, weight ]) => weight !== undefined),
    ([ _, weight ]) => weight
  )[0] as Action;
}

function debugQTable(maze: Maze, q: Map<string, ActionQuality>): void {
  const qDebugInfos = [...new Array(maze.height)].map(() => [...new Array(maze.width)].map(() => '-'));
  const floatingPoints = 2;

  for (const [ pos, actionQuality ] of q) {
    const x = +pos.split('-')[0];
    const y = +pos.split('-')[1];

    if (!qDebugInfos[y]) {
      qDebugInfos[y] = [];
    }

    qDebugInfos[y][x] = `↑${actionQuality.up?.toFixed(floatingPoints)} ↓${actionQuality.down?.toFixed(floatingPoints)} `
      + `←${actionQuality.left?.toFixed(floatingPoints)} →${actionQuality.right?.toFixed(floatingPoints)}`;
  }

  console.log();
  console.log('📃 Q table:')
  printTable(qDebugInfos);
}

async function main(): Promise<void> {
  const maze = new Maze(process.argv[process.argv.length - 1]);
  const trainingCycles = 10_000;
  const reward = 1; // Reward for reaching the goal
  const disconFactor = 0.9; // Discontinuation factor

  const q = new Map<string, ActionQuality>();

  let startTime = 0;
  let averageActionCount = 0;

  startTime = Date.now();
  // Train
  for (let i = 0; i < trainingCycles; i++) {
    // Actions taken by the agent
    const actions: [string, Action][] = [];

    while (true) {
      const posId = maze.getPosId();
      const qPos: ActionQuality = q.get(posId) ?? {};

      let nextAction = null;
      
      if (i < trainingCycles * 0.5) {
        // 50% of the training the agent performs compmetly random actions
        nextAction = chooseNextActionRandomly();
      } else {
        // 50% of the training the agent prefers the actions with higher quality rates, but sometimes trys the previously bad rated actions.
        // This is used for optimization
        nextAction = chooseNextActionWeighted(qPos);
      }
      
      actions.push([ posId, nextAction ]);

      if (nextAction === 'up') { maze.moveUp(); }
      if (nextAction === 'down') { maze.moveDown(); }
      if (nextAction === 'left') { maze.moveLeft(); }
      if (nextAction === 'right') { maze.moveRight(); }

      if (maze.isAtGoal()) {
        // Hurray!! We solved the maze :) Time to update the q values
        maze.reset();
        break;
      }
    }

    for (let k = 0; k < actions.length; k++) {
      const curDisconFactor = Math.pow(disconFactor, k);
      const [ posId, action ] = actions[actions.length - k - 1];
      const qPos = q.get(posId) ?? {};
      const qVal = reward * curDisconFactor;

      if (qPos[action] == null || qVal > qPos[action]) {
        qPos[action] = qVal;
        q.set(posId, qPos);
      }
    }

    averageActionCount = (averageActionCount * i + actions.length) / (i + 1);
  }
  
  console.log(`Training with ${trainingCycles} training cycles took ${Date.now() - startTime} milliseconds! 😎`);
  console.log(`Average count of actions to solve the maze: ${Math.floor(averageActionCount)} 🤙`);

  debugQTable(maze, q);

  // Execute best route
  console.log();
  console.log('🗺️ Best route:')
  maze.printBoard();
  while (true) {
    const posId = maze.getPosId();
    const qPos = q.get(posId);

    const nextAction = maxBy(Object.entries(qPos), x => x[1])[0];
    console.log(`Performing action: ${nextAction}`);

    if (nextAction === 'up') { maze.moveUp(); }
    if (nextAction === 'down') { maze.moveDown(); }
    if (nextAction === 'left') { maze.moveLeft(); }
    if (nextAction === 'right') { maze.moveRight(); }

    maze.printBoard();

    if (maze.isAtGoal()) {
      break;
    }
  }
}

main()
  .then()
  .catch(e => {
    Logger.error(e.message);
    process.exit(1);
  });
