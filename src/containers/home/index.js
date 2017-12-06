import React from 'react'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  increment,
  incrementAsync,
  decrement,
  decrementAsync
} from '../../modules/counter'

 class Home extends React.Component{
  login = () => {
    this.props.history.push('/login')
  }
  render(){
    return(
        <div>
          <h1>Home</h1>
          <p>Count: {this.props.count}</p>

          <p>
            <button onClick={this.props.increment} disabled={this.props.isIncrementing}>Increment</button>
            <button onClick={this.props.incrementAsync} disabled={this.props.isIncrementing}>Increment Async</button>
          </p>

          <p>
            <button onClick={this.props.decrement} disabled={this.props.isDecrementing}>Decrementing</button>
            <button onClick={this.props.decrementAsync} disabled={this.props.isDecrementing}>Decrement Async</button>
          </p>

          <p><button onClick={() => this.props.changePage()}>Go to about page via redux</button></p>
           <p><button onClick={this.login}>Logout</button></p>
        </div>
      )
  }
 } 

const mapStateToProps = state => ({
  count: state.counter.count,
  isIncrementing: state.counter.isIncrementing,
  isDecrementing: state.counter.isDecrementing
})

const mapDispatchToProps = dispatch => bindActionCreators({
  increment,
  incrementAsync,
  decrement,
  decrementAsync,
  changePage: () => push('/about-us')
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
