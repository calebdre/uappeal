import {NextResponse} from "next/server";
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
	apiKey: process.env.ANTHROPIC_API_KEY
});


export async function POST(req: Request) {
	const params = await req.json()
	const text = params.text
	if (!text || text.length === 0) {
		return new Response('Missing text', {
			status: 400
		})
	}

	const prompt = `${Anthropic.HUMAN_PROMPT} scan the following legal text for any listed exhibits. They may be labeled as Exhibit 1: {name}, Exhibit A: {name}, Exhibit B is a copy of {name}, etc.
<legal text>${text}</legal text> list the name (not including the number) for each of exhibits you found as a json list. ${Anthropic.AI_PROMPT}Based on the legal text provided, here are the names of the listed exhibits as a json list: \`\`\`json`
	const result = await anthropic.completions.create({
		model: 'claude-2',
		prompt,
		max_tokens_to_sample: 5000
	})

	console.log('result', result)
	console.log('result', JSON.parse(result.completion.slice(0, -3).trim()))

	// let  exhibits = result.completion
	// 	.split('\n')
	//
	// console.log('splitted', exhibits)
	// exhibits = exhibits
	// 	.map((e) => e.trim())
	// 	.filter((e) => e !== '')
	// console.log('filtered', exhibits)
	// exhibits = exhibits
	// 	.map(exhibit => exhibit.split("-").slice(1).join(" ").trim())

	return NextResponse.json({
		exhibits: ["exhibit 1", "exhibit 2"]
		// exhibits: exhibits
	},{
		status: 200
	})
}