import {NextResponse} from "next/server";

export async function POST(req: Request) {
	const data = await req.formData()
	const fss = data.getAll('file') as File[]
	console.log(fss)

	// const result = await execute(fss)


	return NextResponse.json({
		url: 'hello'
	}, {
		status: 200
	})
}
