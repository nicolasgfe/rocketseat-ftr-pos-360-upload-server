import { beforeAll, describe, expect, it, vi } from "vitest";
import { randomUUID } from "node:crypto";
import { getUploads } from "./get-uploads";
import { makeUploads } from "@/test/factories/make-uploads";
import { isRight, unwrapEither } from "@/shared/either";
import dayjs from "dayjs";
import { exportUploads } from "./export-uploads";

describe('export uploads', () => {
	it('should be able to export uploads', async () => {
		const namePatter = randomUUID()

		const upload1 = await makeUploads({ name: namePatter })
		const upload2 = await makeUploads({ name: namePatter })
		const upload3 = await makeUploads({ name: namePatter })
		const upload4 = await makeUploads({ name: namePatter })
		const upload5 = await makeUploads({ name: namePatter })

		const sut = await exportUploads({
			searchQuery: namePatter
		})

		
	})
})