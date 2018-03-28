import { Component } from '@angular/core';
import * as _ from "lodash";
import { AfterViewInit } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
	title = 'app';
	canvas;
	context;
	height: number;
	width: number;
	gravity: number = 0.05;
	reduce: number = 0.7;
	balls = [];
	firstBall: boolean = true;

	ngAfterViewInit() {
		//create canvas reference after view is loaded completely
		this.canvas = document.getElementById('court');
		this.context = this.canvas.getContext('2d');
		this.height = this.canvas.height = 500;
		this.width = this.canvas.width = 500;
	}

	//animation function
	//clears canvas, loops through array of balls
	//draws ball, advance ball location with added gravity and reduction
	//change direction if ball hits borders
	//restarts function
	animate () {
		this.context.clearRect(0,0, this.width, this.height);
		_.forEach(this.balls, (ball) => {
			this.context.beginPath();
			this.context.arc(ball.x, ball.y, 10, 0, Math.PI * 2, false);
			this.context.closePath();
			this.context.fill();
			if (ball.y <10) {
				ball.y = 11;
			}
			ball.x += ball.vx;
			ball.y += ball.vy;
			if(ball.y + 10 >= this.height || ball.y - 10 <= 0) {
				ball.vy = -ball.vy * this.reduce;
				ball.vx *= this.reduce;
			} else {
				ball.vy += this.gravity;
			}
			if(ball.x + 10 >= this.width || ball.x - 10 <= 0) {
				ball.vx = -ball.vx;
			}
		});
		requestAnimationFrame(this.animate.bind(this));
	}

	//creates ball at click location
	//click location tested for Chrome, Firefox, Edge, Opera, IE11
	//adds ball to balls array with random direction/speed
	//start animation function if this is the first ball
	addBall (event: any){
		let x: number = event.x - event.target.offsetLeft;
		let y: number = event.y - event.target.offsetTop;
		if (x<=10 || x>=this.width -10) {
			x = x<=10? 11 : this.width -11;
		}
		if (y<=10 || y>=this.height -10) {
			y = y<=10 ? 11 : this.height -11;
		}
		this.balls.push({
			x:x,
			y:y,
			vx: (Math.random() -0.5)* Math.abs(Math.random()*10),
			vy: (Math.random() -0.5)* Math.abs(Math.random()*10)
		});
		if (this.firstBall) {
			this.animate();
			this.firstBall = false;
		}
	}

}

