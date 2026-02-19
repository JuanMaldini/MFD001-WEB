import Link from 'next/link';
import "./globals.css";

export default function Home() {
    return (
        <main className="bg-black gap-2 flex flex-col min-h-screen items-center justify-center">

            <div className='flex flex-wrap gap-2'>
                <Link href="/design-planner">
                    <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
                        Start app
                    </button>
                </Link>
                <Link href="/material-preset">
                    <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
                        Material Presets
                    </button>
                </Link>
                <Link href="/material-viewer">
                    <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
                        Material Viewer
                    </button>
                </Link>
            </div>

        </main>
    );
}
