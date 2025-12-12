import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { uploadImage } from '@/app/functions/upload-image'
import { isRight, unwrapEither } from '@/shered/either'

export const uploadImageRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/uploads',
    {
      schema: {
        summary: 'Upload as Image',
        consumes: ['multipart/form-data'],
        response: {
          201: z.null().describe("image uploaded"),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const uploadedFile = await request.file({
        limits: {
          fileSize: 1024 * 1024 * 2 //2mb
        }
      })

      if (!uploadedFile) {
        return reply.status(400).send({ message: "File is Required." })
      }

      const result = await uploadImage({
        fileName: uploadedFile.filename,
        contentType: uploadedFile.mimetype,
        contentStream: uploadedFile.file
      })

      if (uploadedFile.file.truncated) {
        return reply.status(400).send({
          message: "File size limit reached."
        })
      }

      if (isRight(result)) {
        console.log(unwrapEither(result));

        return reply.status(201).send()
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        case "invalidFileFormat":
          return reply.status(400).send({ message: error.message })
      }
    }
  )
}



