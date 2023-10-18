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

	const prompt = `${Anthropic.HUMAN_PROMPT} scan the following legal text for any listed exhibits:
<legal text>${text}</legal text> list just the names of exhibits you found${Anthropic.AI_PROMPT}Based on the legal text provided, the following exhibits were listed:`
	const result = await anthropic.completions.create({
		model: 'claude-2',
		prompt,
		max_tokens_to_sample: 2000
	})

	console.log('result', result)
	const exhibits = result.completion
		.trim()
		.split('\n')
		.filter((e) => e !== '')
		.map(exhibit => exhibit.split("-").slice(1).join(" ").trim())

	return NextResponse.json({
		// exhibits: ["exhibit 1", "exhibit 2"]
		exhibits: exhibits
	},{
		status: 200
	})
}