import {Wizard} from "@/app/components/wizard"

export default function Home() {
	return (
		<div>
			<div className="min-h-full">
				<div className="bg-indigo-600 pb-32">
					<header className="py-10">
						<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
							<h1 className="text-3xl font-bold tracking-tight text-white">uAppeal</h1>
						</div>
					</header>
				</div>

				<main className="-mt-32">
					<div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 overflow-x-scroll">
						<div className="rounded-lg bg-white px-5 py-6 shadow sm:px-6">
							{/*<FileUpload />*/}
							<div className="flex flex-col">
									<Wizard />
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	)
}
