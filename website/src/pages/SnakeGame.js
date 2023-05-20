import React, { useState, useEffect } from 'react';
import '../App.css';

const SnakeGame = () => {
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState({ x: 20, y: 20 });
    const [direction, setDirection] = useState('RIGHT');
    const [speed, setSpeed] = useState(200);

    const getRandomCoordinates = () => {
        let min = 1;
        let max = 98;
        let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
        let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
        return { x, y };
    };

    const enlargeSnake = () => {
        let newSnake = [...snake];
        newSnake.unshift({});
        setSnake(newSnake);
    };

    const moveSnake = () => {
        let dots = [...snake];
        let head = dots[dots.length - 1];

        switch (direction) {
            case 'RIGHT':
                head = { x: head.x + 2, y: head.y };
                break;
            case 'LEFT':
                head = { x: head.x - 2, y: head.y };
                break;
            case 'DOWN':
                head = { x: head.x, y: head.y + 2 };
                break;
            case 'UP':
                head = { x: head.x, y: head.y - 2 };
                break;
            default:
                break;
        }
        dots.push(head);
        dots.shift();
        setSnake(dots);
    };

    const checkIfAteFood = () => {
        let head = snake[snake.length - 1];
        if (head.x === food.x && head.y === food.y) {
            setFood(getRandomCoordinates());
            enlargeSnake();
            increaseSpeed();
        }
    };

    const increaseSpeed = () => {
        if (speed > 10) {
            setSpeed(speed - 10);
        }
    };

    const onKeyDown = (e) => {
        e.preventDefault();
        switch (e.keyCode) {
            case 38:
                setDirection('UP');
                break;
            case 40:
                setDirection('DOWN');
                break;
            case 37:
                setDirection('LEFT');
                break;
            case 39:
                setDirection('RIGHT');
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        document.onkeydown = onKeyDown;
        checkIfAteFood();
        moveSnake();
        let gameLoop = setInterval(moveSnake, speed);
        return () => clearInterval(gameLoop);
    });

    return (
        <div>
            <div className="game-area">
                {snake.map((dot, i) => {
                    const style = {
                        left: `${dot.x}%`,
                        top: `${dot.y}%`
                    };
                    return <div className="snake-dot" key={i} style={style}></div>;
                })}
                <div
                    className="food"
                    style={{ left: `${food.x}%`, top: `${food.y}%` }}
                ></div>
            </div>
        </div>
    );
};

export default SnakeGame;
