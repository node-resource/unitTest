import React from 'react'
import '@/assets/style/pages/tic.css'

const calculateWinner = (squares) => {
  // 以下情形属于赢的规则
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ]
  for(let i=0;i<lines.length;i++){
    const [a,b,c] = lines[i]
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return squares[a]
    }
  }
  return null
}

const Square = (props) => {
  return (
    <span className={'square '+(props.value ==='red'?'bg-danger':props.value ==='green'?'bg-success':'')} onClick={ props.onClick }></span>
  )
}

class Board extends React.Component {
  constructor (props) {
    super()
  }
  renderSquare (i) {
    return (
      <Square
        value = {this.props.squares[i]}
        onClick = {() => this.props.onClick(i)}
      />
    )
  }
  render () {
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
    )
  }
}

class Chess extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      history: [
        { squares: Array(9).fill(null) }
      ],
      stepNumber: 0,
      greenIsNext: true
    }
  }

  handleClick (i) {
    let current = this.state.history.slice(-1)[0]
    const squares = [...current.squares]
    if (calculateWinner(squares) || squares[i]) {
      return
    }
    squares[i] = this.state.greenIsNext ? 'green' : 'red'
    this.setState({
      history: this.state.history.concat([{
        squares: squares
      }]),
      stepNumber: this.state.history.length,
      greenIsNext: !this.state.greenIsNext,
    });
  }

  jumpTo = (step, e) => {
    // e.preventDefault()
    this.setState({
      stepNumber: step,
      greenIsNext: (step % 2) ? false : true,
    });
  }

  render () {
    // 责获取最近一步的历史记录（当前棋局状态），以及计算出游戏进行的状态（是否有人获胜）
    const current = this.state.history[this.state.stepNumber]
    const winner = calculateWinner(current.squares);

    // 记录历史
    const moves = this.state.history.map((step, move) => {
      const desc = move > 0 ?
        'Move #' + move :
        'Game start:';
      return (
        <li key={move}>
          <a href="#" onClick={this.jumpTo.bind(this,move)}>{desc}</a>
        </li>
      );
    });
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: '+(this.state.greenIsNext ? 'green' :'red');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={ (i) => this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{ moves }</ol>
        </div>
      </div>
    )
  }
}

export default Chess