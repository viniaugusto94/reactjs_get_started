import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}


class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                rowPosition: Number(null),
                colPosition: Number(null),
            }],
            xIsNext: true,
            stepNumber: 0,
            strongLine: Number(null)
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1)
        const current = history[history.length - 1];

        const cur_row_pos = this.getRowPosition(i + 1)
        const cur_col_pos = this.getColPosition(i + 1)
        

        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                rowPosition: cur_row_pos,
                colPosition: cur_col_pos,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
            strongLine: history.length
        });
    }

    getRowPosition(i) {
        if (i <= 3) {
            return 1;
        } else if ( i <= 6) {
            return 2;
        }
        return 3;       
    }

    getColPosition(i) {
        const firstCol = [ 1, 4, 7];
        const secondCol = [ 2, 5, 8];

        if (firstCol.includes(i)) {
            return 1;
        } else if (secondCol.includes(i)) {
            return 2;
        } else {
            return 3;
        };
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            strongLine: step 
        });
        
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        

        const moves = history.map((step, move, arr) => {
            const desc = move ?
                `Go to move # ${move}, the last move was in Row-${step.rowPosition} x Col-${step.colPosition};`:
                'Go to move start';

            

            return (
                <li key={move}  >
                    <button className={this.state.strongLine === move? 'currentMove' : ''} onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
