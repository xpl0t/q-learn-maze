import { printTable } from '@lib/print_table';
import { readFileSync } from 'fs';

export interface MazePos {
  x: number;
  y: number;
}

export class Maze {

  private board: string[][];
  public width = 4;
  public height = 3;

  private startPos: MazePos;
  private pos: MazePos;

  constructor(templatePath?: string) {
    let template = readFileSync(templatePath, { encoding: 'utf8' }).replaceAll('\r', '');
    const playerIndex = template.indexOf('P'); // Find player position
    if (playerIndex === -1) {
      throw new Error(`No player position could be determined! Ensure that the maze "${templatePath}" has the player position set! ("P" character somewhere)`);
    }
    
    template = template.replace('P', ' ');

    this.board = template.split('\n').map(row => row.split(''));
    this.height = this.board.length;
    this.width = this.board[0].length;

    if (this.board.some(r => r.length !== this.width)) {
      throw new Error(`Not every line has the same length! Maze file: "${templatePath}"`);
    }

    this.startPos = { x: playerIndex % (this.width + 1), y: Math.floor(playerIndex / (this.width + 1)) };
    this.pos = structuredClone(this.startPos);
  }

  private isWall(x: number, y: number): boolean {
    return this.board[y][x] === '#';
  }

  isAtGoal(): boolean {
    return this.board[this.pos.y][this.pos.x] === 'X';
  }

  getPosId(): string {
    return `${this.pos.x}-${this.pos.y}`;
  }

  moveUp(): void {
    if (this.pos.y > 0 && !this.isWall(this.pos.x, this.pos.y - 1)) {
      this.pos.y--;
    }
  }

  moveDown(): void {
    if (this.pos.y < this.height - 1 && !this.isWall(this.pos.x, this.pos.y + 1)) {
      this.pos.y++;
    }
  }

  moveLeft(): void {
    if (this.pos.x > 0 && !this.isWall(this.pos.x - 1, this.pos.y)) {
      this.pos.x--;
    }
  }

  moveRight(): void {
    if (this.pos.x < this.width - 1 && !this.isWall(this.pos.x + 1, this.pos.y)) {
      this.pos.x++;
    }
  }

  reset(): void {
    this.pos = structuredClone(this.startPos);
  }

  printBoard(): void {
    const printBoard = structuredClone(this.board);
    printBoard[this.pos.y][this.pos.x] = 'P';

    printTable(printBoard);
  }

}