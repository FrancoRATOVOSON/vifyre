import { cleanEnv, makeValidator, str } from 'envalid'

const appPortValidator = makeValidator<number>(value => {
  const port = Number.parseInt(value, 10)
  if (Number.isNaN(port)) throw new Error('Error when getting port from .env')
  return port
})

const env = cleanEnv(
  process.env,
  {
    PORT: appPortValidator(),
    NODE_ENV: str({
      choices: ['development', 'test', 'production'],
      default: 'development'
    })
  },
  {
    reporter: ({ errors }) => {
      for (const [envVariable, error] of Object.entries(errors)) {
        console.error(`Environment variable error - on ${envVariable} [${error}]`)
      }
    }
  }
)

export default env
