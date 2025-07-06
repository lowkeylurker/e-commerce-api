/* eslint-disable no-console */
import app from '~/app'
import { env } from '~/configs/environment'

let server = null

if (env.BUILD_MODE === 'production') {
  server = app.listen(process.env.PORT, process.env.HOST, () => {
    console.log(`Server is running on Render at port:${process.env.PORT}`)
  })
} else {
  server = app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
    console.log(
      `Server is running at ${env.LOCAL_DEV_APP_HOST}:${env.LOCAL_DEV_APP_PORT}`
    )
  })
  // swaggerDocs(app)
}

process.on('SIGINT', () => {
  server.close(() => console.log('Exit Server Express'))
})
