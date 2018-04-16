import user from './user'
import teacher from './teacher'
import admin from './admin'
import date from './date'

function routes(app) {
  app.use('/user', user)
  app.use('/teacher', teacher)
  app.use('/admin', admin)
  app.use('/date', date)
}


export default routes
