var React = require('react')
var {DefaultRoute, NotFoundRoute, Route} = require('react-router')

module.exports = [
  <Route path="/" handler={require('./App')}>
    Home
  </Route>,
  <Route path="/about" handler={require('./about')}>
  About
</Route>
]