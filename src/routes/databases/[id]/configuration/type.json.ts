import { getUserDetails } from '$lib/common';
import * as db from '$lib/database';
import { ErrorHandler, supportedDatabaseTypesAndVersions } from '$lib/database';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async (event) => {
	const { teamId, status, body } = await getUserDetails(event);
	if (status === 401) return { status, body };
	return {
		status: 200,
		body: {
			types: supportedDatabaseTypesAndVersions
		}
	};
};

export const post: RequestHandler = async (event) => {
	const { teamId, status, body } = await getUserDetails(event);
	if (status === 401) return { status, body };

	const { id } = event.params;
	const { type } = await event.request.json();

	try {
		await db.configureDatabaseType({ id, type });
		return {
			status: 201
		};
	} catch (error) {
		return ErrorHandler(error);
	}
};
