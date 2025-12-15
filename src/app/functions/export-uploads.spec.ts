import { beforeAll, describe, expect, it, vi } from "vitest";
import { randomUUID } from "node:crypto";
import { makeUploads } from "@/test/factories/make-uploads";
import { exportUploads } from "./export-uploads";
import * as upload from "@/infra/storage/upload-file-to-storage";
import { isRight, unwrapEither } from "@/shared/either";

describe('export uploads', () => {
	it('should be able to export uploads', async () => {
		const uploadStub = vi.spyOn(upload, 'uploadFileToStorage').mockImplementationOnce(async () => {
			return {
				key: `${randomUUID}.csv`,
				url: "http://exemple.com/file.csv"
			}
		})

		const namePatter = randomUUID()

		const upload1 = await makeUploads({ name: namePatter })
		const upload2 = await makeUploads({ name: namePatter })
		const upload3 = await makeUploads({ name: namePatter })
		const upload4 = await makeUploads({ name: namePatter })
		const upload5 = await makeUploads({ name: namePatter })

		const sut = await exportUploads({
			searchQuery: namePatter
		})

		const generatedCSVStream = uploadStub.mock.calls[0][0].contentStream
		const csvAsString = await new Promise<string>((resolve, reject) => {
			const chunks: Buffer[] = []

			generatedCSVStream.on('data', (chunk: Buffer) => {
				chunks.push(chunk)
			})

			generatedCSVStream.on('end', () => {
				resolve(Buffer.concat(chunks).toString("utf-8"))
			})

			generatedCSVStream.on('error', (error) => {
				reject(error)
			})
		})

		const csvAsArray = csvAsString
			.trim()
			.split('\n')
			.map((row) => row.split(','))


		expect(isRight(sut)).toBe(true)
		expect(unwrapEither(sut)).toEqual({
			reportUrl: "http://exemple.com/file.csv"
		})

		expect(csvAsArray).toEqual([
			['ID', 'name', 'URL', 'Uploaded at'],
			[upload1.id, upload1.name, upload1.remoteUrl, expect.any(String)],
			[upload2.id, upload2.name, upload2.remoteUrl, expect.any(String)],
			[upload3.id, upload3.name, upload3.remoteUrl, expect.any(String)],
			[upload4.id, upload4.name, upload4.remoteUrl, expect.any(String)],
			[upload5.id, upload5.name, upload5.remoteUrl, expect.any(String)],
		])
	})
})