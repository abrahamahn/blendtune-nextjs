import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import jwt from '@fastify/jwt'
import cookie from '@fastify/cookie'
import multipart from '@fastify/multipart'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Create Fastify instance
const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  },
})

// Register plugins
await fastify.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
})

await fastify.register(helmet, {
  contentSecurityPolicy: false, // Customize as needed
})

await fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
})

await fastify.register(cookie)
await fastify.register(multipart)

// Swagger documentation
await fastify.register(swagger, {
  openapi: {
    info: {
      title: 'BlendTune API',
      description: 'API documentation for BlendTune',
      version: '2.0.0',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
  },
})

await fastify.register(swaggerUI, {
  routePrefix: '/docs',
})

// Health check
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

// Start server
const start = async () => {
  try {
    const port = Number(process.env.PORT) || 5000
    await fastify.listen({ port, host: '0.0.0.0' })
    console.log(`🚀 Server running at http://localhost:${port}`)
    console.log(`📚 API docs at http://localhost:${port}/docs`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
