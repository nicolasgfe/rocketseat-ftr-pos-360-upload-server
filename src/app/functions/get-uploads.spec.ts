import { beforeAll, describe, expect, it, vi } from "vitest";
import { randomUUID } from "node:crypto";
import { getUploads } from "./get-uploads";
import { makeUploads } from "@/test/factories/make-uploads";
import { isRight, unwrapEither } from "@/shared/either";
import dayjs from "dayjs";

describe('get uploads', () => {
	it('should be able to get the uploads', async () => {
		const namePatter = randomUUID()

		const upload1 = await makeUploads({ name: namePatter })
		const upload2 = await makeUploads({ name: namePatter })
		const upload3 = await makeUploads({ name: namePatter })
		const upload4 = await makeUploads({ name: namePatter })
		const upload5 = await makeUploads({ name: namePatter })

		const sut = await getUploads({
			searchQuery: namePatter
		})

		expect(isRight(sut)).toBe(true)

		expect(unwrapEither(sut).total).toEqual(5)
		expect(unwrapEither(sut).uploads).toEqual([
			expect.objectContaining({ id: upload5.id }),
			expect.objectContaining({ id: upload4.id }),
			expect.objectContaining({ id: upload3.id }),
			expect.objectContaining({ id: upload2.id }),
			expect.objectContaining({ id: upload1.id }),
		])
	})


	it('should be able to get paginated uploads', async () => {
		const namePatter = randomUUID()

		const upload1 = await makeUploads({ name: namePatter })
		const upload2 = await makeUploads({ name: namePatter })
		const upload3 = await makeUploads({ name: namePatter })
		const upload4 = await makeUploads({ name: namePatter })
		const upload5 = await makeUploads({ name: namePatter })

		let sut = await getUploads({
			searchQuery: namePatter,
			page: 1,
			pageSize: 3
		})

		expect(isRight(sut)).toBe(true)

		expect(unwrapEither(sut).total).toEqual(5)
		expect(unwrapEither(sut).uploads).toEqual([
			expect.objectContaining({ id: upload5.id }),
			expect.objectContaining({ id: upload4.id }),
			expect.objectContaining({ id: upload3.id }),
		])


		sut = await getUploads({
			searchQuery: namePatter,
			page: 2,
			pageSize: 3
		})

		expect(isRight(sut)).toBe(true)

		expect(unwrapEither(sut).total).toEqual(5)
		expect(unwrapEither(sut).uploads).toEqual([
			expect.objectContaining({ id: upload2.id }),
			expect.objectContaining({ id: upload1.id }),
		])
	})

	it('should be able to get sorted uploads', async () => {
		const namePatter = randomUUID()

		const upload1 = await makeUploads({
			name: namePatter,
			createdAt: new Date()
		})
		const upload2 = await makeUploads({
			name: namePatter,
			createdAt: dayjs().subtract(1, 'days').toDate()
		})
		const upload3 = await makeUploads({
			name: namePatter,
			createdAt: dayjs().subtract(2, 'days').toDate()
		})
		const upload4 = await makeUploads({
			name: namePatter,
			createdAt: dayjs().subtract(3, 'days').toDate()
		})
		const upload5 = await makeUploads({
			name: namePatter,
			createdAt: dayjs().subtract(4, 'days').toDate()
		})

		let sut = await getUploads({
			searchQuery: namePatter,
			sortBy: 'createdAt',
			sortDirection: 'desc'
		})

		expect(isRight(sut)).toBe(true)

		expect(unwrapEither(sut).total).toEqual(5)
		expect(unwrapEither(sut).uploads).toEqual([
			expect.objectContaining({ id: upload1.id }),
			expect.objectContaining({ id: upload2.id }),
			expect.objectContaining({ id: upload3.id }),
			expect.objectContaining({ id: upload4.id }),
			expect.objectContaining({ id: upload5.id }),
		])

		sut = await getUploads({
			searchQuery: namePatter,
			sortBy: 'createdAt',
			sortDirection: 'asc'
		})

		expect(isRight(sut)).toBe(true)

		expect(unwrapEither(sut).total).toEqual(5)
		expect(unwrapEither(sut).uploads).toEqual([
			expect.objectContaining({ id: upload5.id }),
			expect.objectContaining({ id: upload4.id }),
			expect.objectContaining({ id: upload3.id }),
			expect.objectContaining({ id: upload2.id }),
			expect.objectContaining({ id: upload1.id }),
		])
	})



})