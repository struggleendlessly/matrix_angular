import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('matrixCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = 'アカサタナハマヤラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fontSize = 32;
    const columns = Math.floor(canvas.width / fontSize);
    const rows = Math.floor(canvas.height / fontSize);
    // const columns = 10;
    // const rows = 20;

    // 2D array: symbols[column][row]
    const symbols: string[][] = Array.from({ length: columns }, () =>
      Array.from({ length: rows }, () => '')
    );

    // const symbols: string[][] = Array.from({ length: columns }, () =>
    //   Array.from({ length: rows }, () => letters.charAt(Math.floor(Math.random() * letters.length)))
    // );
    function generateSpeed()
    {
      return Math.random() / 10;
    }
    const snakeFill = Array.from({ length: columns }, () => 0);
    const snakeLength = Array.from({ length: columns }, () => Math.floor(Math.random() * 10 + 3));
    const snakeStart = Array.from({ length: columns }, () => Math.floor(Math.random() * 10));
    const speeds: number[] = Array.from({ length: columns }, () => generateSpeed() );
    const delays: number[] = Array.from({ length: columns }, () => 0);

    let lastTime = performance.now();

    function processSnake(i: number) {

      let snakeEnd = snakeStart[i] + snakeFill[i] + 1;
      if (snakeEnd >= rows) {
        snakeEnd = rows;
      }

      for (let j = snakeStart[i]; j < snakeEnd; j++) {
        symbols[i][j] = letters.charAt(Math.floor(Math.random() * letters.length));
      }

      snakeFill[i]++;
      symbols[i][snakeStart[i] - 1] = '';

      if (snakeStart[i] + snakeFill[i] + 1 >= rows) {
        snakeFill[i]--;
        snakeStart[i]++;
      }

      if (snakeStart[i] == rows) {
        snakeStart[i] = Math.floor(Math.random() * 10);
        speeds[i] = generateSpeed();
        snakeFill[i] = 0;
      }

      // Draw the entire column
      for (let j = 0; j < rows; j++) {
        ctx.fillStyle = '#0F0';
        ctx.fillText(symbols[i][j], i * fontSize, j * fontSize);
      }
    }

    function cleanSnake(i: number) {
      for (let j = 0; j < rows; j++) {

        ctx.fillStyle = 'black'; // Set fill color to black
        ctx.fillRect(i * fontSize, j * fontSize, fontSize, fontSize); // Draw black square

      }

    }


    function drawMatrix(now: number) {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      // ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < columns; i++) {
        if (delays[i] == 0) {
          processSnake(i);
          delays[i] += delta;
        }
        else if (delays[i] >= speeds[i]) {
          delays[i] = 0;

          cleanSnake(i);
        }
        else {
          delays[i] += delta;
          continue;
        }

      }

      requestAnimationFrame(drawMatrix);
    }

    requestAnimationFrame(drawMatrix);
  }
}