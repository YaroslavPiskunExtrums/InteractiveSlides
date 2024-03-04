import { Request, Response } from 'express'
import { createTagValidation, linkPresentationToTagValidation, removeTagValidation, updateTagTitleValidation } from './tags-validation.js'
import { ReqAuth } from '@app/lib/interfaces/reqAuth.js'
import { TagsModel } from '@app/lib/db/models/tags.model.js'
import { Presentations_TagsModel } from '@app/lib/db/models/presentation_tags.model.js'
import { HttpError } from '@app/lib/utils/middlewares/http-error.js'
import * as console from 'console'

const createTag = async (req: Request & ReqAuth, res: Response) => {
	const payload = await createTagValidation.validate(req.body)

	const { saas_company_id } = req.auth

	const tag = await TagsModel.query().insertGraphAndFetch({
		company_id: saas_company_id,
		tag_title: payload.tag_title
	})
		.withGraphFetched('presentations')


	res.status(201).json({ status: 'ok', payload: tag })
}

const getTags = async (req: Request & ReqAuth, res: Response) => {
	const { saas_company_id } = req.auth

	const tags = await TagsModel.query()
		.where('company_id', saas_company_id)
		.withGraphFetched('presentations')

	res.status(200).json({ status: 'ok', payload: tags })
}

const linkPresentationToTag = async (req: Request & ReqAuth, res: Response) => {
	const { presentation_id, tag_id } = await linkPresentationToTagValidation.validate(req.body)

	const isLinkExists = await Presentations_TagsModel.query()
		.where('presentation_id', presentation_id)
		.first()

	if (isLinkExists?.tag_id === tag_id && isLinkExists?.presentation_id === presentation_id) {
		throw new HttpError(409, 'Link exists')
	}

	//remove link between presentation and tag
	if (tag_id === -1 && isLinkExists) {
		await Presentations_TagsModel.query().where('presentation_id', presentation_id).delete()
	} else if (tag_id === -1 && !isLinkExists) {
		throw new HttpError(409, 'User has not selected new tag')
	}
	else if (!isLinkExists) {
		await Presentations_TagsModel.query()
			.insert({ presentation_id: presentation_id, tag_id: tag_id })
	} else {
		await Presentations_TagsModel.query()
			.update({ tag_id })
			.where('presentation_id', presentation_id)
	}

	const changedTags = await TagsModel.query()
		.skipUndefined()
		.where('id', tag_id)
		.orWhere('id', isLinkExists?.tag_id)
		.withGraphFetched('presentations')



	res.status(201).json({ status: 'ok', payload: changedTags })
}

const updateTagTitle = async (req: Request & ReqAuth, res: Response) => {
	const payload = await updateTagTitleValidation.validate(req.body)

	const isExist = await TagsModel.query()
		.where('id', payload.tag_id)
		.first()

	if (!isExist) {
		throw new HttpError(404, 'Tag has not found')
	}


	const updatedTag = await TagsModel.query()
		.updateAndFetchById(payload.tag_id, { tag_title: payload.tag_title })
		.withGraphFetched('presentations')
		.first()

	res.status(200).json({ status: 'ok', payload: updatedTag })
}

const removeTag = async (req: Request & ReqAuth, res: Response) => {
	const payload = await removeTagValidation.validate(req.params)

	const isExist = await TagsModel.query()
		.where('id', payload.tag_id)
		.first()

	if (!isExist) {
		throw new HttpError(404, 'Tag has not found')
	}

	await TagsModel.query()
		.deleteById(payload.tag_id)

	res.status(200).json({ status: 'ok' })
}

export const TagController = {
	createTag,
	getTags,
	linkPresentationToTag,
	updateTagTitle,
	removeTag
}
