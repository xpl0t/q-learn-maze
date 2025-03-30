# Reinforcement Learning: Q-Learn Maze Solver 🔥

This is the an implementation for solving mazes with the q-learn algorithm.

While training, a q table is created rating the maximum quality an action has in a given state.

After the training, the agent is able to navigate the maze efficiently.

## How to run 🚗

Install packages:

```sh
npm install
```

Run:

```sh
npm start
```

## Sample output

```txt
Training with 100000 training cycles took 1722 milliseconds! 😎
Average count of actions to solve the maze: 43 🤙

📃 Q table:
+-------------------------+-------------------------+-------------------------+-------------------------+
| ↑0.73 ↓0.66 ←0.73 →0.81 | ↑0.81 ↓0.81 ←0.73 →0.90 | ↑0.90 ↓0.90 ←0.81 →1.00 | -                       |
+-------------------------+-------------------------+-------------------------+-------------------------+
| ↑0.73 ↓0.59 ←0.66 →0.66 | -                       | -                       | ↑1.00 ↓0.81 ←0.90 →0.90 |
+-------------------------+-------------------------+-------------------------+-------------------------+
| ↑0.66 ↓0.59 ←0.59 →0.66 | ↑0.66 ↓0.66 ←0.59 →0.73 | ↑0.73 ↓0.73 ←0.66 →0.81 | ↑0.90 ↓0.81 ←0.73 →0.81 |
+-------------------------+-------------------------+-------------------------+-------------------------+

🗺️ Best route:
+---+---+---+---+
|   |   |   | X |
+---+---+---+---+
|   | # | # |   |
+---+---+---+---+
| ℗ |   |   |   |
+---+---+---+---+
Performing action: right
+---+---+---+---+
|   |   |   | X |
+---+---+---+---+
|   | # | # |   |
+---+---+---+---+
|   | ℗ |   |   |
+---+---+---+---+
Performing action: right
+---+---+---+---+
|   |   |   | X |
+---+---+---+---+
|   | # | # |   |
+---+---+---+---+
|   |   | ℗ |   |
+---+---+---+---+
Performing action: right
+---+---+---+---+
|   |   |   | X |
+---+---+---+---+
|   | # | # |   |
+---+---+---+---+
|   |   |   | ℗ |
+---+---+---+---+
Performing action: up
+---+---+---+---+
|   |   |   | X |
+---+---+---+---+
|   | # | # | ℗ |
+---+---+---+---+
|   |   |   |   |
+---+---+---+---+
Performing action: up
+---+---+---+---+
|   |   |   | ℗ |
+---+---+---+---+
|   | # | # |   |
+---+---+---+---+
|   |   |   |   |
+---+---+---+---+
```

## Maze templates

Maze templates can be found in the folder mazes.
